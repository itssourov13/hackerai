'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Terminal, ArrowRight, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

function SignInForm() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSignIn = () => {
    setLoading(true);
    const authUrl = `https://api.workos.com/user_management/authorize?${new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID || '',
      redirect_uri: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI || `${window.location.origin}/auth/callback`,
      response_type: 'code',
      state: encodeURIComponent(redirect),
    })}`;
    window.location.href = authUrl;
  };

  const errorMessages: Record<string, string> = {
    missing_code: 'Authorization code missing. Please try again.',
    auth_failed: 'Authentication failed. Please try again.',
    server_error: 'Server error. Please try again later.',
    misconfigured: 'Auth is not configured yet.',
  };

  return (
    <div className="w-full max-w-md">
      <div className="card-surface rounded-xl p-8 border border-white/8">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
            <Terminal className="w-6 h-6 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-500 text-center mb-8">
          Sign in to your HackerAI account
        </p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {errorMessages[error] || 'An error occurred. Please try again.'}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-md transition-all duration-150 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Continue with WorkOS
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-xs text-zinc-600 text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-red-500 hover:text-red-400 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
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

      <Suspense fallback={<div className="text-zinc-500 text-sm">Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
