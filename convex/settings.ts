import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/** Get settings for a user */
export const getByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query('settings')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique();
  },
});

/** Update settings */
export const update = mutation({
  args: {
    userId: v.id('users'),
    preferredModel: v.optional(v.string()),
    theme: v.optional(v.string()),
    editorFontSize: v.optional(v.number()),
    editorWordWrap: v.optional(v.boolean()),
    editorMinimapEnabled: v.optional(v.boolean()),
    notificationsEnabled: v.optional(v.boolean()),
    analyticsOptOut: v.optional(v.boolean()),
  },
  handler: async (ctx, { userId, ...updates }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('settings')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { ...updates, updatedAt: now });
    } else {
      await ctx.db.insert('settings', {
        userId,
        ...updates,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});
