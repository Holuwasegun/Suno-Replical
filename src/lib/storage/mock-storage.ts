import { StorageProvider, FileUploadResult } from "./interface";

const audioStore = new Map<string, { buffer: Buffer; contentType: string }>();

export class MockStorageProvider implements StorageProvider {
  private baseUrl: string;

  constructor() {
    const deploymentUrl = process.env.VERCEL_URL || "http://localhost:3000";
    this.baseUrl = `https://${deploymentUrl}`;
  }

  async upload(buffer: Buffer, key: string, contentType: string): Promise<FileUploadResult> {
    audioStore.set(key, { buffer, contentType });
    return {
      url: this.getUrl(key),
      key,
    };
  }

  getUrl(key: string): string {
    return `${this.baseUrl}/api/audio/${encodeURIComponent(key)}`;
  }

  async delete(key: string): Promise<void> {
    audioStore.delete(key);
  }

  static getAudio(key: string): { buffer: Buffer; contentType: string } | undefined {
    return audioStore.get(key);
  }
}
