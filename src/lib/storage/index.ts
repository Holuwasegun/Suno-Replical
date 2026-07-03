import { StorageProvider } from "./interface";
import { S3StorageProvider } from "./s3-storage";

let provider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!provider) {
    provider = new S3StorageProvider();
  }
  return provider;
}

export function setStorageProvider(p: StorageProvider) {
  provider = p;
}

export type { StorageProvider, FileUploadResult } from "./interface";
