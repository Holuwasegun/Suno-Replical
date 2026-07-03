"use client";

import { useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  title: string;
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onEnded={() => setPlaying(false)}
      />

      <div className="mb-2 text-sm font-medium text-zinc-300">{title}</div>

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm text-white transition hover:bg-green-500"
        >
          {playing ? "⏸" : "▶"}
        </button>

        <span className="w-10 text-xs text-zinc-500 tabular-nums">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 accent-green-500"
        />

        <span className="w-10 text-right text-xs text-zinc-500 tabular-nums">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
