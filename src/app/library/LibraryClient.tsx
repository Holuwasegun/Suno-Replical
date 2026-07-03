"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SongCard } from "@/components/SongCard";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface SongItem {
  id: string;
  title: string;
  durationSec: number;
  createdAt: string;
  prompt: string;
}

interface LibraryClientProps {
  songs: SongItem[];
}

export function LibraryClient({ songs }: LibraryClientProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function confirmDelete() {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/songs/${deleting}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      
    }
    setDeleting(null);
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {songs.map((song) => (
          <div key={song.id} className="group relative">
            <SongCard {...song} />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDeleting(song.id);
              }}
              className="absolute right-2 top-2 rounded-md bg-red-900/50 px-2 py-1 text-xs text-red-300 opacity-0 transition hover:bg-red-800 group-hover:opacity-100"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleting}
        title="Delete song"
        message="Are you sure you want to delete this song? This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
