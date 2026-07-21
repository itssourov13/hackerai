import { pingRedis } from '@/lib/redis';
import { logger } from './logger';

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latencyMs?: number;
  message?: string;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  checks: HealthCheckResult[];
  timestamp: string;
}

async function checkRedis(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const ok = await pingRedis();
    return {
      service: 'redis',
      status: ok ? 'healthy' : 'unhealthy',
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    return {
      service: 'redis',
      status: 'unhealthy',
      latencyMs: Date.now() - start,
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

async function checkAIProvider(): Promise<HealthCheckResult> {
  const configured = !!(process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY);
  return {
    service: 'ai-provider',
    status: configured ? 'healthy' : 'degraded',
    message: configured ? undefined : 'No AI API key configured',
  };
}

async function checkStorage(): Promise<HealthCheckResult> {
  const configured = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_S3_BUCKET);
  return {
    service: 'storage',
    status: configured ? 'healthy' : 'degraded',
    message: configured ? undefined : 'AWS S3 not configured',
  };
}

async function checkConvex(): Promise<HealthCheckResult> {
  const configured = !!process.env.NEXT_PUBLIC_CONVEX_URL;
  return {
    service: 'convex',
    status: configured ? 'healthy' : 'degraded',
    message: configured ? undefined : 'Convex URL not configured',
  };
}

export async function runHealthChecks(): Promise<SystemHealth> {
  const checks = await Promise.allSettled([
    checkRedis(),
    checkAIProvider(),
    checkStorage(),
    checkConvex(),
  ]);

  const results: HealthCheckResult[] = checks.map((r) =>
    r.status === 'fulfilled'
      ? r.value
      : { service: 'unknown', status: 'unhealthy', message: 'Check failed' }
  );

  const hasUnhealthy = results.some((r) => r.status === 'unhealthy');
  const hasDegraded = results.some((r) => r.status === 'degraded');
  const overall = hasUnhealthy ? 'unhealthy' : hasDegraded ? 'degraded' : 'healthy';

  logger.info('Health check completed', { overall, checks: results.length });

  return { overall, checks: results, timestamp: new Date().toISOString() };
}
