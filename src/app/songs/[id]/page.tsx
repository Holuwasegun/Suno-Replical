import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SongDetailClient } from "./SongDetailClient";

interface PageProps {
  params: { id: string };
}

export default async function SongDetailPage({ params }: PageProps) {
  const song = await prisma.song.findUnique({ where: { id: params.id } });

  if (!song) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg">
      <SongDetailClient
        song={{
          id: song.id,
          title: song.title,
          prompt: song.prompt,
          lyrics: song.lyrics,
          durationSec: song.durationSec,
          audioUrl: song.audioUrl,
          format: song.format,
          createdAt: song.createdAt.toISOString(),
        }}
      />
    </div>
  );
}
