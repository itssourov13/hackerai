/** Storage adapter interface — all providers implement this */
export interface StorageAdapter {
  upload(key: string, body: Buffer | Uint8Array | ReadableStream, options?: UploadOptions): Promise<UploadResult>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  deleteMany(keys: string[]): Promise<void>;
  list(prefix?: string): Promise<StorageFile[]>;
  getSignedUploadUrl(key: string, expiresIn?: number): Promise<string>;
  getSignedDownloadUrl(key: string, expiresIn?: number): Promise<string>;
  getPublicUrl(key: string): string;
  exists(key: string): Promise<boolean>;
  metadata(key: string): Promise<FileMetadata | null>;
  copy(sourceKey: string, destKey: string): Promise<void>;
  move(sourceKey: string, destKey: string): Promise<void>;
}

export interface UploadOptions {
  contentType?: string;
  contentDisposition?: string;
  metadata?: Record<string, string>;
  isPublic?: boolean;
}

export interface UploadResult {
  key: string;
  url: string;
  size?: number;
  etag?: string;
}

export interface StorageFile {
  key: string;
  size: number;
  lastModified: Date;
  etag?: string;
}

export interface FileMetadata {
  key: string;
  size: number;
  contentType?: string;
  lastModified: Date;
  etag?: string;
  metadata?: Record<string, string>;
}

export type StorageProvider = 'aws-s3' | 'cloudflare-r2' | 'minio' | 'supabase';
