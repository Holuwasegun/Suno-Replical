import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getQuota, incrementQuota, decrementQuota, hasActiveJob, checkCooldown } from "@/lib/quota";
import { moderatePrompt } from "@/lib/moderation";
import { getMusicProvider } from "@/lib/providers";
import { getStorageProvider } from "@/lib/storage";
import { getAnonymousUserId } from "@/lib/anonymous-user";

export async function POST(request: Request) {
  try {
    const userId = await getAnonymousUserId();
    const onCooldown = await checkCooldown(userId);
    if (onCooldown) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please try again in about an hour." },
        { status: 429 }
      );
    }

    const { prompt, lyricsMode, userLyrics, targetLength } = await request.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt must be under 2000 characters" },
        { status: 400 }
      );
    }

    const moderation = moderatePrompt(prompt);
    if (moderation.flagged) {
      return NextResponse.json(
        { error: moderation.reason },
        { status: 400 }
      );
    }

    if (!["USER_PROVIDED", "AI_GENERATED", "INSTRUMENTAL"].includes(lyricsMode)) {
      return NextResponse.json(
        { error: "Invalid lyrics mode" },
        { status: 400 }
      );
    }

    if (lyricsMode === "USER_PROVIDED") {
      if (!userLyrics || userLyrics.trim().length === 0) {
        return NextResponse.json(
          { error: "Lyrics are required when writing your own" },
          { status: 400 }
        );
      }
      if (userLyrics.length > 1500) {
        return NextResponse.json(
          { error: "Lyrics must be under 1500 characters" },
          { status: 400 }
        );
      }
    }

    const validLengths = [30, 60, 90, 120];
    if (!validLengths.includes(targetLength)) {
      return NextResponse.json(
        { error: "Target length must be 30, 60, 90, or 120 seconds" },
        { status: 400 }
      );
    }

    const { remaining } = await getQuota(userId);
    if (remaining <= 0) {
      return NextResponse.json(
        { error: "Daily generation limit reached. Try again later." },
        { status: 429 }
      );
    }

    if (await hasActiveJob(userId)) {
      return NextResponse.json(
        { error: "You already have a generation in progress. Please wait for it to complete." },
        { status: 429 }
      );
    }

    const job = await prisma.generationJob.create({
      data: {
        userId,
        prompt: prompt.trim(),
        lyricsMode,
        userLyrics: lyricsMode === "USER_PROVIDED" ? userLyrics.trim() : null,
        targetLength,
        status: "PENDING",
      },
    });

    incrementQuota(userId).catch((err) =>
      console.error("Failed to increment quota:", err)
    );

    processGenerationJob(job.id).catch((err) =>
      console.error("Generation job failed:", err)
    );

    return NextResponse.json({ jobId: job.id }, { status: 202 });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

async function processGenerationJob(jobId: string) {
  try {
    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: "PROCESSING", startedAt: new Date() },
    });

    const job = await prisma.generationJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    const provider = getMusicProvider();

    const result = await provider.generate({
      prompt: job.prompt,
      lyrics: job.userLyrics,
      lyricsMode: job.lyricsMode as "USER_PROVIDED" | "AI_GENERATED" | "INSTRUMENTAL",
      targetLength: job.targetLength,
    });

    const key = `songs/${job.userId}/${jobId}.${result.format}`;
    const storage = getStorageProvider();
    const contentType = result.format === "mp3" ? "audio/mpeg" : "audio/wav";
    const { url } = await storage.upload(result.audioBuffer, key, contentType);

    await prisma.song.create({
      data: {
        userId: job.userId,
        jobId: job.id,
        title: result.title,
        prompt: job.prompt,
        lyrics: result.lyrics,
        durationSec: result.durationSec,
        audioUrl: url,
        format: result.format,
      },
    });

    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: "COMPLETE", completedAt: new Date() },
    });
  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);

    await prisma.generationJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        failureReason: error instanceof Error ? error.message : "Generation failed",
        completedAt: new Date(),
      },
    });

    const job = await prisma.generationJob.findUnique({
      where: { id: jobId },
    });
    if (job) {
      await decrementQuota(job.userId);
    }
  }
}
