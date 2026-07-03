"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface SongData {
  id: string;
  title: string;
  prompt: string;
  lyrics: string | null;
  durationSec: number;
  audioUrl: string;
  format: string;
  createdAt: string;
}

interface SongDetailClientProps {
  song: SongData;
}

export function SongDetailClient({ song }: SongDetailClientProps) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/songs/${song.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/library");
      }
    } catch {
      setDeleting(false);
    }
    setShowDelete(false);
  }

  const date = new Date(song.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{song.title}</h1>
        <p className="text-sm text-zinc-500">Created {date}</p>
      </div>

      <AudioPlayer src={song.audioUrl} title={song.title} />

      <div>
        <h2 className="mb-1 text-sm font-medium text-zinc-400">Prompt</h2>
        <p className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-zinc-300">
          {song.prompt}
        </p>
      </div>

      {song.lyrics && (
        <div>
          <h2 className="mb-1 text-sm font-medium text-zinc-400">Lyrics</h2>
          <pre className="whitespace-pre-wrap rounded-md bg-zinc-900 px-3 py-2 text-sm text-zinc-300 font-sans">
            {song.lyrics}
          </pre>
        </div>
      )}

      <div className="flex gap-3">
        <a
          href={song.audioUrl}
          download={`${song.title}.${song.format}`}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-500"
        >
          Download
        </a>
        <button
          onClick={() => setShowDelete(true)}
          disabled={deleting}
          className="rounded-md bg-red-600/20 px-4 py-2 text-sm text-red-400 transition hover:bg-red-600/30 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Delete song"
        message="Are you sure you want to delete this song? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
