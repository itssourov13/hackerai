import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getOrCreateCustomer, createCheckoutSession } from '@/lib/billing/stripe';
import { PLANS, type PlanName } from '@/lib/billing/plans';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const RequestSchema = z.object({
  plan: z.enum(['pro', 'team', 'enterprise']),
  interval: z.enum(['monthly', 'yearly']).default('monthly'),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body;
  try {
    body = RequestSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const plan = PLANS[body.plan as PlanName];
  const priceId =
    body.interval === 'yearly' ? plan.yearlyPriceId : plan.monthlyPriceId;

  if (!priceId) {
    return NextResponse.json(
      { error: `Price ID not configured for ${body.plan} ${body.interval}` },
      { status: 503 }
    );
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const customerId = await getOrCreateCustomer(
      session.user.id,
      session.user.email
    );

    const url = await createCheckoutSession({
      customerId,
      priceId,
      userId: session.user.id,
      successUrl: `${baseUrl}/dashboard?checkout=success`,
      cancelUrl: `${baseUrl}/pricing?checkout=cancelled`,
    });

    return NextResponse.json({ url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Checkout failed';
    if (msg.includes('STRIPE_SECRET_KEY')) {
      return NextResponse.json({ error: 'Billing not configured' }, { status: 503 });
    }
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
