import { cacheGet, cacheSet, cacheDel, cacheIncr, CACHE_TTL } from './index';
import type { UserRole } from '@/lib/billing/plans';
import { getPlanLimits, getPlanForRole } from '@/lib/billing/plans';
import { isAdmin } from '@/lib/billing/plans';

export type UsageMetric =
  | 'aiMessages'
  | 'tokensUsed'
  | 'fileUploads'
  | 'storageBytes'
  | 'codeExecutions'
  | 'apiRequests';

function periodKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function usageKey(userId: string, metric: UsageMetric): string {
  return `hackerai:usage:${userId}:${periodKey()}:${metric}`;
}

/** Get current usage for a specific metric */
export async function getUsage(userId: string, metric: UsageMetric): Promise<number> {
  const key = usageKey(userId, metric);
  const value = await cacheGet<number>(key);
  return value ?? 0;
}

/** Increment usage counter */
export async function trackUsage(
  userId: string,
  metric: UsageMetric,
  amount = 1
): Promise<number> {
  const key = usageKey(userId, metric);
  // TTL: end of month + 1 day buffer (32 days max)
  return cacheIncr(key, 32 * 24 * 3600);
}

/** Check if user is within quota for a metric */
export async function checkQuota(
  userId: string,
  role: UserRole,
  metric: UsageMetric
): Promise<{ allowed: boolean; current: number; limit: number | 'unlimited' }> {
  if (isAdmin(role)) {
    return { allowed: true, current: 0, limit: 'unlimited' };
  }

  const plan = getPlanForRole(role);
  const limits = getPlanLimits(plan);

  const metricLimitMap: Record<UsageMetric, keyof ReturnType<typeof getPlanLimits>> = {
    aiMessages: 'aiMessagesPerMonth',
    tokensUsed: 'aiMessagesPerMonth',     // proxy for messages
    fileUploads: 'fileUploadsPerMonth',
    storageBytes: 'storageGB',
    codeExecutions: 'codeExecutionsPerMonth',
    apiRequests: 'apiRequestsPerMonth',
  };

  const limitKey = metricLimitMap[metric];
  const limit = limits[limitKey] as number | 'unlimited';

  if (limit === 'unlimited') {
    return { allowed: true, current: 0, limit: 'unlimited' };
  }

  const current = await getUsage(userId, metric);
  return { allowed: current < limit, current, limit };
}

/** Feature flags stored in Redis */
export const FEATURE_FLAGS = {
  MAINTENANCE_MODE: 'flag:maintenance_mode',
  BETA_CHAT: 'flag:beta_chat',
  NEW_EDITOR: 'flag:new_editor',
} as const;

export type FeatureFlag = typeof FEATURE_FLAGS[keyof typeof FEATURE_FLAGS];

export async function isFeatureEnabled(flag: FeatureFlag): Promise<boolean> {
  const value = await cacheGet<boolean>(flag);
  return value === true;
}

export async function setFeatureFlag(flag: FeatureFlag, enabled: boolean): Promise<void> {
  await cacheSet(flag, enabled, CACHE_TTL.DAY);
}
