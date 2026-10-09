'use client';

import { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId?: string;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export function ChatSidebar({
  conversations,
  activeId,
  onNew,
  onSelect,
  onDelete,
  onRename,
}: ChatSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditValue(currentTitle);
  };

  const commitEdit = (id: string) => {
    if (editValue.trim()) onRename(id, editValue.trim());
    setEditingId(null);
  };

  return (
    <aside className="w-64 border-r border-white/5 bg-black/50 flex flex-col h-full">
      {/* Brand */}
      <div className="p-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-red-500 rounded flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-mono font-bold text-sm">
            Hacker<span className="text-red-500">AI</span>
          </span>
        </Link>
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-white/15 hover:border-red-500/40 hover:bg-red-500/5 text-zinc-400 hover:text-white text-sm transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto py-2">
        {conversations.length === 0 && (
          <p className="text-xs text-zinc-600 text-center mt-8 px-4">
            No conversations yet
          </p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={cn(
              'group mx-2 mb-0.5 rounded-lg flex items-center gap-2 px-3 py-2 cursor-pointer transition-all duration-100',
              activeId === conv.id
                ? 'bg-red-500/10 border border-red-500/20'
                : 'hover:bg-white/5 border border-transparent'
            )}
            onClick={() => onSelect(conv.id)}
          >
            <MessageSquare className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />

            {editingId === conv.id ? (
              <div className="flex items-center gap-1 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitEdit(conv.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="flex-1 bg-black/50 text-xs text-white outline-none border-b border-red-500/40 min-w-0"
                />
                <button onClick={() => commitEdit(conv.id)} className="text-green-500">
                  <Check className="w-3 h-3" />
                </button>
                <button onClick={() => setEditingId(null)} className="text-zinc-500">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-xs text-zinc-300 truncate">
                  {conv.title}
                </span>
                <div
                  className="hidden group-hover:flex items-center gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => startEdit(conv.id, conv.title)}
                    className="p-1 text-zinc-600 hover:text-zinc-300 transition-colors rounded"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDelete(conv.id)}
                    className="p-1 text-zinc-600 hover:text-red-400 transition-colors rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Footer nav */}
      <div className="p-3 border-t border-white/5">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
        >
          Dashboard
        </Link>
      </div>
    </aside>
  );
}
