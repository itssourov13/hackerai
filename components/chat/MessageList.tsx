'use client';

import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import type { ChatMessage } from '@/hooks/useChat';
import { Bot } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <div className="w-16 h-16 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Start a conversation
        </h3>
        <p className="text-sm text-zinc-500 max-w-xs">
          Ask me to write code, explain concepts, debug errors, or design systems.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
      {messages.map((message, i) => (
        <MessageBubble
          key={message.id}
          message={message}
          isStreaming={
            isStreaming && i === messages.length - 1 && message.role === 'assistant'
          }
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
