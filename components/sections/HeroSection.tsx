'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Code2 } from 'lucide-react';

const terminalLines = [
  { prompt: '$ ', text: 'hackerai --init', delay: 0 },
  { prompt: '', text: 'Initializing AI environment...', delay: 800, dim: true },
  { prompt: '', text: 'Loading neural networks...', delay: 1600, dim: true },
  { prompt: '', text: 'Ready.', delay: 2400, color: 'text-green-500' },
  { prompt: '$ ', text: 'hackerai chat "Build me a REST API"', delay: 3200 },
  { prompt: '', text: 'Generating production-ready code...', delay: 4000, dim: true, color: 'text-red-400' },
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const lines = el.querySelectorAll('[data-line]');
    lines.forEach((line, i) => {
      const delay = parseInt((line as HTMLElement).dataset.delay || '0');
      setTimeout(() => {
        (line as HTMLElement).style.opacity = '1';
        (line as HTMLElement).style.transform = 'translateY(0)';
      }, delay);
    });
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(239,68,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Red radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-red-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          AI-Powered Development Platform v2.0
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up">
          <span className="text-white">Code Smarter.</span>
          <br />
          <span className="text-gradient-red">Ship Faster.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg text-zinc-400 leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          The AI-powered development environment built for elite engineers.
          Intelligent chat, Monaco editor, secure sandboxed execution — all in one terminal.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <Link
            href="/sign-up"
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-400 text-black font-semibold rounded-md transition-all duration-150 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] group"
          >
            <Zap className="w-4 h-4" />
            Start Hacking Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#how-it-works"
            className="flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white rounded-md transition-all duration-150 hover:bg-white/5"
          >
            See How It Works
          </Link>
        </div>

        {/* Terminal Preview */}
        <div className="max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.35s', opacity: 0 }}>
          <div className="rounded-xl border border-white/8 bg-black/60 backdrop-blur-md overflow-hidden shadow-2xl">
            {/* Terminal bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/3">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-zinc-500 font-mono">hackerai — terminal</span>
            </div>
            {/* Terminal content */}
            <div ref={containerRef} className="p-6 font-mono text-sm text-left min-h-[180px]">
              {terminalLines.map((line, i) => (
                <div
                  key={i}
                  data-line={i}
                  data-delay={line.delay}
                  className={`flex gap-2 mb-1 transition-all duration-300 ${line.dim ? 'text-zinc-500' : line.color || 'text-zinc-200'}`}
                  style={{ opacity: 0, transform: 'translateY(4px)' }}
                >
                  {line.prompt && <span className="text-red-500">{line.prompt}</span>}
                  <span>{line.text}</span>
                  {i === terminalLines.length - 1 && (
                    <span className="cursor-blink text-red-500">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-fade-in" style={{ animationDelay: '0.5s', opacity: 0 }}>
          {[
            { icon: Shield, label: 'Sandboxed Execution' },
            { icon: Zap, label: 'Real-time Streaming' },
            { icon: Code2, label: 'Monaco Editor' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-zinc-500">
              <Icon className="w-4 h-4 text-red-500/70" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
