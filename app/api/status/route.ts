import { NextResponse } from 'next/server';
import { getServiceStatus } from '@/lib/config/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    name: 'HackerAI',
    version: '1.0.0',
    services: getServiceStatus(),
    timestamp: new Date().toISOString(),
  });
}
