'use client';

import { useState, useCallback } from 'react';
import { isAcceptedMime, getMaxSize, formatBytes } from '@/lib/upload/config';
import { processFile } from '@/lib/upload/processors';

export type UploadStatus = 'pending' | 'processing' | 'ready' | 'error';

export interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  status: UploadStatus;
  extractedText?: string;
  wordCount?: number;
  pageCount?: number;
  errorMessage?: string;
  createdAt: number;
}

interface UseFileUploadOptions {
  onUpload?: (file: UploadedFile) => void;
  maxFiles?: number;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const updateFile = useCallback((id: string, updates: Partial<UploadedFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }, []);

  const processUpload = useCallback(
    async (rawFile: File) => {
      const id = crypto.randomUUID();

      // Validation
      if (!isAcceptedMime(rawFile.type)) {
        const errFile: UploadedFile = {
          id,
          name: rawFile.name,
          originalName: rawFile.name,
          size: rawFile.size,
          mimeType: rawFile.type,
          status: 'error',
          errorMessage: `Unsupported file type: ${rawFile.type || 'unknown'}`,
          createdAt: Date.now(),
        };
        setFiles((prev) => [...prev, errFile]);
        return;
      }

      const maxSize = getMaxSize(rawFile.type);
      if (rawFile.size > maxSize) {
        const errFile: UploadedFile = {
          id,
          name: rawFile.name,
          originalName: rawFile.name,
          size: rawFile.size,
          mimeType: rawFile.type,
          status: 'error',
          errorMessage: `File too large. Max: ${formatBytes(maxSize)}`,
          createdAt: Date.now(),
        };
        setFiles((prev) => [...prev, errFile]);
        return;
      }

      const pending: UploadedFile = {
        id,
        name: rawFile.name,
        originalName: rawFile.name,
        size: rawFile.size,
        mimeType: rawFile.type,
        status: 'processing',
        createdAt: Date.now(),
      };

      setFiles((prev) => [...prev, pending]);

      try {
        const processed = await processFile(rawFile);
        const ready: Partial<UploadedFile> = {
          status: 'ready',
          extractedText: processed.text || undefined,
          wordCount: processed.wordCount || undefined,
          pageCount: processed.pageCount,
        };
        updateFile(id, ready);

        const completed = { ...pending, ...ready };
        options.onUpload?.({ ...completed, status: 'ready' });
      } catch (err) {
        updateFile(id, {
          status: 'error',
          errorMessage: err instanceof Error ? err.message : 'Processing failed',
        });
      }
    },
    [updateFile, options]
  );

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming);
      arr.forEach((f) => processUpload(f));
    },
    [processUpload]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const renameFile = useCallback((id: string, name: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  return {
    files,
    isDragging,
    addFiles,
    removeFile,
    renameFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
