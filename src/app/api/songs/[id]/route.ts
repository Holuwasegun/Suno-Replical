import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const song = await prisma.song.findUnique({
      where: { id: params.id },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
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
    const song = await prisma.song.findUnique({
      where: { id: params.id },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    await prisma.song.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Song deleted" });
  } catch (error) {
    console.error("Song delete error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
