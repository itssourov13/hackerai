import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ConvexClientProvider } from '@/components/providers/ConvexClientProvider';
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'HackerAI — AI-Powered Development Platform',
  description: 'The AI-powered development environment for elite hackers. Write, execute, and ship code faster with cutting-edge AI assistance.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'HackerAI — AI-Powered Development Platform',
    description: 'The AI-powered development environment for elite hackers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HackerAI — AI-Powered Development Platform',
    description: 'The AI-powered development environment for elite hackers.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.variable, jetbrainsMono.variable, 'font-sans bg-black text-white antialiased')}>
        <ConvexClientProvider>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
