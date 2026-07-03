import Link from "next/link";

interface SongCardProps {
  id: string;
  title: string;
  durationSec: number;
  createdAt: string;
  prompt: string;
}

export function SongCard({ id, title, durationSec, createdAt, prompt }: SongCardProps) {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const durationStr =
    durationSec < 60 ? `${durationSec}s` : `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`;

  return (
    <Link
      href={`/songs/${id}`}
      className="block rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700"
    >
      <h3 className="mb-1 font-medium text-white">{title}</h3>
      <p className="mb-2 text-sm text-zinc-500 line-clamp-1">{prompt}</p>
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span>{durationStr}</span>
        <span>{date}</span>
      </div>
    </Link>
  );
}
