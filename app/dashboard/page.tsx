import { redirect } from 'next/navigation';
import { getUser } from '@/lib/session';
import { Terminal, MessageSquare, Code2, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in?redirect=/dashboard');
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Dashboard header */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-500 rounded flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-mono font-bold text-base">
              Hacker<span className="text-red-500">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">{user.email}</span>
            <a
              href="/auth/sign-out"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back{user.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="text-zinc-500">
            Your AI-powered development workspace is ready.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: MessageSquare, label: 'AI Chat', desc: 'Start a new conversation', href: '/chat', color: 'text-red-500' },
            { icon: Code2, label: 'Code Editor', desc: 'Open Monaco editor', href: '/editor', color: 'text-blue-400' },
            { icon: Settings, label: 'Settings', desc: 'Manage your account', href: '/settings', color: 'text-zinc-400' },
          ].map(({ icon: Icon, label, desc, href, color }) => (
            <Link
              key={label}
              href={href}
              className="group card-surface-hover rounded-xl p-6"
            >
              <Icon className={`w-8 h-8 ${color} mb-4`} />
              <h3 className="text-base font-semibold text-white mb-1">{label}</h3>
              <p className="text-sm text-zinc-500">{desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
