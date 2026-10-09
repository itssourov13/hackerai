'use client';

import { useState, FormEvent } from 'react';
import { Send, Square, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onStop,
  isStreaming,
  disabled,
  placeholder = 'Message HackerAI...',
}: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled || isStreaming) return;
    onSend(value);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={cn(
          'flex items-end gap-2 rounded-xl border bg-black/50 p-3 transition-colors',
          isStreaming || disabled
            ? 'border-white/5 opacity-75'
            : 'border-white/10 focus-within:border-red-500/40'
        )}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 resize-none outline-none leading-relaxed max-h-40 overflow-y-auto"
          style={{ minHeight: '24px' }}
        />

        <div className="flex items-center gap-1 flex-shrink-0">
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center transition-colors"
              aria-label="Stop generation"
            >
              <Square className="w-3.5 h-3.5 text-red-400" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!value.trim() || disabled}
              className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5 text-black" />
            </button>
          )}
        </div>
      </div>
      <p className="text-[10px] text-zinc-700 mt-1.5 text-center">
        Press <kbd className="font-mono">Enter</kbd> to send, <kbd className="font-mono">Shift+Enter</kbd> for newline
      </p>
    </form>
  );
}
