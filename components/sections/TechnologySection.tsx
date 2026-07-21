const technologies = [
  { name: 'Next.js', category: 'Framework', color: 'text-white' },
  { name: 'TypeScript', category: 'Language', color: 'text-blue-400' },
  { name: 'Convex', category: 'Database', color: 'text-orange-400' },
  { name: 'WorkOS', category: 'Auth', color: 'text-purple-400' },
  { name: 'OpenAI', category: 'AI', color: 'text-green-400' },
  { name: 'OpenRouter', category: 'AI', color: 'text-green-400' },
  { name: 'Monaco Editor', category: 'Editor', color: 'text-red-400' },
  { name: 'E2B', category: 'Sandbox', color: 'text-yellow-400' },
  { name: 'Xterm.js', category: 'Terminal', color: 'text-zinc-300' },
  { name: 'Stripe', category: 'Payments', color: 'text-indigo-400' },
  { name: 'AWS S3', category: 'Storage', color: 'text-orange-300' },
  { name: 'Upstash Redis', category: 'Cache', color: 'text-red-300' },
  { name: 'Trigger.dev', category: 'Jobs', color: 'text-amber-400' },
  { name: 'PostHog', category: 'Analytics', color: 'text-rose-400' },
  { name: 'Tailwind CSS', category: 'Styling', color: 'text-cyan-400' },
  { name: 'Zod', category: 'Validation', color: 'text-blue-300' },
];

export function TechnologySection() {
  return (
    <section id="technology" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono mb-4">
            TECHNOLOGY
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built on the
            <span className="text-gradient-red"> best stack</span>
          </h2>
          <p className="max-w-xl mx-auto text-zinc-400">
            Production-grade technologies chosen for reliability, performance, and developer experience.
          </p>
        </div>

        {/* Tech grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="group card-surface-hover rounded-lg p-4 flex flex-col gap-1"
            >
              <span className={`text-sm font-semibold ${tech.color}`}>
                {tech.name}
              </span>
              <span className="text-xs text-zinc-600 font-mono">
                {tech.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
