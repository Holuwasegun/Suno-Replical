import { MusicGenerationProvider } from "./interface";
import { FallbackProvider } from "./fallback-provider";

let provider: MusicGenerationProvider | null = null;

export function getMusicProvider(): MusicGenerationProvider {
  if (!provider) {
    provider = new FallbackProvider();
  }
  return provider;
}

export function setMusicProvider(p: MusicGenerationProvider) {
  provider = p;
}

export type { MusicGenerationProvider, MusicGenerationParams, MusicGenerationResult } from "./interface";
