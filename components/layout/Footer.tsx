import Link from 'next/link';
import { Terminal, Github, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '#' },
  ],
  Developers: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Security', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <Terminal className="w-4 h-4 text-black" />
              </div>
              <span className="font-mono font-bold text-lg">
                Hacker<span className="text-red-500">AI</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6 max-w-xs">
              The AI-powered development environment for elite hackers. Write, execute, and ship code faster.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-zinc-400 transition-all duration-150"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-zinc-400 transition-all duration-150"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-zinc-400 transition-all duration-150"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} HackerAI. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600 font-mono">
            Built for the future. <span className="text-red-500/70">_ </span>
            <span className="cursor-blink text-red-500">|</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
