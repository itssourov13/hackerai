'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Terminal, MessageSquare, Code2 } from 'lucide-react';
import { useEditorFiles } from '@/hooks/useEditorFiles';
import { EditorTabs } from '@/components/editor/EditorTabs';
import { cn } from '@/lib/utils';

const CodeEditor = dynamic(
  () => import('@/components/editor/CodeEditor').then((m) => m.CodeEditor),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">Loading editor...</div> }
);

const TerminalPanel = dynamic(
  () => import('@/components/terminal/TerminalPanel').then((m) => m.TerminalPanel),
  { ssr: false, loading: () => <div className="flex-1 bg-[#0a0a0a]" /> }
);

const LANGUAGE_MAP: Record<string, string> = {
  typescript: 'typescript',
  javascript: 'javascript',
  python: 'python',
  shell: 'bash',
};

export default function TerminalPage() {
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
  } = useEditorFiles();

  const [terminalHeight, setTerminalHeight] = useState(300);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const getRunLanguage = () => {
    if (!activeFile) return 'javascript';
    const lang = selectedLanguage || activeFile.language;
    return LANGUAGE_MAP[lang] ?? 'javascript';
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <div className="flex flex-col items-center gap-3 w-12 border-r border-white/5 bg-black/50 py-4 flex-shrink-0">
        <Link href="/" className="w-8 h-8 bg-red-500 rounded flex items-center justify-center mb-2">
          <Terminal className="w-4 h-4 text-black" />
        </Link>
        <Link href="/chat" className="p-2 text-zinc-500 hover:text-red-400 transition-colors" title="Chat">
          <MessageSquare className="w-4 h-4" />
        </Link>
        <Link href="/editor" className="p-2 text-zinc-500 hover:text-red-400 transition-colors" title="Editor">
          <Code2 className="w-4 h-4" />
        </Link>
        <div className="p-2 text-red-400" title="Terminal">
          <Terminal className="w-4 h-4" />
        </div>
      </div>

      {/* Main split panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor section */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Tabs */}
          <EditorTabs
            files={files}
            activeFileId={activeFileId}
            onSelect={setActiveFileId}
            onClose={deleteFile}
            onRename={renameFile}
            onNew={() => createFile('untitled.ts')}
          />

          {/* Run toolbar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 bg-black/20 flex-shrink-0">
            <div className="flex items-center gap-2">
              <select
                value={selectedLanguage || (activeFile?.language ?? 'typescript')}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-zinc-900/80 border border-white/10 rounded text-xs text-zinc-300 px-2 py-1 outline-none"
              >
                {['typescript', 'javascript', 'python', 'bash'].map((l) => (
                  <option key={l} value={l} className="bg-zinc-900">
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[10px] text-zinc-600 font-mono">
              Click Run in terminal panel to execute
            </span>
          </div>

          {/* Monaco */}
          <div className="flex-1 min-h-0">
            {activeFile && (
              <CodeEditor
                file={activeFile}
                onChange={(content) => updateContent(activeFile.id, content)}
                onCursorChange={(line, col, scrollTop) =>
                  updateCursor(activeFile.id, line, col, scrollTop)
                }
              />
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-1 bg-white/3 hover:bg-red-500/20 cursor-row-resize transition-colors flex-shrink-0"
          title="Drag to resize terminal"
        />

        {/* Terminal */}
        <div style={{ height: terminalHeight }} className="flex-shrink-0">
          <TerminalPanel className="h-full" />
        </div>
      </div>
    </div>
  );
}
