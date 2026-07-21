import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/** Get subscription for a user */
export const getByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique();
  },
});

/** Get subscription by Stripe customer ID */
export const getByStripeCustomer = query({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, { stripeCustomerId }) => {
    return ctx.db
      .query('subscriptions')
      .withIndex('by_stripe_customer', (q) =>
        q.eq('stripeCustomerId', stripeCustomerId)
      )
      .unique();
  },
});

/** Update or create subscription */
export const upsert = mutation({
  args: {
    userId: v.id('users'),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    plan: v.union(
      v.literal('free'),
      v.literal('pro'),
      v.literal('team'),
      v.literal('enterprise')
    ),
    status: v.union(
      v.literal('active'),
      v.literal('inactive'),
      v.literal('past_due'),
      v.literal('canceled'),
      v.literal('trialing')
    ),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
      return existing._id;
    }

    return ctx.db.insert('subscriptions', { ...args, createdAt: now, updatedAt: now });
  },
});

/** Sync user role from subscription plan */
export const syncUserRole = mutation({
  args: { userId: v.id('users'), plan: v.string() },
  handler: async (ctx, { userId, plan }) => {
    const roleMap: Record<string, 'user' | 'pro' | 'team'> = {
      free: 'user',
      pro: 'pro',
      team: 'team',
    };
    const role = roleMap[plan] ?? 'user';
    await ctx.db.patch(userId, { role, updatedAt: Date.now() });
  },
});
