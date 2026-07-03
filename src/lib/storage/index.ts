import { StorageProvider } from "./interface";
import { S3StorageProvider } from "./s3-storage";
import { MockStorageProvider } from "./mock-storage";

let provider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!provider) {
    const endpoint = process.env.S3_ENDPOINT || "";
    const keyId = process.env.S3_ACCESS_KEY_ID || "";
    const hasRealS3 = endpoint && !endpoint.includes("localhost") && !endpoint.includes("127.0.0.1") && keyId;
    provider = hasRealS3 ? new S3StorageProvider() : new MockStorageProvider();
  }
  return provider;
}

export function setStorageProvider(p: StorageProvider) {
  provider = p;
}

export type { StorageProvider, FileUploadResult } from "./interface";
