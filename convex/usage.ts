import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

function currentPeriod(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Get usage for current period */
export const getCurrent = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const period = currentPeriod();
    return ctx.db
      .query('usage')
      .withIndex('by_user_period', (q) => {
        const r = q.eq('userId', userId);
        return (r as any).eq('period', period);
      })
      .unique();
  },
});

/** Increment a usage counter */
export const increment = mutation({
  args: {
    userId: v.id('users'),
    field: v.union(
      v.literal('aiMessages'),
      v.literal('tokensUsed'),
      v.literal('fileUploads'),
      v.literal('storageBytes'),
      v.literal('codeExecutions'),
      v.literal('apiRequests')
    ),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, { userId, field, amount = 1 }) => {
    const period = currentPeriod();
    const now = Date.now();
    const existing = await ctx.db
      .query('usage')
      .withIndex('by_user_period', (q) => {
        const r = q.eq('userId', userId);
        return (r as any).eq('period', period);
      })
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        [field]: (existing[field] ?? 0) + amount,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('usage', {
        userId,
        period,
        aiMessages: 0,
        tokensUsed: 0,
        fileUploads: 0,
        storageBytes: 0,
        codeExecutions: 0,
        apiRequests: 0,
        [field]: amount,
        updatedAt: now,
      });
    }
  },
});
