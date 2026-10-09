import type { StorageAdapter, StorageProvider } from './types';
import { S3Adapter } from './s3-adapter';

let _instance: StorageAdapter | null = null;

function createS3Adapter(): StorageAdapter {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION ?? 'us-east-1';
  const bucket = process.env.AWS_S3_BUCKET;

  if (!accessKeyId || !secretAccessKey || !bucket) {
    throw new Error(
      'Missing AWS S3 configuration. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET.'
    );
  }

  return new S3Adapter({
    accessKeyId,
    secretAccessKey,
    region,
    bucket,
    publicBaseUrl: process.env.AWS_S3_PUBLIC_BASE_URL,
    defaultSignedUrlExpiry: parseInt(process.env.STORAGE_SIGNED_URL_EXPIRY ?? '3600', 10),
  });
}

/**
 * Get the configured storage adapter. Defaults to AWS S3.
 * Future providers (Cloudflare R2, MinIO, Supabase) can be added
 * by checking the STORAGE_PROVIDER env var.
 */
export function getStorage(): StorageAdapter {
  if (_instance) return _instance;

  const provider = (process.env.STORAGE_PROVIDER ?? 'aws-s3') as StorageProvider;

  switch (provider) {
    case 'aws-s3':
      _instance = createS3Adapter();
      break;
    // Future providers:
    // case 'cloudflare-r2': _instance = createR2Adapter(); break;
    // case 'minio': _instance = createMinioAdapter(); break;
    default:
      throw new Error(`Unknown storage provider: ${provider}`);
  }

  return _instance;
}

/** Generate a storage key for a user file upload */
export function buildStorageKey(userId: string, filename: string): string {
  const timestamp = Date.now();
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `uploads/${userId}/${timestamp}-${safe}`;
}

/** Reset the singleton (useful in tests) */
export function resetStorage(): void {
  _instance = null;
}
