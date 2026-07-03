"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-white">
          Sonatune
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/generate"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Generate
          </Link>
          <Link
            href="/library"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Library
          </Link>
        </div>
      </div>
    </nav>
  );
}
