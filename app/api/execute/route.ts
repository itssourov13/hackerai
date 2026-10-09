import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const E2B_API_KEY = process.env.E2B_API_KEY;

type Language = 'javascript' | 'typescript' | 'python' | 'bash';

interface ExecuteRequest {
  code: string;
  language: Language;
}

interface ExecuteResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  error?: string;
}

async function executeCode(
  code: string,
  language: Language
): Promise<ExecuteResult> {
  if (!E2B_API_KEY) {
    // Graceful degradation — return clear error when not configured
    return {
      stdout: '',
      stderr: 'E2B_API_KEY is not configured. Sandboxed execution is unavailable.',
      exitCode: 1,
      error: 'E2B not configured',
    };
  }

  try {
    // Lazy import to avoid issues if package isn't fully installed
    const { Sandbox } = await import('@e2b/code-interpreter');
    const sandbox = await Sandbox.create({ apiKey: E2B_API_KEY, timeoutMs: 30000 });

    try {
      let result;

      if (language === 'python') {
        result = await sandbox.runCode(code);
      } else if (language === 'bash') {
        result = await sandbox.runCode(`import subprocess\nresult = subprocess.run(${JSON.stringify(code)}, shell=True, capture_output=True, text=True)\nprint(result.stdout)\nif result.returncode != 0:\n    import sys\n    print(result.stderr, file=sys.stderr)`);
      } else {
        // JS/TS — run via node
        result = await sandbox.runCode(code);
      }

      return {
        stdout: result.logs.stdout.join(''),
        stderr: result.logs.stderr.join(''),
        exitCode: result.error ? 1 : 0,
        error: result.error?.value,
      };
    } finally {
      await sandbox.kill();
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Execution failed';
    return { stdout: '', stderr: msg, exitCode: 1, error: msg };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ExecuteRequest;
    const { code, language } = body;

    if (!code?.trim()) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const validLanguages: Language[] = ['javascript', 'typescript', 'python', 'bash'];
    if (!validLanguages.includes(language)) {
      return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }

    const result = await executeCode(code, language);

    return NextResponse.json(result);
  } catch (err) {
    console.error('Execute API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
