import { prisma } from "@/lib/prisma";
import { getAnonymousUserId } from "@/lib/anonymous-user";
import { LibraryClient } from "./LibraryClient";

export default async function LibraryPage() {
  const userId = await getAnonymousUserId();

  const songs = await prisma.song.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      durationSec: true,
      createdAt: true,
      prompt: true,
    },
  });

  const serialized = songs.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Your library</h1>
      {serialized.length === 0 ? (
        <p className="text-zinc-500">No songs yet. Generate your first song!</p>
      ) : (
        <LibraryClient songs={serialized} />
      )}
    </div>
  );
}
