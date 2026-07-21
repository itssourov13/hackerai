'use client';

import { useState } from 'react';
import { X, Edit2, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EditorFile } from '@/hooks/useEditorFiles';

interface EditorTabsProps {
  files: EditorFile[];
  activeFileId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onNew: () => void;
}

function FileIcon({ name }: { name: string }) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const colors: Record<string, string> = {
    ts: 'text-blue-400',
    tsx: 'text-blue-400',
    js: 'text-yellow-400',
    jsx: 'text-yellow-400',
    py: 'text-green-400',
    html: 'text-orange-400',
    css: 'text-pink-400',
    json: 'text-zinc-400',
    md: 'text-zinc-300',
    sh: 'text-green-300',
  };
  return (
    <span className={cn('text-[10px] font-mono font-bold', colors[ext] ?? 'text-zinc-400')}>
      {ext.toUpperCase().slice(0, 2)}
    </span>
  );
}

export function EditorTabs({
  files,
  activeFileId,
  onSelect,
  onClose,
  onRename,
  onNew,
}: EditorTabsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditValue(name);
  };

  const commitEdit = (id: string) => {
    if (editValue.trim()) onRename(id, editValue.trim());
    setEditingId(null);
  };

  return (
    <div className="flex items-center border-b border-white/5 bg-black/30 overflow-x-auto scrollbar-thin">
      {files.map((file) => {
        const isActive = file.id === activeFileId;
        const isDirty = file.content !== file.savedContent;

        return (
          <div
            key={file.id}
            onClick={() => onSelect(file.id)}
            className={cn(
              'group flex items-center gap-1.5 px-3 py-2.5 border-r border-white/5 cursor-pointer min-w-0 flex-shrink-0 max-w-[160px] transition-colors',
              isActive
                ? 'bg-zinc-900/80 border-t border-t-red-500/60'
                : 'hover:bg-white/5'
            )}
          >
            <FileIcon name={file.name} />

            {editingId === file.id ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit(file.id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                onBlur={() => commitEdit(file.id)}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent text-xs text-white outline-none border-b border-red-500/40 min-w-0 w-20"
              />
            ) : (
              <span
                className="flex-1 text-xs text-zinc-400 truncate"
                onDoubleClick={(e) => startEdit(file.id, file.name, e)}
              >
                {file.name}
              </span>
            )}

            {isDirty && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(file.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all ml-0.5"
              aria-label="Close tab"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}

      <button
        onClick={onNew}
        className="px-3 py-2.5 text-zinc-600 hover:text-zinc-300 transition-colors flex-shrink-0"
        aria-label="New file"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
