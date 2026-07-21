'use client';

import posthog from 'posthog-js';

let initialized = false;

export function initPostHog(): void {
  if (initialized || typeof window === 'undefined') return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com';

  if (!key) return;

  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage',
    autocapture: false,
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') ph.opt_out_capturing();
    },
  });

  initialized = true;
}

export type AnalyticsEvent =
  | 'user_signed_up'
  | 'user_signed_in'
  | 'user_signed_out'
  | 'chat_created'
  | 'message_sent'
  | 'code_executed'
  | 'file_uploaded'
  | 'subscription_started'
  | 'plan_upgraded'
  | 'feature_accessed'
  | 'error_occurred';

export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  try {
    posthog.capture(event, { ...properties, timestamp: new Date().toISOString() });
  } catch {
    /* analytics should never break the app */
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    posthog.identify(userId, traits);
  } catch {
    /* ignore */
  }
}

export function resetUser(): void {
  if (typeof window === 'undefined') return;
  try {
    posthog.reset();
  } catch {
    /* ignore */
  }
}
