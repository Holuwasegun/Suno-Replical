import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getQuota, incrementQuota, checkCooldown } from "@/lib/quota";
import { moderatePrompt } from "@/lib/moderation";
import { getMusicProvider } from "@/lib/providers";
import { getStorageProvider } from "@/lib/storage";
import { getAnonymousUserId } from "@/lib/anonymous-user";

export const dynamic = "force-dynamic";

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

    await incrementQuota(userId);

    const provider = getMusicProvider();
    const result = await provider.generate({
      prompt: prompt.trim(),
      lyrics: lyricsMode === "USER_PROVIDED" ? userLyrics?.trim() : null,
      lyricsMode,
      targetLength,
    });

    const key = `songs/${userId}/${crypto.randomUUID()}.${result.format}`;
    const storage = getStorageProvider();
    const contentType = result.format === "mp3" ? "audio/mpeg" : "audio/wav";
    const { url } = await storage.upload(result.audioBuffer, key, contentType);

    const song = await prisma.song.create({
      data: {
        userId,
        title: result.title,
        prompt: prompt.trim(),
        lyrics: result.lyrics,
        durationSec: result.durationSec,
        audioUrl: url,
        format: result.format,
      },
    });

    return NextResponse.json({ songId: song.id }, { status: 201 });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
