'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Terminal, ArrowRight, Loader2, Check } from 'lucide-react';

const perks = [
  'Free tier with 50 AI messages/month',
  'Monaco Editor with syntax highlighting',
  'Sandboxed code execution',
  'No credit card required',
];

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setLoading(true);
    const authUrl = `https://api.workos.com/user_management/authorize?${new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID || '',
      redirect_uri: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI || `${window.location.origin}/auth/callback`,
      response_type: 'code',
      screen_hint: 'sign-up',
    })}`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black">
      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(239,68,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <Link href="/" className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
          <Terminal className="w-4 h-4 text-black" />
        </div>
        <span className="font-mono font-bold text-lg">
          Hacker<span className="text-red-500">AI</span>
        </span>
      </Link>

      <div className="w-full max-w-md">
        <div className="card-surface rounded-xl p-8 border border-white/8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Create your account
          </h1>
          <p className="text-sm text-zinc-500 text-center mb-6">
            Start hacking with AI for free — no credit card required
          </p>

          {/* Perks */}
          <ul className="space-y-2 mb-8">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2 text-sm text-zinc-400">
                <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                {perk}
              </li>
            ))}
          </ul>

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-md transition-all duration-150 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-xs text-zinc-600 text-center mt-6">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-red-500 hover:text-red-400 transition-colors">
              Sign in
            </Link>
          </p>

          <p className="text-xs text-zinc-700 text-center mt-4">
            By signing up you agree to our{' '}
            <Link href="#" className="underline hover:text-zinc-500 transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline hover:text-zinc-500 transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
