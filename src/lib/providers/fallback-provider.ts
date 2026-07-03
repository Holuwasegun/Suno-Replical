import { MusicGenerationProvider, MusicGenerationParams, MusicGenerationResult } from "./interface";

export class FallbackProvider implements MusicGenerationProvider {
  async generate(params: MusicGenerationParams): Promise<MusicGenerationResult> {
    const sampleRate = 44100;
    const durationSec = params.targetLength;
    const numSamples = sampleRate * durationSec;

    const numChannels = 2;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = numSamples * numChannels * (bitsPerSample / 8);
    const fileSize = 44 + dataSize;

    const buffer = Buffer.alloc(fileSize);
    let offset = 0;

    const writeString = (str: string) => {
      for (let i = 0; i < str.length; i++) {
        buffer.writeUInt8(str.charCodeAt(i), offset++);
      }
    };

    writeString("RIFF");
    buffer.writeUInt32LE(fileSize - 8, offset); offset += 4;
    writeString("WAVE");
    writeString("fmt ");
    buffer.writeUInt32LE(16, offset); offset += 4;
    buffer.writeUInt16LE(1, offset); offset += 2;
    buffer.writeUInt16LE(numChannels, offset); offset += 2;
    buffer.writeUInt32LE(sampleRate, offset); offset += 4;
    buffer.writeUInt32LE(byteRate, offset); offset += 4;
    buffer.writeUInt16LE(blockAlign, offset); offset += 2;
    buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;
    writeString("data");
    buffer.writeUInt32LE(dataSize, offset); offset += 4;

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const freq = 220 + Math.sin(2 * Math.PI * 0.5 * t) * 80;
      const envelope = Math.min(1, Math.max(0, 1 - t / durationSec));
      const sample = Math.sin(2 * Math.PI * freq * t) * 0.3 * envelope;
      const value = Math.max(-32768, Math.min(32767, Math.round(sample * 32767)));
      for (let ch = 0; ch < numChannels; ch++) {
        buffer.writeInt16LE(value, offset);
        offset += 2;
      }
    }

    const words = params.prompt.split(" ").slice(0, 5);
    const title = words.length > 0
      ? words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "Generated Track";

    return {
      audioBuffer: buffer,
      format: "wav",
      title,
      durationSec,
      lyrics: params.lyrics,
    };
  }
}
