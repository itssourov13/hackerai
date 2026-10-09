'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Terminal, MessageSquare, Code2, Upload } from 'lucide-react';

const FileManager = dynamic(
  () => import('@/components/files/FileManager').then((m) => m.FileManager),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">Loading...</div> }
);

export default function FilesPage() {
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
        <Link href="/terminal" className="p-2 text-zinc-500 hover:text-red-400 transition-colors" title="Terminal">
          <Terminal className="w-4 h-4" />
        </Link>
        <div className="p-2 text-red-400" title="Files">
          <Upload className="w-4 h-4" />
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/50 backdrop-blur-sm flex-shrink-0">
          <h1 className="text-sm font-semibold text-white">File Manager</h1>
          <span className="text-xs text-zinc-600">Drag & drop to upload and process documents</span>
        </header>
        <div className="flex-1 overflow-y-auto">
          <FileManager />
        </div>
      </div>
    </div>
  );
}
