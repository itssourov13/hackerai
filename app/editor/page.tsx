'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { EditorTabs } from '@/components/editor/EditorTabs';
import { useEditorFiles } from '@/hooks/useEditorFiles';
import {
  Save,
  Settings,
  Maximize2,
  WrapText,
  Map,
  MessageSquare,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const CodeEditor = dynamic(
  () => import('@/components/editor/CodeEditor').then((m) => m.CodeEditor),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">Loading editor...</div> }
);

interface NewFileDialogProps {
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

function NewFileDialog({ onConfirm, onCancel }: NewFileDialogProps) {
  const [name, setName] = useState('untitled.ts');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-80 shadow-2xl">
        <h3 className="text-sm font-semibold text-white mb-4">New File</h3>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && name.trim()) onConfirm(name.trim());
            if (e.key === 'Escape') onCancel();
          }}
          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-red-500/40 mb-4 font-mono"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={() => name.trim() && onConfirm(name.trim())}
            className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-400 text-black font-semibold rounded-lg transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  const {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    createFile,
    updateContent,
    saveFile,
    renameFile,
    deleteFile,
    updateCursor,
    insertCode,
  } = useEditorFiles();

  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('off');
  const [minimapEnabled, setMinimapEnabled] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [newFileOpen, setNewFileOpen] = useState(false);

  const handleSave = useCallback(() => {
    if (activeFile) saveFile(activeFile.id);
  }, [activeFile, saveFile]);

  // Keyboard shortcut
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    },
    [handleSave]
  );

  return (
    <div
      className="flex h-screen bg-black overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={{ outline: 'none' }}
    >
      {/* Sidebar quick nav */}
      <div className="flex flex-col items-center gap-3 w-12 border-r border-white/5 bg-black/50 py-4 flex-shrink-0">
        <Link href="/" className="w-8 h-8 bg-red-500 rounded flex items-center justify-center mb-2">
          <Terminal className="w-4 h-4 text-black" />
        </Link>
        <Link href="/chat" className="p-2 text-zinc-500 hover:text-red-400 transition-colors" title="Chat">
          <MessageSquare className="w-4 h-4" />
        </Link>
        <Link href="/terminal" className="p-2 text-zinc-500 hover:text-red-400 transition-colors" title="Terminal">
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Editor main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs */}
        <EditorTabs
          files={files}
          activeFileId={activeFileId}
          onSelect={setActiveFileId}
          onClose={deleteFile}
          onRename={renameFile}
          onNew={() => setNewFileOpen(true)}
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 bg-black/20 flex-shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Save (Ctrl+S)"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setWordWrap((w) => (w === 'on' ? 'off' : 'on'))}
              className={cn(
                'p-1.5 rounded text-xs transition-colors',
                wordWrap === 'on'
                  ? 'text-red-400 bg-red-500/10'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              )}
              title="Toggle word wrap"
            >
              <WrapText className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMinimapEnabled((v) => !v)}
              className={cn(
                'p-1.5 rounded text-xs transition-colors',
                minimapEnabled
                  ? 'text-red-400 bg-red-500/10'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              )}
              title="Toggle minimap"
            >
              <Map className="w-3.5 h-3.5" />
            </button>

            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-transparent text-xs text-zinc-500 outline-none border border-white/8 rounded px-1.5 py-1"
            >
              {[11, 12, 13, 14, 15, 16, 18, 20].map((s) => (
                <option key={s} value={s} className="bg-zinc-900">
                  {s}px
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 min-h-0">
          {activeFile && (
            <CodeEditor
              file={activeFile}
              onChange={(content) => updateContent(activeFile.id, content)}
              onCursorChange={(line, col, scrollTop) =>
                updateCursor(activeFile.id, line, col, scrollTop)
              }
              fontSize={fontSize}
              wordWrap={wordWrap}
              minimapEnabled={minimapEnabled}
            />
          )}
        </div>

        {/* Status bar */}
        {activeFile && (
          <div className="flex items-center justify-between px-4 py-1 border-t border-white/5 bg-black/50 flex-shrink-0">
            <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-mono">
              <span className="text-zinc-500">{activeFile.name}</span>
              <span>{activeFile.language}</span>
              {activeFile.cursorLine && (
                <span>
                  Ln {activeFile.cursorLine}, Col {activeFile.cursorColumn}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[10px] text-zinc-600">
              <span>
                {activeFile.content !== activeFile.savedContent ? (
                  <span className="text-yellow-500/70">Modified</span>
                ) : (
                  <span className="text-green-500/70">Saved</span>
                )}
              </span>
              <span>UTF-8</span>
            </div>
          </div>
        )}
      </div>

      {/* New file dialog */}
      {newFileOpen && (
        <NewFileDialog
          onConfirm={(name) => {
            createFile(name);
            setNewFileOpen(false);
          }}
          onCancel={() => setNewFileOpen(false)}
        />
      )}
    </div>
  );
}
