import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getOrCreateCustomer, createPortalSession } from '@/lib/billing/stripe';

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const customerId = await getOrCreateCustomer(
      session.user.id,
      session.user.email
    );

    const url = await createPortalSession(
      customerId,
      `${baseUrl}/dashboard`
    );

    return NextResponse.json({ url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Portal failed';
    if (msg.includes('STRIPE_SECRET_KEY')) {
      return NextResponse.json({ error: 'Billing not configured' }, { status: 503 });
    }
    console.error('Portal error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
