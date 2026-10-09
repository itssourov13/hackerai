import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-black to-black border border-red-500/20" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full bg-red-500/10 blur-[80px]" />
          </div>

          <div className="relative z-10 py-16 px-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                <Terminal className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to hack smarter?
            </h2>
            <p className="text-lg text-zinc-400 mb-8 max-w-xl mx-auto">
              Join thousands of developers already using HackerAI to build, test, and ship faster than ever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="flex items-center gap-2 px-8 py-3.5 bg-red-500 hover:bg-red-400 text-black font-bold rounded-md transition-all duration-150 hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] group text-base"
              >
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sign-in"
                className="flex items-center gap-2 px-8 py-3.5 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white rounded-md transition-all duration-150 hover:bg-white/5 text-base"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
