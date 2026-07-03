import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { StorageProvider, FileUploadResult } from "./interface";

export class S3StorageProvider implements StorageProvider {
  private client: S3Client;
  private bucket: string;
  private endpoint: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET || "suno-replical-audio";
    this.endpoint = process.env.S3_ENDPOINT || "http://localhost:9000";

    this.client = new S3Client({
      endpoint: this.endpoint,
      region: process.env.S3_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
      },
      forcePathStyle: true,
    });
  }

  async upload(buffer: Buffer, key: string, contentType: string): Promise<FileUploadResult> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    return {
      url: this.getUrl(key),
      key,
    };
  }

  getUrl(key: string): string {
    return `${this.endpoint}/${this.bucket}/${key}`;
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }
}
