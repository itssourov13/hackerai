import { Redis } from '@upstash/redis';

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (_redis) return _redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error('Upstash Redis is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
  }

  _redis = new Redis({ url, token });
  return _redis;
}

/** Test Redis connectivity */
export async function pingRedis(): Promise<boolean> {
  try {
    const redis = getRedis();
    const result = await redis.ping();
    return result === 'PONG';
  } catch {
    return false;
  }
}

/** Safe cache get — returns null on Redis unavailability */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedis();
    return await redis.get<T>(key);
  } catch {
    return null;
  }
}

/** Safe cache set with TTL */
export async function cacheSet(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  try {
    const redis = getRedis();
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    /* Redis unavailable — fail silently */
  }
}

/** Safe cache delete */
export async function cacheDel(...keys: string[]): Promise<void> {
  try {
    const redis = getRedis();
    if (keys.length > 0) await redis.del(...keys);
  } catch {
    /* Redis unavailable — fail silently */
  }
}

/** Increment a counter with TTL (for usage tracking) */
export async function cacheIncr(key: string, ttlSeconds?: number): Promise<number> {
  try {
    const redis = getRedis();
    const val = await redis.incr(key);
    if (ttlSeconds && val === 1) {
      await redis.expire(key, ttlSeconds);
    }
    return val;
  } catch {
    return 0;
  }
}

export const CACHE_TTL = {
  SHORT: 60,          // 1 minute
  MEDIUM: 300,        // 5 minutes
  LONG: 3600,         // 1 hour
  DAY: 86400,         // 24 hours
  WEEK: 604800,       // 7 days
} as const;
