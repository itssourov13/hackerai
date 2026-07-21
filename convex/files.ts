import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/** List files for a user */
export const listByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query('files')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();
  },
});

/** List files for a chat */
export const listByChat = query({
  args: { chatId: v.id('chats') },
  handler: async (ctx, { chatId }) => {
    return ctx.db
      .query('files')
      .withIndex('by_chat', (q) => q.eq('chatId', chatId))
      .collect();
  },
});

/** Create a file record */
export const create = mutation({
  args: {
    userId: v.id('users'),
    projectId: v.optional(v.id('projects')),
    chatId: v.optional(v.id('chats')),
    name: v.string(),
    originalName: v.string(),
    mimeType: v.string(),
    size: v.number(),
    storageKey: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert('files', {
      ...args,
      status: 'uploading',
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Update file status and extracted content */
export const updateProcessing = mutation({
  args: {
    fileId: v.id('files'),
    status: v.union(
      v.literal('uploading'),
      v.literal('processing'),
      v.literal('ready'),
      v.literal('error')
    ),
    extractedText: v.optional(v.string()),
    wordCount: v.optional(v.number()),
    pageCount: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, { fileId, ...updates }) => {
    await ctx.db.patch(fileId, { ...updates, updatedAt: Date.now() });
  },
});

/** Rename a file */
export const rename = mutation({
  args: { fileId: v.id('files'), name: v.string() },
  handler: async (ctx, { fileId, name }) => {
    await ctx.db.patch(fileId, { name, updatedAt: Date.now() });
  },
});

/** Delete a file record */
export const remove = mutation({
  args: { fileId: v.id('files') },
  handler: async (ctx, { fileId }) => {
    await ctx.db.delete(fileId);
  },
});
