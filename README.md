🚀 HackerAI

<p align="center">
  <img src="https://raw.githubusercontent.com/itssourov13/hackerai/main/public/logo.png" alt="HackerAI Banner" width="180"/>
</p><h3 align="center">
AI-Powered Coding Workspace • Chat • Terminal • File Manager • Code Editor
</h3><p align="center">
A modern, production-ready AI SaaS platform built with <strong>Next.js</strong>, <strong>TypeScript</strong>, <strong>Convex</strong>, <strong>Tailwind CSS</strong>, and a powerful cloud-native architecture.
</p><p align="center">"Next.js" (https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)
"TypeScript" (https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
"TailwindCSS" (https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwindcss)
"Convex" (https://img.shields.io/badge/Convex-Database-orange?style=for-the-badge)
"OpenAI" (https://img.shields.io/badge/OpenAI-AI-10A37F?style=for-the-badge&logo=openai)
"Stripe" (https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)
"Vercel" (https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)
"MIT License" (https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>---

✨ Overview

HackerAI is an advanced AI-powered coding platform designed to provide developers with an intelligent development workspace.

Instead of switching between multiple tools, HackerAI combines:

- 🤖 AI Chat
- 💻 Code Editor
- 📂 File Manager
- 🖥️ Web Terminal
- ☁ Cloud Storage
- 💳 Subscription Billing
- 📊 Usage Analytics
- ⚡ Background Jobs

into one modern web application.

The project follows scalable architecture principles, making it suitable for personal use, SaaS products, startups, and production deployments.

---

🌟 Key Features

🤖 AI Assistant

- AI Chat Interface
- Streaming Responses
- Conversation History
- Multiple AI Model Support
- Smart Context Handling

---

💻 Code Workspace

- Integrated Code Editor
- File Explorer
- Syntax Highlighting
- Multiple File Support
- Project Management

---

🖥️ Web Terminal

- Interactive Browser Terminal
- Command Execution API
- Secure Session Handling

---

📂 File Management

- Upload Files
- Delete Files
- Storage Integration
- Cloud File Processing

---

🔐 Authentication

- WorkOS Authentication
- Secure Sessions
- Protected Dashboard
- User Profiles

---

💳 Billing System

- Stripe Integration
- Subscription Plans
- Usage Tracking
- Permission System

---

📊 Analytics

- PostHog Analytics
- User Tracking
- Event Monitoring
- Performance Metrics

---

⚡ Background Jobs

Powered by Trigger.dev

- File Processing
- Storage Cleanup
- Usage Aggregation
- Scheduled Tasks

---

🛠 Technology Stack

Category| Technology
Framework| Next.js (App Router)
Language| TypeScript
Styling| Tailwind CSS
UI| shadcn/ui
Backend| Convex
Authentication| WorkOS AuthKit
AI| OpenAI / OpenRouter
Database| Convex
Storage| AWS S3
Payments| Stripe
Jobs| Trigger.dev
Cache| Upstash Redis
Analytics| PostHog
Deployment| Vercel

---

📁 Project Structure

HackerAI
│
├── app/
│   ├── api/
│   ├── auth/
│   ├── chat/
│   ├── dashboard/
│   ├── editor/
│   ├── files/
│   ├── terminal/
│   └── page.tsx
│
├── components/
│   ├── chat/
│   ├── editor/
│   ├── files/
│   ├── layout/
│   ├── terminal/
│   ├── providers/
│   ├── sections/
│   └── ui/
│
├── convex/
├── hooks/
├── lib/
├── public/
├── styles/
├── trigger/
├── types/
├── utils/
│
├── middleware.ts
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json

---

📦 Core Modules

✔ AI Chat

✔ Interactive Terminal

✔ File Manager

✔ Code Editor

✔ Authentication

✔ Billing

✔ Storage

✔ Analytics

✔ Background Workers

✔ API Routes

---

🎯 Designed For

- Developers
- Students
- AI Enthusiasts
- SaaS Builders
- Startup Teams
- Learning Projects
- Production Applications

---

⏭️ Continue to README – Part 2

---

⚙️ Getting Started

Follow these steps to run HackerAI on your local machine.

📋 Prerequisites

Before starting, make sure you have installed:

Software| Version
Node.js| 18+ (Recommended: Latest LTS)
pnpm| Latest
Git| Latest
Convex CLI| Latest

Verify your installation:

node -v
pnpm -v
git --version

---

📥 Installation

Clone the repository:

git clone https://github.com/itssourov13/hackerai.git

Move into the project directory:

cd hackerai

Install dependencies:

pnpm install

---

🔑 Environment Variables

Create a new file named:

.env.local

Configure the required environment variables.

Service| Purpose
WorkOS| Authentication
Convex| Database & Backend
OpenAI / OpenRouter| AI Responses
Stripe| Subscription Payments
AWS S3| File Storage
Trigger.dev| Background Jobs
Upstash Redis| Rate Limiting & Cache
PostHog| Analytics

Example:

WORKOS_API_KEY=
WORKOS_CLIENT_ID=

CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

OPENAI_API_KEY=
OPENROUTER_API_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

POSTHOG_KEY=
POSTHOG_HOST=

TRIGGER_SECRET_KEY=

«Never commit ".env.local" or any secret keys to GitHub. Keep them private and configure them through your deployment platform.»

---

▶️ Running the Development Server

Start the development server:

pnpm dev

Open your browser:

http://localhost:3000

---

📦 Production Build

Create a production build:

pnpm build

Run the production server:

pnpm start

---

📜 Available Scripts

Command| Description
"pnpm dev"| Start development server
"pnpm build"| Build production application
"pnpm start"| Start production server
"pnpm lint"| Run linter
"pnpm typecheck"| TypeScript validation

---

🏗️ Architecture Overview

                    User
                      │
                      ▼
              Next.js Frontend
                      │
      ┌───────────────┼───────────────┐
      ▼               ▼               ▼
 Authentication     AI APIs       File Manager
   (WorkOS)     (OpenAI/OpenRouter)    │
      │                               ▼
      ▼                           AWS S3 Storage
      │
      ▼
      Convex Backend
      │
      ├──────────────┐
      ▼              ▼
 Subscription     User Data
   (Stripe)       & Projects
      │
      ▼
 Trigger.dev Background Jobs
      │
      ▼
 Upstash Redis + PostHog Analytics

---

🚀 Deployment

HackerAI is optimized for deployment on Vercel.

Deployment checklist:

- ✅ Configure all environment variables
- ✅ Connect your GitHub repository
- ✅ Configure WorkOS redirect URLs
- ✅ Configure Stripe Webhooks
- ✅ Deploy Convex backend
- ✅ Configure AWS S3 Bucket
- ✅ Configure Trigger.dev
- ✅ Configure Upstash Redis
- ✅ Configure PostHog

After deployment, your application will automatically build and publish.

---

⚡ Performance & Best Practices

- Server Components wherever possible
- Type-safe APIs with TypeScript
- Optimized Tailwind CSS
- Lazy-loaded UI components
- Background job processing
- Secure authentication flow
- Cloud object storage
- Scalable backend architecture
- Production-ready folder organization

---

⏭️ Continue to README – Part 3
---

🔒 Security

Security is a core priority of HackerAI.

To help keep your deployment secure:

- Never commit ".env.local" or any API keys to version control.
- Store secrets using your deployment platform's environment variable manager.
- Use HTTPS in production.
- Rotate API keys periodically.
- Configure proper CORS and authentication settings.
- Regularly update project dependencies.
- Validate all user input on both the client and server.
- Enable monitoring and logging for production deployments.

If you discover a security issue, please report it responsibly instead of publishing it publicly.

---

🤝 Contributing

Contributions are welcome and appreciated!

1. Fork this repository.
2. Create a new feature branch.

git checkout -b feature/amazing-feature

3. Commit your changes.

git commit -m "Add amazing feature"

4. Push your branch.

git push origin feature/amazing-feature

5. Open a Pull Request.

Please keep your code clean, well-documented, and consistent with the existing project structure.

---

🐛 Troubleshooting

Dependencies fail to install

pnpm install

or

pnpm install --force

---

Build fails

Remove previous build files and rebuild:

rm -rf .next
pnpm build

---

Convex connection issues

- Verify your deployment URL.
- Check your authentication configuration.
- Ensure all required environment variables are set correctly.

---

Authentication problems

- Verify your WorkOS Client ID and API Key.
- Check callback and redirect URLs.
- Confirm that your deployment domain is allowed.

---

📌 Roadmap

Planned improvements for future releases:

- AI Voice Assistant
- Multi-model AI routing
- Real-time collaboration
- Team workspaces
- Plugin ecosystem
- Mobile application
- AI project templates
- GitHub synchronization
- Terminal improvements
- Advanced analytics dashboard
- Marketplace integrations

---

📈 Project Status

Current Status: Active Development

HackerAI is actively maintained, with ongoing improvements focused on performance, user experience, AI capabilities, and developer productivity.

---

📄 License

This project is licensed under the MIT License.

You are free to use, modify, and distribute this project in accordance with the terms of the MIT License.

See the "LICENSE" file for more information.

---

👨‍💻 Author

Md Sourov Mondol

GitHub: https://github.com/itssourov13

Project Repository:

https://github.com/itssourov13/hackerai

---

💙 Acknowledgements

Special thanks to the amazing open-source community and the technologies that power HackerAI.

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Convex
- WorkOS
- OpenAI
- OpenRouter
- Stripe
- AWS
- Trigger.dev
- Upstash Redis
- PostHog
- Vercel

Without these projects, HackerAI would not be possible.

---

🌟 Support the Project

If you find HackerAI useful, please consider supporting the project by:

- ⭐ Starring this repository
- 🍴 Forking the project
- 🛠️ Contributing improvements
- 🐞 Reporting issues
- 💡 Suggesting new features

Your support helps the project grow and motivates future development.

---

<p align="center">Made with ❤️ by Md Sourov Mondol

Building the Future with AI

⭐ Don't forget to Star this Repository!

</p>

