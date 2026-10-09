'use client';

import { useState, useCallback } from 'react';

export interface EditorFile {
  id: string;
  name: string;
  language: string;
  content: string;
  savedContent: string;
  cursorLine?: number;
  cursorColumn?: number;
  scrollTop?: number;
}

function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    sh: 'shell',
    bash: 'shell',
    yml: 'yaml',
    yaml: 'yaml',
    sql: 'sql',
    rs: 'rust',
    go: 'go',
  };
  return map[ext] ?? 'plaintext';
}

const DEFAULT_FILE: EditorFile = {
  id: crypto.randomUUID(),
  name: 'untitled.ts',
  language: 'typescript',
  content: '// Welcome to HackerAI Code Editor\n// Start typing your code here...\n\n',
  savedContent: '// Welcome to HackerAI Code Editor\n// Start typing your code here...\n\n',
};

export function useEditorFiles() {
  const [files, setFiles] = useState<EditorFile[]>([DEFAULT_FILE]);
  const [activeFileId, setActiveFileId] = useState(DEFAULT_FILE.id);

  const activeFile = files.find((f) => f.id === activeFileId) ?? files[0];

  const createFile = useCallback((name: string, content = '') => {
    const file: EditorFile = {
      id: crypto.randomUUID(),
      name,
      language: detectLanguage(name),
      content,
      savedContent: content,
    };
    setFiles((prev) => [...prev, file]);
    setActiveFileId(file.id);
    return file;
  }, []);

  const updateContent = useCallback((id: string, content: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, content } : f))
    );
  }, []);

  const saveFile = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, savedContent: f.content } : f))
    );
  }, []);

  const renameFile = useCallback((id: string, name: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, name, language: detectLanguage(name) } : f
      )
    );
  }, []);

  const deleteFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const next = prev.filter((f) => f.id !== id);
        if (activeFileId === id && next.length > 0) {
          setActiveFileId(next[0].id);
        }
        return next.length === 0 ? [DEFAULT_FILE] : next;
      });
    },
    [activeFileId]
  );

  const updateCursor = useCallback(
    (id: string, line: number, column: number, scrollTop?: number) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, cursorLine: line, cursorColumn: column, scrollTop }
            : f
        )
      );
    },
    []
  );

  const insertCode = useCallback(
    (code: string) => {
      if (!activeFile) return;
      updateContent(activeFile.id, activeFile.content + '\n' + code);
    },
    [activeFile, updateContent]
  );

  return {
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
  };
}
