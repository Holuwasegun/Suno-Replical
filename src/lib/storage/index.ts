import { StorageProvider } from "./interface";
import { S3StorageProvider } from "./s3-storage";
import { MockStorageProvider } from "./mock-storage";

let provider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!provider) {
    const hasS3Creds = process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY_ID;
    provider = hasS3Creds ? new S3StorageProvider() : new MockStorageProvider();
  }
  return provider;
}

export function setStorageProvider(p: StorageProvider) {
  provider = p;
}

export type { StorageProvider, FileUploadResult } from "./interface";
