'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/hooks/useChat';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/10 transition-colors"
      aria-label="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3 group', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
          isUser
            ? 'bg-red-500/20 border border-red-500/30'
            : 'bg-zinc-800 border border-white/10'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-red-400" />
        ) : (
          <Bot className="w-4 h-4 text-zinc-400" />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          'max-w-[80%] rounded-xl px-4 py-3 relative',
          isUser
            ? 'bg-red-500/10 border border-red-500/20 text-zinc-200'
            : 'bg-white/3 border border-white/8 text-zinc-200'
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;

                  if (isInline) {
                    return (
                      <code
                        className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-red-300 font-mono text-xs"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  const code = String(children).replace(/\n$/, '');
                  return (
                    <div className="relative group/code my-3 rounded-lg overflow-hidden border border-white/8">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-black/50 border-b border-white/5">
                        <span className="text-xs font-mono text-zinc-500">{match[1]}</span>
                        <CopyButton text={code} />
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          padding: '12px',
                          background: 'rgba(0,0,0,0.5)',
                          fontSize: '12px',
                          lineHeight: '1.6',
                        }}
                      >
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
                p({ children }) {
                  return <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="text-sm list-disc list-inside space-y-1 my-2">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="text-sm list-decimal list-inside space-y-1 my-2">{children}</ol>;
                },
                h1({ children }) {
                  return <h1 className="text-base font-bold my-2">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-sm font-bold my-2">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-sm font-semibold my-1">{children}</h3>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-red-500 animate-pulse ml-0.5 rounded-sm" />
            )}
          </div>
        )}

        {/* Copy full message */}
        {!isStreaming && message.content && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={message.content} />
          </div>
        )}
      </div>
    </div>
  );
}
