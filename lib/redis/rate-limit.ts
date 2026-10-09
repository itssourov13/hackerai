import { Ratelimit } from '@upstash/ratelimit';
import { getRedis } from './index';
import type { UserRole } from '@/lib/billing/plans';
import { isAdmin } from '@/lib/billing/plans';

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
};

/** Rate limit configs per endpoint type */
const LIMITS = {
  chat: {
    guest: { requests: 5, window: '1 m' },
    user: { requests: 20, window: '1 m' },
    pro: { requests: 60, window: '1 m' },
    team: { requests: 120, window: '1 m' },
  },
  upload: {
    guest: { requests: 2, window: '1 m' },
    user: { requests: 10, window: '1 m' },
    pro: { requests: 30, window: '1 m' },
    team: { requests: 60, window: '1 m' },
  },
  execute: {
    guest: { requests: 2, window: '1 m' },
    user: { requests: 10, window: '1 m' },
    pro: { requests: 30, window: '1 m' },
    team: { requests: 60, window: '1 m' },
  },
  api: {
    guest: { requests: 10, window: '1 m' },
    user: { requests: 30, window: '1 m' },
    pro: { requests: 200, window: '1 m' },
    team: { requests: 500, window: '1 m' },
  },
  auth: {
    guest: { requests: 5, window: '1 m' },
    user: { requests: 5, window: '1 m' },
    pro: { requests: 10, window: '1 m' },
    team: { requests: 20, window: '1 m' },
  },
} as const;

type EndpointType = keyof typeof LIMITS;

function getRatelimiter(requests: number, window: string): Ratelimit {
  const redis = getRedis();
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window as any),
    analytics: true,
    prefix: 'hackerai:rl',
  });
}

/**
 * Check rate limit for a user on a specific endpoint.
 * Admins are never rate limited.
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: EndpointType,
  role: UserRole = 'user'
): Promise<RateLimitResult> {
  // Admin override
  if (isAdmin(role)) {
    return { success: true, remaining: 999999, reset: 0, limit: 999999 };
  }

  try {
    const tier = role === 'pro' || role === 'team' ? role : 'user';
    const config = LIMITS[endpoint][tier] ?? LIMITS[endpoint].user;
    const limiter = getRatelimiter(config.requests, config.window);
    const result = await limiter.limit(`${endpoint}:${identifier}`);

    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      limit: result.limit,
    };
  } catch {
    // Redis unavailable — fail open (allow request)
    return { success: true, remaining: 1, reset: 0, limit: 1 };
  }
}

/** Build rate-limit response headers */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.reset),
  };
}
