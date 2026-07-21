'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Terminal, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Technology', href: '#technology' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center transition-all duration-200 group-hover:bg-red-400">
              <Terminal className="w-4 h-4 text-black" />
            </div>
            <span className="font-mono font-bold text-lg tracking-tight">
              Hacker<span className="text-red-500">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors duration-150 rounded-md hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-150 px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-400 text-black text-sm font-semibold rounded-md transition-all duration-150 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              <Zap className="w-4 h-4" />
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden animate-slide-down mt-4 pb-4 border-t border-white/5">
            <nav className="flex flex-col gap-1 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5">
                <Link
                  href="/sign-in"
                  className="px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-400 text-black text-sm font-semibold rounded-md transition-all duration-150"
                  onClick={() => setMobileOpen(false)}
                >
                  <Zap className="w-4 h-4" />
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
