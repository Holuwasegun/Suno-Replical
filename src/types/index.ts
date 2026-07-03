export type { User, Song, GenerationJob, QuotaWindow } from "@prisma/client";
export type { LyricsMode, JobStatus } from "@prisma/client";

export interface GenerateRequest {
  prompt: string;
  lyricsMode: "USER_PROVIDED" | "AI_GENERATED" | "INSTRUMENTAL";
  userLyrics?: string;
  targetLength: number;
}

export interface GenerateResponse {
  songId: string;
}

export interface JobStatusResponse {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETE" | "FAILED";
  failureReason?: string;
  songId?: string;
}

export interface QuotaResponse {
  used: number;
  limit: number;
  remaining: number;
}

export interface SongResponse {
  id: string;
  title: string;
  prompt: string;
  lyrics: string | null;
  durationSec: number;
  audioUrl: string;
  format: string;
  createdAt: string;
}

export interface ApiError {
  error: string;
}
