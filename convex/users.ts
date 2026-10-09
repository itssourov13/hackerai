import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/** Get a user by their WorkOS user ID */
export const getByWorkosId = query({
  args: { workosUserId: v.string() },
  handler: async (ctx, { workosUserId }) => {
    return ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosUserId', workosUserId))
      .unique();
  },
});

/** Get a user by their internal Convex ID */
export const getById = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return ctx.db.get(userId);
  },
});

/** Upsert a user after WorkOS login */
export const upsert = mutation({
  args: {
    workosUserId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosUserId', args.workosUserId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        profilePictureUrl: args.profilePictureUrl,
        updatedAt: now,
      });
      return existing._id;
    }

    const userId = await ctx.db.insert('users', {
      ...args,
      role: 'user',
      createdAt: now,
      updatedAt: now,
    });

    // Seed default settings
    await ctx.db.insert('settings', {
      userId,
      preferredModel: 'gpt-4o',
      theme: 'dark',
      editorFontSize: 14,
      editorWordWrap: false,
      editorMinimapEnabled: true,
      notificationsEnabled: true,
      analyticsOptOut: false,
      createdAt: now,
      updatedAt: now,
    });

    // Seed free subscription
    await ctx.db.insert('subscriptions', {
      userId,
      plan: 'free',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    return userId;
  },
});

/** Update user role (admin only) */
export const updateRole = mutation({
  args: {
    userId: v.id('users'),
    role: v.union(
      v.literal('guest'),
      v.literal('user'),
      v.literal('pro'),
      v.literal('team'),
      v.literal('admin')
    ),
  },
  handler: async (ctx, { userId, role }) => {
    await ctx.db.patch(userId, { role, updatedAt: Date.now() });
  },
});
