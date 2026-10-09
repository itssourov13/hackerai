import { NextResponse } from 'next/server';
import { runHealthChecks } from '@/lib/observability/health';

export const dynamic = 'force-dynamic';

export async function GET() {
  const health = await runHealthChecks();
  const status = health.overall === 'healthy' ? 200 : health.overall === 'degraded' ? 200 : 503;
  return NextResponse.json(health, { status });
}
