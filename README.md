# 🚀 HackerAI

<div align="center">

# The Ultimate AI-Powered Developer Workspace

### **Build • Chat • Code • Execute • Deploy**

An all-in-one AI development platform built with modern web technologies, designed to help developers, ethical hackers, students, and creators build faster, collaborate smarter, and automate everything.

<p>

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwindcss)

![Convex](https://img.shields.io/badge/Backend-Convex-orange?style=for-the-badge)
![WorkOS](https://img.shields.io/badge/Auth-WorkOS-blue?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Billing-Stripe-635BFF?style=for-the-badge&logo=stripe)
![Redis](https://img.shields.io/badge/Redis-Cache-red?style=for-the-badge&logo=redis)

![AWS S3](https://img.shields.io/badge/AWS-S3-FF9900?style=for-the-badge&logo=amazonaws)
![Trigger.dev](https://img.shields.io/badge/Background-Trigger.dev-purple?style=for-the-badge)
![PostHog](https://img.shields.io/badge/Analytics-PostHog-black?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)

</p>

---

**⚡ AI Workspace • 💻 Online Code Editor • 📁 File Manager • 🖥 Terminal • ☁ Cloud Storage • 💳 SaaS Billing**

</div>

---

# 📖 Overview

HackerAI is a **production-ready AI SaaS platform** that combines artificial intelligence, cloud development tools, secure authentication, and modern infrastructure into one seamless developer experience.

Instead of relying on multiple disconnected applications, HackerAI brings everything together in a single workspace where users can communicate with AI, manage projects, edit source code, upload files, execute commands, and monitor application usage from one intuitive dashboard.

The platform is built with scalability, maintainability, and performance in mind, making it suitable for personal projects, SaaS products, developer tools, educational platforms, and enterprise-ready applications.

---

# ✨ Key Features

## 🤖 AI Assistant

- Multi-model AI support
- Context-aware conversations
- Intelligent code generation
- Streaming AI responses
- Persistent chat history
- Fast response pipeline

---

## 💻 Code Workspace

- Modern browser-based editor
- Multi-file project support
- Syntax highlighting
- File tabs
- Clean development experience

---

## 📁 File Management

- Upload and organize files
- Cloud object storage
- Secure download access
- Storage monitoring
- File processing pipeline

---

## 🖥 Integrated Terminal

- Command execution
- Background processing
- Live execution status
- Developer-friendly interface

---

## 🔐 Authentication

- Secure WorkOS Authentication
- Protected application routes
- Session management
- User account handling
- Secure login flow

---

## 💳 Subscription System

- Stripe Billing
- Premium plans
- Usage tracking
- Feature permissions
- Subscription management

---

## 📊 Monitoring

- PostHog Analytics
- Health monitoring
- Error tracking
- Performance insights
- Application logging

---

## ⚡ Background Processing

- Trigger.dev jobs
- Automated workflows
- File processing
- Usage aggregation
- Scheduled cleanup

---

# 🚀 Why HackerAI?

Unlike traditional AI chat applications, HackerAI provides a complete development ecosystem.

✅ AI Conversations

✅ Project Management

✅ Online Code Editing

✅ Terminal Execution

✅ Cloud File Storage

✅ Secure Authentication

✅ Subscription Billing

✅ Background Automation

✅ Analytics & Monitoring

Everything is available inside a unified developer workspace.

---

# 🛠 Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js App Router |
| UI Library | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Backend | Convex |
| Authentication | WorkOS |
| Billing | Stripe |
| Storage | AWS S3 Compatible Storage |
| Cache | Redis |
| Background Jobs | Trigger.dev |
| Analytics | PostHog |

---

# 🏗 System Architecture

```text
                             Internet
                                 │
                                 ▼
                        ┌────────────────┐
                        │     Users      │
                        └───────┬────────┘
                                │
                                ▼
                  ┌─────────────────────────┐
                  │     Next.js Frontend    │
                  │ React + TypeScript App  │
                  └──────────┬──────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
   Authentication        API Routes        UI Components
      WorkOS            App Router         React + shadcn
         │                   │
         └──────────────┬────┘
                        ▼
              ┌────────────────────┐
              │   Convex Backend   │
              │ Database + Actions │
              └─────────┬──────────┘
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
   Convex DB      Redis Cache       AWS S3 Storage
                        │
                        ▼
              Trigger.dev Background Jobs
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
     AI Models       Stripe         PostHog
```

---

# 🎯 Primary Modules

| Module | Purpose |
|---------|---------|
| 💬 Chat | AI conversations and history |
| 💻 Editor | Browser-based code editor |
| 📁 Files | Cloud file manager |
| 🖥 Terminal | Command execution |
| 📊 Dashboard | User workspace |
| 🔐 Auth | WorkOS authentication |
| ☁ Storage | AWS S3 integration |
| 💳 Billing | Stripe subscriptions |
| ⚡ Trigger | Background automation |
| 📈 Analytics | PostHog insights |
| 🗄 Database | Convex backend |

---

> **📌 Part 1 of 3**
>
> The next section includes:
>
> - 📁 Complete Project Structure
> - ⚙ Installation Guide
> - 🔑 Environment Variables
> - ☁ Convex Setup
> - 🔐 WorkOS Configuration
> - 💳 Stripe Setup
> - 🚀 Local Development
> - 🛠 Build Commands

# 📁 Project Structure

The project follows a clean and scalable architecture using the **Next.js App Router** and modular design principles.

```text
project/
│
├── app/                         # Next.js App Router
│   ├── api/                     # REST API Routes
│   │   ├── billing/
│   │   ├── chat/
│   │   ├── execute/
│   │   ├── health/
│   │   ├── status/
│   │   ├── storage/
│   │   ├── trigger/
│   │   └── webhooks/
│   │
│   ├── auth/                    # Authentication
│   │   ├── callback/
│   │   └── sign-out/
│   │
│   ├── chat/                    # AI Chat Workspace
│   ├── dashboard/               # User Dashboard
│   ├── editor/                  # Code Editor
│   ├── files/                   # File Manager
│   ├── terminal/                # Terminal
│   ├── sign-in/
│   ├── sign-up/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/                  # Shared Components
│   ├── chat/
│   ├── editor/
│   ├── files/
│   ├── layout/
│   ├── providers/
│   ├── sections/
│   ├── terminal/
│   └── ui/
│
├── convex/                      # Backend & Database
│   ├── schema.ts
│   ├── users.ts
│   ├── projects.ts
│   ├── chats.ts
│   ├── messages.ts
│   ├── files.ts
│   ├── settings.ts
│   ├── subscriptions.ts
│   └── usage.ts
│
├── hooks/                       # Custom Hooks
├── lib/                         # Business Logic
├── trigger/                     # Background Jobs
├── public/
├── styles/
├── types/
├── utils/
│
├── middleware.ts
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

# ⚙️ Requirements

Before running HackerAI, make sure your development environment includes:

| Software | Version |
|----------|----------|
| Node.js | 20+ |
| pnpm | Latest |
| Git | Latest |
| Convex CLI | Latest |
| Trigger.dev CLI | Latest |

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/hackerai.git

cd hackerai
```

---

## Install Dependencies

Using **pnpm** (Recommended)

```bash
pnpm install
```

Using **npm**

```bash
npm install
```

---

# 🔑 Environment Variables

Create your environment file.

```bash
cp .env.example .env.local
```

Example configuration:

```env
# ==========================
# AI Configuration
# ==========================
OPENAI_API_KEY=

# ==========================
# Convex
# ==========================
NEXT_PUBLIC_CONVEX_URL=

# ==========================
# WorkOS
# ==========================
WORKOS_CLIENT_ID=
WORKOS_API_KEY=
WORKOS_COOKIE_PASSWORD=

# ==========================
# Stripe
# ==========================
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# ==========================
# Redis
# ==========================
REDIS_URL=
REDIS_TOKEN=

# ==========================
# AWS S3
# ==========================
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=

# ==========================
# Analytics
# ==========================
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# ==========================
# Trigger.dev
# ==========================
TRIGGER_SECRET_KEY=
```

---

# ☁️ Convex Setup

Install Convex CLI.

```bash
pnpm add convex
```

Start local backend.

```bash
npx convex dev
```

Deploy backend.

```bash
npx convex deploy
```

---

# 🔐 WorkOS Authentication

Configure your WorkOS credentials inside `.env.local`.

```env
WORKOS_CLIENT_ID=
WORKOS_API_KEY=
WORKOS_COOKIE_PASSWORD=
```

Authentication includes:

- Secure Sign In
- Secure Sign Up
- Session Management
- Protected Routes
- Callback Handling

---

# 💳 Stripe Billing

Install Stripe.

```bash
pnpm add stripe
```

Run Stripe webhook locally.

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

# ☁️ AWS S3 Storage

Configure storage.

```env
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=
```

Storage Features:

- File Upload
- File Processing
- Cloud Storage
- Secure Downloads

---

# ⚡ Trigger.dev

Start local worker.

```bash
npx trigger.dev@latest dev
```

Deploy background jobs.

```bash
npx trigger.dev@latest deploy
```

Used for:

- File Processing
- Usage Aggregation
- Cleanup Jobs
- Scheduled Tasks

---

# ▶️ Local Development

Start the development server.

```bash
pnpm dev
```

or

```bash
npm run dev
```

Application URL:

```text
http://localhost:3000
```

---

# 📦 Production Build

Create production build.

```bash
pnpm build
```

Start production server.

```bash
pnpm start
```

---

# 🧪 Useful Commands

| Command | Description |
|----------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start development server |
| `pnpm build` | Build production app |
| `pnpm start` | Start production server |
| `npx convex dev` | Run Convex locally |
| `npx convex deploy` | Deploy Convex |
| `npx trigger.dev@latest dev` | Run Trigger.dev |
| `git status` | Check repository status |
| `git pull` | Pull latest changes |
| `git push` | Push commits |

---

> **📌 Part 2 of 3**

The final section includes:

- 🚀 Deployment Guide
- 🔒 Security
- 📈 Roadmap
- 🤝 Contributing
- 📝 FAQ
- 📄 License
- ❤️ Premium Footer

# 🚀 Deployment

HackerAI is designed for modern cloud platforms and can be deployed with minimal configuration.

---

# ▲ Deploy to Vercel

Install the Vercel CLI.

```bash
npm install -g vercel
```

Login to your Vercel account.

```bash
vercel login
```

Deploy the project.

```bash
vercel
```

Deploy to production.

```bash
vercel --prod
```

---

# 🌐 Deploy to Netlify

Install the Netlify CLI.

```bash
npm install -g netlify-cli
```

Login to Netlify.

```bash
netlify login
```

Deploy a preview.

```bash
netlify deploy
```

Deploy to production.

```bash
netlify deploy --prod
```

---

# ✅ Production Checklist

Before publishing your application, verify the following:

- ✅ Environment variables configured
- ✅ Convex deployed successfully
- ✅ WorkOS authentication configured
- ✅ Stripe webhook verified
- ✅ Redis connected
- ✅ AWS S3 bucket accessible
- ✅ Trigger.dev jobs deployed
- ✅ Analytics enabled
- ✅ Application builds successfully

---

# 🔒 Security

HackerAI follows modern security best practices.

## Authentication

- Secure WorkOS Authentication
- Protected Routes
- Session Management
- Cookie-based Security

---

## API Protection

- Request Validation
- Input Sanitization
- Rate Limiting
- Secure Error Handling

---

## Storage Protection

- Secure File Upload
- Cloud Object Storage
- Permission-based Access
- Protected Downloads

---

## Billing Protection

- Stripe Signature Verification
- Subscription Validation
- Permission-based Features

---

## Infrastructure

- Environment Variable Isolation
- Server-side Validation
- Secure Middleware
- Production Logging

---

# 📊 Monitoring

Integrated monitoring services include:

- PostHog Analytics
- Health Monitoring
- Usage Tracking
- Error Logging
- Performance Metrics

---

# 🗺️ Roadmap

## ✅ Current Features

- AI Chat
- Authentication
- Dashboard
- Online Code Editor
- File Manager
- Terminal
- Convex Backend
- Stripe Billing
- Redis Integration
- AWS S3 Storage
- Trigger.dev Jobs
- Analytics

---

## 🚧 Coming Soon

- Team Workspaces
- Shared Projects
- AI Memory
- Plugin Marketplace
- Live Collaboration
- Better Mobile Experience
- Advanced AI Agents

---

## 🔮 Future Vision

- Desktop Application
- Android & iOS Apps
- Voice Assistant
- Git Integration
- Docker Runtime
- Multiple AI Providers
- Enterprise Dashboard
- Organization Management

---

# 🤝 Contributing

Contributions are always welcome.

## 1. Fork the repository

Click the **Fork** button on GitHub.

---

## 2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/hackerai.git

cd hackerai
```

---

## 3. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

---

## 4. Commit your changes

```bash
git add .

git commit -m "feat: add amazing feature"
```

---

## 5. Push your branch

```bash
git push origin feature/amazing-feature
```

---

## 6. Create a Pull Request

Open a Pull Request from your fork to the main repository.

---

# 🐛 Reporting Issues

When opening an issue, please include:

- Operating System
- Browser
- Steps to Reproduce
- Expected Behavior
- Actual Behavior
- Error Logs (if available)
- Screenshots (optional)

---

# 💡 Feature Requests

Suggestions are always appreciated.

Ideas may include:

- New AI capabilities
- UI Improvements
- Performance Optimization
- Additional Integrations
- Developer Experience Enhancements

---

# ❓ Frequently Asked Questions

### Which package manager is recommended?

**pnpm** is recommended for the best performance.

---

### Which backend is used?

Convex powers the backend, database, and real-time functionality.

---

### Which authentication provider is used?

WorkOS Authentication.

---

### Which payment provider is used?

Stripe.

---

### Which storage service is supported?

AWS S3 Compatible Object Storage.

---

### Can I deploy it on Vercel?

Yes.

---

### Can I deploy it on Netlify?

Yes.

---

# 📄 License

Distributed under the **MIT License**.

Feel free to use, modify, and contribute while preserving the original license.

---

# 🙏 Acknowledgements

Built with the amazing open-source ecosystem.

Special thanks to:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Convex
- WorkOS
- Stripe
- Redis
- AWS S3
- Trigger.dev
- PostHog

---

# ⭐ Support

If you like this project, please consider:

- ⭐ Starring the repository
- 🍴 Forking the project
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🤝 Contributing

Your support helps make HackerAI even better.

---

<div align="center">

# 🚀 HackerAI

### Build • Chat • Code • Execute • Deploy

**The Ultimate AI-Powered Developer Workspace**

Built with ❤️ using **Next.js**, **React**, **TypeScript**, **Convex**, **WorkOS**, **Stripe**, **Redis**, **AWS S3**, and **Trigger.dev**.

---

### ⭐ If you found this project useful, please give it a Star!

<p align="center">
Made with ❤️ by <strong>Md Sourov Mondol</strong>
</p>

**© 2026 HackerAI. All Rights Reserved.**

</div>
