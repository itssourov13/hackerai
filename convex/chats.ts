import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/** List all chats for a user, newest first */
export const listByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query('chats')
      .withIndex('by_user_updated', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();
  },
});

/** Get a single chat */
export const getById = query({
  args: { chatId: v.id('chats') },
  handler: async (ctx, { chatId }) => {
    return ctx.db.get(chatId);
  },
});

/** Create a new chat */
export const create = mutation({
  args: {
    userId: v.id('users'),
    title: v.optional(v.string()),
    model: v.optional(v.string()),
    systemPrompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert('chats', {
      userId: args.userId,
      title: args.title ?? 'New Chat',
      model: args.model,
      systemPrompt: args.systemPrompt,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Rename a chat */
export const rename = mutation({
  args: { chatId: v.id('chats'), title: v.string() },
  handler: async (ctx, { chatId, title }) => {
    await ctx.db.patch(chatId, { title, updatedAt: Date.now() });
  },
});

/** Delete a chat and its messages */
export const remove = mutation({
  args: { chatId: v.id('chats') },
  handler: async (ctx, { chatId }) => {
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_chat', (q) => q.eq('chatId', chatId))
      .collect();
    await Promise.all(messages.map((m) => ctx.db.delete(m._id)));
    await ctx.db.delete(chatId);
  },
});

/** Update chat's updatedAt timestamp */
export const touch = mutation({
  args: { chatId: v.id('chats') },
  handler: async (ctx, { chatId }) => {
    await ctx.db.patch(chatId, { updatedAt: Date.now() });
  },
});
