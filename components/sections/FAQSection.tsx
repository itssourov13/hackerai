'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'What AI models does HackerAI support?',
    answer:
      'HackerAI supports OpenAI (GPT-4, GPT-4o, GPT-3.5) and OpenRouter, giving you access to 100+ models including Claude, Llama, Mistral, and more. You can switch models per conversation.',
  },
  {
    question: 'Is code execution really sandboxed?',
    answer:
      'Yes. All code runs inside isolated E2B containers — not on our servers. Each session gets its own ephemeral environment with no access to other users\' data or your host machine.',
  },
  {
    question: 'What file types can I upload?',
    answer:
      'HackerAI supports PDF, DOCX, TXT, Markdown, JSON, CSV, ZIP archives, and common source code files (JS/TS/Python/HTML/CSS). ZIP archives are automatically extracted and indexed.',
  },
  {
    question: 'How is my data stored?',
    answer:
      'Conversations and metadata are stored in Convex. Files are uploaded to AWS S3 with signed, time-limited URLs. We never share your data with third parties.',
  },
  {
    question: 'Can I use HackerAI with my team?',
    answer:
      'Yes. The Team plan includes up to 10 seats, shared workspaces, SSO via WorkOS, and a dedicated admin dashboard.',
  },
  {
    question: 'Do you have an API?',
    answer:
      'Versioned API access is included in the Pro and Team plans. Build integrations, automate workflows, and extend HackerAI with your own tools.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Absolutely. Cancel anytime from the billing dashboard — you keep access until the end of your billing period with no hidden fees.',
  },
  {
    question: 'Is there a free tier?',
    answer:
      'Yes. The Free plan includes 50 AI messages/month, 5 file uploads, and 10 code executions — no credit card required to start.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
          {question}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform duration-200',
            open && 'rotate-180 text-red-500'
          )}
        />
      </button>
      {open && (
        <div className="pb-5 animate-fade-in">
          <p className="text-sm text-zinc-500 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono mb-4">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently asked
            <span className="text-gradient-red"> questions</span>
          </h2>
        </div>

        {/* Items */}
        <div className="card-surface rounded-xl px-6 divide-y divide-white/5">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
