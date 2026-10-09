import {
  MessageSquare,
  Code2,
  Terminal,
  Upload,
  Shield,
  Zap,
  GitBranch,
  Brain,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Multi-Model AI Chat',
    description:
      'Switch seamlessly between OpenAI and OpenRouter models. Stream responses in real time with context-aware conversations.',
    tag: 'AI',
  },
  {
    icon: Code2,
    title: 'Monaco Code Editor',
    description:
      'Full IDE experience in the browser. Multi-tab editing, syntax highlighting for 10+ languages, AI code insertion.',
    tag: 'Editor',
  },
  {
    icon: Terminal,
    title: 'Sandboxed Execution',
    description:
      'Run JavaScript, TypeScript, Python, and Bash in isolated E2B containers. Secure by design.',
    tag: 'Runtime',
  },
  {
    icon: Upload,
    title: 'Document Processing',
    description:
      'Upload PDFs, DOCX, ZIP archives and more. Extract content and feed it directly to the AI for analysis.',
    tag: 'Files',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'WorkOS authentication, signed storage URLs, webhook verification, rate limiting, and CSP headers.',
    tag: 'Security',
  },
  {
    icon: Zap,
    title: 'Background Jobs',
    description:
      'Trigger.dev powers async processing — file extraction, usage aggregation, cache cleanup, and scheduled tasks.',
    tag: 'Automation',
  },
  {
    icon: GitBranch,
    title: 'Version-Ready APIs',
    description:
      'Versioned, backward-compatible API architecture ready for integrations and third-party extensions.',
    tag: 'API',
  },
  {
    icon: MessageSquare,
    title: 'Conversation History',
    description:
      'Persistent chat with Convex. Search, rename, and continue conversations across sessions.',
    tag: 'Persistence',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono mb-4">
            FEATURES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need to
            <br />
            <span className="text-gradient-red">build without limits</span>
          </h2>
          <p className="max-w-xl mx-auto text-zinc-400">
            A complete AI development platform — not a collection of disconnected tools.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group card-surface-hover rounded-xl p-6 cursor-default"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500/20 transition-colors duration-200">
                    <Icon className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-zinc-600 border border-white/8 rounded px-1.5 py-0.5 bg-white/3">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
