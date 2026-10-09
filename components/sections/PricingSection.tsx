import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'Get started with AI-assisted coding.',
    features: [
      '50 AI messages/month',
      '5 file uploads',
      '10 code executions',
      '500MB storage',
      'Monaco editor',
      'Community support',
    ],
    cta: 'Start Free',
    href: '/sign-up',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'Full power for serious engineers.',
    features: [
      'Unlimited AI messages',
      '500 file uploads',
      'Unlimited code executions',
      '50GB storage',
      'All AI models',
      'Priority support',
      'Advanced analytics',
      'API access',
    ],
    cta: 'Start Pro',
    href: '/sign-up',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$79',
    period: '/mo',
    description: 'Collaborative AI development for teams.',
    features: [
      'Everything in Pro',
      'Up to 10 seats',
      'Shared workspaces',
      '200GB storage',
      'Team analytics',
      'SSO via WorkOS',
      'Admin dashboard',
      'SLA support',
    ],
    cta: 'Start Team Trial',
    href: '/sign-up',
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono mb-4">
            PRICING
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, transparent
            <span className="text-gradient-red"> pricing</span>
          </h2>
          <p className="max-w-xl mx-auto text-zinc-400">
            No hidden fees. Cancel anytime. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl p-6 flex flex-col ${
                plan.highlighted
                  ? 'bg-red-500/10 border border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.1)]'
                  : 'card-surface border border-white/8'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500 text-black text-xs font-bold rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-zinc-500">{plan.period}</span>
                </div>
                <p className="text-sm text-zinc-500">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-150 ${
                  plan.highlighted
                    ? 'bg-red-500 hover:bg-red-400 text-black hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                    : 'border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
