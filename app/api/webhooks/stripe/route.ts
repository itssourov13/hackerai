import { type NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/billing/stripe';
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? '';

/** Processed event IDs — in production use Redis/Convex for deduplication */
const processedEvents = new Set<string>();
const MAX_PROCESSED_EVENTS = 10000;

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId || !session.customer) return;
  console.log(`Checkout completed for user ${userId}, customer ${session.customer}`);
  // TODO: upsert subscription in Convex
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  console.log(`Subscription ${subscription.id} changed to ${status} for customer ${customerId}`);
  // TODO: sync subscription in Convex, update user role
}

async function handleInvoice(invoice: Stripe.Invoice) {
  console.log(`Invoice ${invoice.id} event for customer ${invoice.customer}`);
  // TODO: update subscription status
}

export async function POST(request: NextRequest) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Idempotency check
  if (processedEvents.has(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }
  processedEvents.add(event.id);
  if (processedEvents.size > MAX_PROCESSED_EVENTS) {
    const oldest = processedEvents.values().next().value;
    if (oldest) processedEvents.delete(oldest);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.paid':
      case 'invoice.payment_failed':
        await handleInvoice(event.data.object as Stripe.Invoice);
        break;
      default:
        // Unhandled event type — ignore silently
        break;
    }
  } catch (err) {
    console.error(`Error handling webhook ${event.type}:`, err);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
