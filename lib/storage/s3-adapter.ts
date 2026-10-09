import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type {
  StorageAdapter,
  UploadOptions,
  UploadResult,
  StorageFile,
  FileMetadata,
} from './types';

interface S3AdapterConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  endpoint?: string;     // For R2 / MinIO compatibility
  forcePathStyle?: boolean;
  publicBaseUrl?: string;
  defaultSignedUrlExpiry?: number;
}

export class S3Adapter implements StorageAdapter {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl?: string;
  private readonly defaultExpiry: number;

  constructor(config: S3AdapterConfig) {
    this.bucket = config.bucket;
    this.publicBaseUrl = config.publicBaseUrl;
    this.defaultExpiry = config.defaultSignedUrlExpiry ?? 3600;

    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      ...(config.endpoint && { endpoint: config.endpoint }),
      ...(config.forcePathStyle && { forcePathStyle: true }),
    });
  }

  async upload(
    key: string,
    body: Buffer | Uint8Array | ReadableStream,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body as any,
        ContentType: options.contentType,
        ContentDisposition: options.contentDisposition,
        Metadata: options.metadata,
        ACL: options.isPublic ? 'public-read' : 'private',
      })
    );

    return {
      key,
      url: this.getPublicUrl(key),
    };
  }

  async download(key: string): Promise<Buffer> {
    const response = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: key })
    );

    const chunks: Uint8Array[] = [];
    const stream = response.Body as any;

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key })
    );
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) return;

    const chunks: string[][] = [];
    for (let i = 0; i < keys.length; i += 1000) {
      chunks.push(keys.slice(i, i + 1000));
    }

    await Promise.all(
      chunks.map((chunk) =>
        this.client.send(
          new DeleteObjectsCommand({
            Bucket: this.bucket,
            Delete: { Objects: chunk.map((Key) => ({ Key })) },
          })
        )
      )
    );
  }

  async list(prefix?: string): Promise<StorageFile[]> {
    const files: StorageFile[] = [];
    let continuationToken: string | undefined;

    do {
      const response = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        })
      );

      for (const item of response.Contents ?? []) {
        if (item.Key) {
          files.push({
            key: item.Key,
            size: item.Size ?? 0,
            lastModified: item.LastModified ?? new Date(),
            etag: item.ETag,
          });
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return files;
  }

  async getSignedUploadUrl(key: string, expiresIn?: number): Promise<string> {
    return getSignedUrl(
      this.client,
      new PutObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn: expiresIn ?? this.defaultExpiry }
    );
  }

  async getSignedDownloadUrl(key: string, expiresIn?: number): Promise<string> {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn: expiresIn ?? this.defaultExpiry }
    );
  }

  getPublicUrl(key: string): string {
    if (this.publicBaseUrl) return `${this.publicBaseUrl}/${key}`;
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key })
      );
      return true;
    } catch {
      return false;
    }
  }

  async metadata(key: string): Promise<FileMetadata | null> {
    try {
      const response = await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key })
      );
      return {
        key,
        size: response.ContentLength ?? 0,
        contentType: response.ContentType,
        lastModified: response.LastModified ?? new Date(),
        etag: response.ETag,
        metadata: response.Metadata,
      };
    } catch {
      return null;
    }
  }

  async copy(sourceKey: string, destKey: string): Promise<void> {
    await this.client.send(
      new CopyObjectCommand({
        Bucket: this.bucket,
        CopySource: `${this.bucket}/${sourceKey}`,
        Key: destKey,
      })
    );
  }

  async move(sourceKey: string, destKey: string): Promise<void> {
    await this.copy(sourceKey, destKey);
    await this.delete(sourceKey);
  }
}
