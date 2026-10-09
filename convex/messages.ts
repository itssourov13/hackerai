import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/** List messages for a chat, in creation order */
export const listByChat = query({
  args: { chatId: v.id('chats') },
  handler: async (ctx, { chatId }) => {
    return ctx.db
      .query('messages')
      .withIndex('by_chat_created', (q) => q.eq('chatId', chatId))
      .order('asc')
      .collect();
  },
});

/** Add a message to a chat */
export const add = mutation({
  args: {
    chatId: v.id('chats'),
    userId: v.id('users'),
    role: v.union(v.literal('user'), v.literal('assistant'), v.literal('system')),
    content: v.string(),
    model: v.optional(v.string()),
    tokens: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const messageId = await ctx.db.insert('messages', {
      ...args,
      createdAt: now,
    });

    // Update chat's updatedAt
    await ctx.db.patch(args.chatId, { updatedAt: now });

    return messageId;
  },
});

/** Update message content (for streaming completion) */
export const updateContent = mutation({
  args: { messageId: v.id('messages'), content: v.string(), tokens: v.optional(v.number()) },
  handler: async (ctx, { messageId, content, tokens }) => {
    await ctx.db.patch(messageId, { content, ...(tokens !== undefined && { tokens }) });
  },
});

/** Delete a single message */
export const remove = mutation({
  args: { messageId: v.id('messages') },
  handler: async (ctx, { messageId }) => {
    await ctx.db.delete(messageId);
  },
});
