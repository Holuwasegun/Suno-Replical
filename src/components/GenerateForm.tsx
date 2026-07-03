"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LyricsEditor } from "./LyricsEditor";

export function GenerateForm() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [lyricsMode, setLyricsMode] = useState<"AI_GENERATED" | "USER_PROVIDED" | "INSTRUMENTAL">("AI_GENERATED");
  const [userLyrics, setUserLyrics] = useState("");
  const [targetLength, setTargetLength] = useState(60);
  const [quota, setQuota] = useState({ remaining: 5, limit: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchQuota = useCallback(async () => {
    try {
      const res = await fetch("/api/quota");
      if (res.ok) {
        setQuota(await res.json());
      }
    } catch {
      
    }
  }, []);

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!prompt.trim()) {
      setError("Please enter a song description.");
      return;
    }

    if (quota.remaining <= 0) {
      setError("Daily generation limit reached.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          lyricsMode,
          userLyrics: lyricsMode === "USER_PROVIDED" ? userLyrics.trim() : undefined,
          targetLength,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed");
        setSubmitting(false);
        return;
      }

      router.push(`/songs/${data.songId}`);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  const buttonDisabled = submitting || quota.remaining <= 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-400">
          Describe your song
        </label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Upbeat electronic track with synth leads and a driving bassline"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-400">
          Lyrics
        </label>
        <div className="flex gap-2">
          {[
            { value: "AI_GENERATED", label: "AI generated" },
            { value: "USER_PROVIDED", label: "Write my own" },
            { value: "INSTRUMENTAL", label: "Instrumental only" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setLyricsMode(option.value as typeof lyricsMode);
                if (option.value !== "USER_PROVIDED") setUserLyrics("");
              }}
              className={`rounded-md px-3 py-1.5 text-xs transition ${
                lyricsMode === option.value
                  ? "bg-green-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {lyricsMode === "USER_PROVIDED" && (
        <LyricsEditor value={userLyrics} onChange={setUserLyrics} />
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-400">
          Duration
        </label>
        <div className="flex gap-2">
          {[30, 60, 90, 120].map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setTargetLength(sec)}
              className={`rounded-md px-3 py-1.5 text-xs transition ${
                targetLength === sec
                  ? "bg-green-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-500">
          Remaining today:{" "}
          <span className="font-medium text-zinc-300">
            {quota.remaining} / {quota.limit}
          </span>
        </div>

        <button
          type="submit"
          disabled={buttonDisabled}
          className="rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Starting..." : "Generate"}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/50 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}
    </form>
  );
}
