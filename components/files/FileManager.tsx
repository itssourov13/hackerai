'use client';

import { useRef, useState } from 'react';
import { Upload, X, FileText, File, AlertCircle, CheckCircle, Loader2, Search, Trash2, Eye } from 'lucide-react';
import { useFileUpload, type UploadedFile } from '@/hooks/useFileUpload';
import { formatBytes, ACCEPTED_EXTENSIONS } from '@/lib/upload/config';
import { cn } from '@/lib/utils';

function FileStatusIcon({ status }: { status: UploadedFile['status'] }) {
  if (status === 'processing') return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
  if (status === 'ready') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === 'error') return <AlertCircle className="w-4 h-4 text-red-400" />;
  return <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />;
}

function FileRow({
  file,
  onRemove,
  onPreview,
}: {
  file: UploadedFile;
  onRemove: (id: string) => void;
  onPreview: (file: UploadedFile) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/3 group transition-colors">
      <FileStatusIcon status={file.status} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-200 truncate">{file.name}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[11px] text-zinc-600">{formatBytes(file.size)}</span>
          {file.wordCount && (
            <span className="text-[11px] text-zinc-600">{file.wordCount.toLocaleString()} words</span>
          )}
          {file.pageCount && (
            <span className="text-[11px] text-zinc-600">{file.pageCount} pages</span>
          )}
          {file.errorMessage && (
            <span className="text-[11px] text-red-400 truncate">{file.errorMessage}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {file.extractedText && (
          <button
            onClick={() => onPreview(file)}
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
            title="Preview extracted text"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => onRemove(file.id)}
          className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function PreviewModal({ file, onClose }: { file: UploadedFile; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            <h3 className="text-sm font-semibold text-white">{file.name}</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {file.wordCount?.toLocaleString()} words · {formatBytes(file.size)}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <pre className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed font-mono">
            {file.extractedText?.slice(0, 10000)}
            {(file.extractedText?.length ?? 0) > 10000 && '\n\n[Preview truncated at 10,000 characters]'}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function FileManager() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { files, isDragging, addFiles, removeFile, handleDragOver, handleDragLeave, handleDrop } =
    useFileUpload();
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<UploadedFile | null>(null);

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const readyCount = files.filter((f) => f.status === 'ready').length;
  const errorCount = files.filter((f) => f.status === 'error').length;

  return (
    <div className="flex flex-col h-full">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 m-4',
          isDragging
            ? 'border-red-500/60 bg-red-500/5'
            : 'border-white/10 hover:border-white/20 hover:bg-white/3'
        )}
      >
        <Upload className={cn('w-8 h-8 mx-auto mb-3', isDragging ? 'text-red-400' : 'text-zinc-500')} />
        <p className="text-sm text-zinc-400 mb-1">
          {isDragging ? 'Drop files here' : 'Drag & drop files or click to browse'}
        </p>
        <p className="text-xs text-zinc-600">
          PDF, DOCX, TXT, MD, JSON, CSV, ZIP, source code — up to 500 MB total
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(',')}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <>
          {/* Stats + Search */}
          <div className="flex items-center gap-3 px-4 pb-3">
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="text-zinc-400 font-medium">{files.length} files</span>
              {readyCount > 0 && <span className="text-green-500">{readyCount} ready</span>}
              {errorCount > 0 && <span className="text-red-400">{errorCount} errors</span>}
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files..."
                className="w-full bg-white/5 border border-white/8 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-red-500/30"
              />
            </div>
          </div>

          {/* File list */}
          <div className="flex-1 overflow-y-auto border border-white/5 rounded-xl mx-4 bg-black/30">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-zinc-600 py-8">No files match your search</p>
            ) : (
              filtered.map((file) => (
                <FileRow key={file.id} file={file} onRemove={removeFile} onPreview={setPreview} />
              ))
            )}
          </div>
        </>
      )}

      {preview && <PreviewModal file={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
