export interface MusicGenerationParams {
  prompt: string;
  lyrics: string | null;
  lyricsMode: "USER_PROVIDED" | "AI_GENERATED" | "INSTRUMENTAL";
  targetLength: number;
}

export interface MusicGenerationResult {
  audioBuffer: Buffer;
  format: string;
  title: string;
  durationSec: number;
  lyrics: string | null;
}

export interface MusicGenerationProvider {
  generate(params: MusicGenerationParams): Promise<MusicGenerationResult>;
}
