import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/** List projects for a user */
export const listByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query('projects')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();
  },
});

/** Get a project by ID */
export const getById = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    return ctx.db.get(projectId);
  },
});

/** Create a project */
export const create = mutation({
  args: {
    userId: v.id('users'),
    name: v.string(),
    description: v.optional(v.string()),
    language: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert('projects', { ...args, createdAt: now, updatedAt: now });
  },
});

/** Update a project */
export const update = mutation({
  args: {
    projectId: v.id('projects'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    language: v.optional(v.string()),
  },
  handler: async (ctx, { projectId, ...updates }) => {
    await ctx.db.patch(projectId, { ...updates, updatedAt: Date.now() });
  },
});

/** Delete a project */
export const remove = mutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    await ctx.db.delete(projectId);
  },
});
