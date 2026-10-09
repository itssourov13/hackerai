import { z } from 'zod';

const EnvSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // WorkOS (required for auth)
  WORKOS_API_KEY: z.string().optional(),
  WORKOS_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_WORKOS_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_WORKOS_REDIRECT_URI: z.string().url().optional(),

  // Convex
  NEXT_PUBLIC_CONVEX_URL: z.string().url().optional(),

  // OpenAI / OpenRouter
  OPENAI_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET: z.string().optional(),

  // Upstash Redis
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // E2B
  E2B_API_KEY: z.string().optional(),

  // Trigger.dev
  TRIGGER_API_KEY: z.string().optional(),

  // PostHog
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (_env) return _env;
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.warn('Environment validation warnings:', result.error.flatten());
    _env = EnvSchema.parse({ NODE_ENV: 'development' });
  } else {
    _env = result.data;
  }
  return _env;
}

/** Check which services are configured */
export function getServiceStatus() {
  const env = getEnv();
  return {
    auth: !!(env.WORKOS_API_KEY && env.WORKOS_CLIENT_ID),
    database: !!env.NEXT_PUBLIC_CONVEX_URL,
    ai: !!(env.OPENAI_API_KEY || env.OPENROUTER_API_KEY),
    storage: !!(env.AWS_ACCESS_KEY_ID && env.AWS_S3_BUCKET),
    billing: !!env.STRIPE_SECRET_KEY,
    cache: !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),
    execution: !!env.E2B_API_KEY,
    jobs: !!env.TRIGGER_API_KEY,
    analytics: !!env.NEXT_PUBLIC_POSTHOG_KEY,
  };
}
