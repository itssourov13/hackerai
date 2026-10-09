/** Centralized application configuration — single source of truth */

export const APP_CONFIG = {
  name: 'HackerAI',
  version: '1.0.0',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  supportEmail: 'support@hackerai.dev',
} as const;

/** API versioning */
export const API_VERSION = {
  current: 'v1',
  supported: ['v1'],
  deprecated: [] as string[],
} as const;

/** Feature flags defaults (overridden by Redis at runtime) */
export const DEFAULT_FEATURE_FLAGS = {
  betaChat: false,
  newEditor: false,
  maintenanceMode: false,
  analyticsEnabled: true,
  loggingEnabled: true,
  errorTrackingEnabled: true,
} as const;

/** Storage configuration */
export const STORAGE_CONFIG = {
  provider: (process.env.STORAGE_PROVIDER ?? 'aws-s3') as 'aws-s3' | 'cloudflare-r2' | 'minio',
  signedUrlExpiry: parseInt(process.env.STORAGE_SIGNED_URL_EXPIRY ?? '3600', 10),
  maxRetries: 3,
} as const;
