# HackerAI

A production-ready AI SaaS application built with Next.js, TypeScript, Convex, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Convex
- **Auth**: WorkOS AuthKit
- **AI**: OpenAI / OpenRouter
- **Payments**: Stripe
- **Storage**: AWS S3
- **Jobs**: Trigger.dev
- **Cache**: Upstash Redis
- **Analytics**: PostHog
- **Deployment**: Vercel

## Project Structure

```
hackerai/
├── app/              Next.js App Router pages
├── components/       Reusable UI components
├── convex/           Convex backend schema and functions
├── hooks/            Custom React hooks
├── lib/              Utility libraries and configurations
├── public/           Static assets
├── scripts/          Build and utility scripts
├── styles/           Global styles
├── trigger/          Trigger.dev background jobs
├── types/            Shared TypeScript types
└── utils/            Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values.

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

## Deployment

Deploy to Vercel with all required environment variables configured.
