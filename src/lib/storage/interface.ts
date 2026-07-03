export interface FileUploadResult {
  url: string;
  key: string;
}

export interface StorageProvider {
  upload(buffer: Buffer, key: string, contentType: string): Promise<FileUploadResult>;
  getUrl(key: string): string;
  delete(key: string): Promise<void>;
}
