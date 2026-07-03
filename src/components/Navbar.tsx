"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-white">
          Sonatune
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
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
              <span className="text-sm text-zinc-500">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-700"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-zinc-400 transition hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white transition hover:bg-green-500"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
