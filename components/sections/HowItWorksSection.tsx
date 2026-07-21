import { UserPlus, MessageSquare, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description:
      'Sign up in seconds with WorkOS AuthKit. Your workspace is instantly provisioned and ready to use.',
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Start a Conversation',
    description:
      'Chat with the AI to generate code, explain concepts, debug errors, or plan your architecture.',
  },
  {
    number: '03',
    icon: Code2,
    title: 'Edit in Monaco',
    description:
      'Open the built-in editor, paste AI-generated code, tweak it with full IDE support — tabs, search, and multi-cursor.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Execute & Ship',
    description:
      'Run your code in the sandboxed E2B terminal, verify the output, and ship with confidence.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono mb-4">
            HOW IT WORKS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            From idea to
            <span className="text-gradient-red"> working code</span>
          </h2>
          <p className="max-w-xl mx-auto text-zinc-400">
            Four steps from signup to shipping production-ready code with AI assistance.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative text-center lg:text-left">
                  <div className="flex lg:flex-row flex-col items-center lg:items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl border border-red-500/30 bg-red-500/10 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-red-500" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black border border-red-500/40 flex items-center justify-center text-[10px] font-mono text-red-500 font-bold">
                        {step.number.slice(1)}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
