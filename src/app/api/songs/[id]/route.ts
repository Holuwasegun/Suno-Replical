import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStorageProvider } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const song = await prisma.song.findUnique({
      where: { id: params.id },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    if (song.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({
      id: song.id,
      title: song.title,
      prompt: song.prompt,
      lyrics: song.lyrics,
      durationSec: song.durationSec,
      audioUrl: song.audioUrl,
      format: song.format,
      createdAt: song.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Song detail error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const song = await prisma.song.findUnique({
      where: { id: params.id },
      include: { job: true },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    if (song.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const jobId = song.jobId;

    await prisma.song.delete({ where: { id: params.id } });
    await prisma.generationJob.delete({ where: { id: jobId } });

    return NextResponse.json({ message: "Song deleted" });
  } catch (error) {
    console.error("Song delete error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
