'use client';

import { useEffect, useRef, useCallback } from 'react';

interface TerminalInstance {
  terminal: any;
  fitAddon: any;
}

interface UseTerminalOptions {
  onData?: (data: string) => void;
}

export function useTerminal(
  containerRef: React.RefObject<HTMLDivElement>,
  options: UseTerminalOptions = {}
) {
  const instanceRef = useRef<TerminalInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current || instanceRef.current) return;

    let disposed = false;

    (async () => {
      const [{ Terminal }, { FitAddon }, { WebLinksAddon }] = await Promise.all([
        import('@xterm/xterm'),
        import('xterm-addon-fit'),
        import('xterm-addon-web-links'),
      ]);

      if (disposed || !containerRef.current) return;

      const terminal = new Terminal({
        theme: {
          background: '#0a0a0a',
          foreground: '#e4e4e7',
          cursor: '#ef4444',
          cursorAccent: '#000000',
          black: '#1a1a1a',
          red: '#ef4444',
          green: '#22c55e',
          yellow: '#f59e0b',
          blue: '#3b82f6',
          magenta: '#a855f7',
          cyan: '#06b6d4',
          white: '#e4e4e7',
          brightBlack: '#3f3f46',
          brightRed: '#f87171',
          brightGreen: '#4ade80',
          brightYellow: '#fbbf24',
          brightBlue: '#60a5fa',
          brightMagenta: '#c084fc',
          brightCyan: '#22d3ee',
          brightWhite: '#fafafa',
          selectionBackground: 'rgba(239,68,68,0.25)',
        },
        fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
        fontSize: 13,
        lineHeight: 1.5,
        cursorBlink: true,
        cursorStyle: 'block',
        scrollback: 5000,
        allowTransparency: true,
      });

      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();

      terminal.loadAddon(fitAddon);
      terminal.loadAddon(webLinksAddon);
      terminal.open(containerRef.current);
      fitAddon.fit();

      if (options.onData) {
        terminal.onData(options.onData);
      }

      instanceRef.current = { terminal, fitAddon };

      // Welcome message
      terminal.writeln('\x1b[1;31m╔══════════════════════════════════════╗\x1b[0m');
      terminal.writeln('\x1b[1;31m║  HackerAI Terminal — Sandboxed E2B   ║\x1b[0m');
      terminal.writeln('\x1b[1;31m╚══════════════════════════════════════╝\x1b[0m');
      terminal.writeln('');
      terminal.writeln('\x1b[2mType code or use the Run button to execute files.\x1b[0m');
      terminal.writeln('');
    })();

    const handleResize = () => instanceRef.current?.fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      instanceRef.current?.terminal.dispose();
      instanceRef.current = null;
    };
  }, [containerRef]);

  const write = useCallback((text: string) => {
    instanceRef.current?.terminal.write(text);
  }, []);

  const writeln = useCallback((text: string) => {
    instanceRef.current?.terminal.writeln(text);
  }, []);

  const clear = useCallback(() => {
    instanceRef.current?.terminal.clear();
  }, []);

  const fit = useCallback(() => {
    instanceRef.current?.fitAddon.fit();
  }, []);

  const focus = useCallback(() => {
    instanceRef.current?.terminal.focus();
  }, []);

  return { write, writeln, clear, fit, focus };
}
