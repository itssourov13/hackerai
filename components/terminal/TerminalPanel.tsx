'use client';

import { useRef, useState, useCallback } from 'react';
import { useTerminal } from '@/hooks/useTerminal';
import { Trash2, Copy, Download, Square, Play } from 'lucide-react';

interface ExecuteResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  error?: string;
}

interface TerminalPanelProps {
  onRunCode?: (code: string, language: string) => Promise<ExecuteResult>;
  className?: string;
}

export function TerminalPanel({ onRunCode, className }: TerminalPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const { write, writeln, clear, focus } = useTerminal(containerRef);

  const handleClear = useCallback(() => {
    clear();
    focus();
  }, [clear, focus]);

  const handleCopy = useCallback(async () => {
    const text = containerRef.current?.textContent ?? '';
    await navigator.clipboard.writeText(text);
  }, []);

  const handleDownload = useCallback(() => {
    const text = containerRef.current?.textContent ?? '';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setIsRunning(false);
    writeln('\r\n\x1b[33m[Stopped]\x1b[0m');
  }, [writeln]);

  const executeCode = useCallback(
    async (code: string, language: string) => {
      if (isRunning) return;
      setIsRunning(true);
      abortRef.current = new AbortController();

      writeln(`\r\n\x1b[32m$ Running ${language} code...\x1b[0m`);

      try {
        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: abortRef.current.signal,
          body: JSON.stringify({ code, language }),
        });

        const result = (await response.json()) as ExecuteResult;

        if (result.stdout) {
          write(result.stdout.replace(/\n/g, '\r\n'));
        }
        if (result.stderr) {
          write('\x1b[31m' + result.stderr.replace(/\n/g, '\r\n') + '\x1b[0m');
        }

        const exitColor = result.exitCode === 0 ? '\x1b[32m' : '\x1b[31m';
        writeln(`\r\n${exitColor}[Exit ${result.exitCode}]\x1b[0m`);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          writeln('\r\n\x1b[31m[Error: Failed to execute code]\x1b[0m');
        }
      } finally {
        setIsRunning(false);
        abortRef.current = null;
      }
    },
    [isRunning, write, writeln]
  );

  return (
    <div className={`flex flex-col bg-[#0a0a0a] ${className ?? ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-zinc-500">terminal</span>
          {isRunning && (
            <span className="flex items-center gap-1 text-[10px] text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Running
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isRunning ? (
            <button
              onClick={handleStop}
              className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors"
              title="Stop execution"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          ) : null}
          <button
            onClick={handleClear}
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
            title="Clear terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
            title="Copy output"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
            title="Download log"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal viewport */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 p-2"
        onClick={() => focus()}
      />
    </div>
  );
}
