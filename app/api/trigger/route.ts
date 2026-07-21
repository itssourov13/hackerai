import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ message: 'Trigger.dev v3 tasks are managed separately via the Trigger.dev CLI (npx trigger.dev@latest dev).' });
}
