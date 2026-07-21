'use client';

import { useRef, useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { EditorFile } from '@/hooks/useEditorFiles';

interface CodeEditorProps {
  file: EditorFile;
  onChange: (content: string) => void;
  onCursorChange?: (line: number, col: number, scrollTop: number) => void;
  fontSize?: number;
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  minimapEnabled?: boolean;
}

export function CodeEditor({
  file,
  onChange,
  onCursorChange,
  fontSize = 14,
  wordWrap = 'off',
  minimapEnabled = true,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleMount = useCallback(
    (ed: editor.IStandaloneCodeEditor) => {
      editorRef.current = ed;

      // Restore cursor
      if (file.cursorLine && file.cursorColumn) {
        ed.setPosition({ lineNumber: file.cursorLine, column: file.cursorColumn });
      }

      // Track cursor changes
      ed.onDidChangeCursorPosition((e) => {
        const scrollTop = ed.getScrollTop();
        onCursorChange?.(e.position.lineNumber, e.position.column, scrollTop);
      });
    },
    [file.cursorLine, file.cursorColumn, onCursorChange]
  );

  return (
    <MonacoEditor
      height="100%"
      language={file.language}
      value={file.content}
      theme="vs-dark"
      onChange={(value) => onChange(value ?? '')}
      onMount={handleMount}
      options={{
        fontSize,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontLigatures: true,
        lineNumbers: 'on',
        minimap: { enabled: minimapEnabled },
        wordWrap,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        autoIndent: 'advanced',
        bracketPairColorization: { enabled: true },
        matchBrackets: 'always',
        folding: true,
        foldingStrategy: 'auto',
        showFoldingControls: 'mouseover',
        renderLineHighlight: 'all',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        contextmenu: true,
        quickSuggestions: { other: true, comments: false, strings: false },
        parameterHints: { enabled: true },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        find: {
          addExtraSpaceOnTop: false,
        },
        renderValidationDecorations: 'on',
        formatOnPaste: true,
        formatOnType: false,
      }}
    />
  );
}
