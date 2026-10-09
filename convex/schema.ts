import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // ── Users ──────────────────────────────────────────────────────────
  users: defineTable({
    workosUserId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
    role: v.union(
      v.literal('guest'),
      v.literal('user'),
      v.literal('pro'),
      v.literal('team'),
      v.literal('admin')
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_workos_id', ['workosUserId'])
    .index('by_email', ['email']),

  // ── Chats ──────────────────────────────────────────────────────────
  chats: defineTable({
    userId: v.id('users'),
    title: v.string(),
    model: v.optional(v.string()),
    systemPrompt: v.optional(v.string()),
    pinned: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_updated', ['userId', 'updatedAt']),

  // ── Messages ───────────────────────────────────────────────────────
  messages: defineTable({
    chatId: v.id('chats'),
    userId: v.id('users'),
    role: v.union(v.literal('user'), v.literal('assistant'), v.literal('system')),
    content: v.string(),
    model: v.optional(v.string()),
    tokens: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_chat', ['chatId'])
    .index('by_chat_created', ['chatId', 'createdAt']),

  // ── Projects ───────────────────────────────────────────────────────
  projects: defineTable({
    userId: v.id('users'),
    name: v.string(),
    description: v.optional(v.string()),
    language: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId']),

  // ── Files ──────────────────────────────────────────────────────────
  files: defineTable({
    userId: v.id('users'),
    projectId: v.optional(v.id('projects')),
    chatId: v.optional(v.id('chats')),
    name: v.string(),
    originalName: v.string(),
    mimeType: v.string(),
    size: v.number(),
    storageKey: v.string(),
    extractedText: v.optional(v.string()),
    wordCount: v.optional(v.number()),
    pageCount: v.optional(v.number()),
    status: v.union(
      v.literal('uploading'),
      v.literal('processing'),
      v.literal('ready'),
      v.literal('error')
    ),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_project', ['projectId'])
    .index('by_chat', ['chatId']),

  // ── Subscriptions ─────────────────────────────────────────────────
  subscriptions: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_stripe_customer', ['stripeCustomerId'])
    .index('by_stripe_subscription', ['stripeSubscriptionId']),

  // ── Settings ───────────────────────────────────────────────────────
  settings: defineTable({
    userId: v.id('users'),
    preferredModel: v.optional(v.string()),
    theme: v.optional(v.string()),
    editorFontSize: v.optional(v.number()),
    editorWordWrap: v.optional(v.boolean()),
    editorMinimapEnabled: v.optional(v.boolean()),
    notificationsEnabled: v.optional(v.boolean()),
    analyticsOptOut: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId']),

  // ── Usage ──────────────────────────────────────────────────────────
  usage: defineTable({
    userId: v.id('users'),
    period: v.string(), // YYYY-MM
    aiMessages: v.number(),
    tokensUsed: v.number(),
    fileUploads: v.number(),
    storageBytes: v.number(),
    codeExecutions: v.number(),
    apiRequests: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_period', ['userId', 'period']),
});
