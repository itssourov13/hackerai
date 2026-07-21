export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
  service?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  critical: 4,
};

const VALID_LEVELS = new Set<LogLevel>(['debug', 'info', 'warn', 'error', 'critical']);
const MIN_LEVEL: LogLevel = VALID_LEVELS.has(process.env.LOG_LEVEL as LogLevel)
  ? (process.env.LOG_LEVEL as LogLevel)
  : (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

/** Mask sensitive fields before logging */
function sanitize(data: Record<string, unknown>): Record<string, unknown> {
  const SENSITIVE = new Set(['password', 'token', 'apiKey', 'secret', 'credit_card', 'ssn', 'authorization']);
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (SENSITIVE.has(k.toLowerCase())) {
      result[k] = '[REDACTED]';
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      result[k] = sanitize(v as Record<string, unknown>);
    } else {
      result[k] = v;
    }
  }
  return result;
}

function formatEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    context: context ? sanitize(context) : undefined,
    timestamp: new Date().toISOString(),
    service: 'hackerai',
  };
}

function emit(entry: LogEntry): void {
  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
  const line = entry.context
    ? `${prefix} ${entry.message} ${JSON.stringify(entry.context)}`
    : `${prefix} ${entry.message}`;

  if (entry.level === 'error' || entry.level === 'critical') {
    console.error(line);
  } else if (entry.level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => {
    if (shouldLog('debug')) emit(formatEntry('debug', message, context));
  },
  info: (message: string, context?: Record<string, unknown>) => {
    if (shouldLog('info')) emit(formatEntry('info', message, context));
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    if (shouldLog('warn')) emit(formatEntry('warn', message, context));
  },
  error: (message: string, context?: Record<string, unknown>) => {
    if (shouldLog('error')) emit(formatEntry('error', message, context));
  },
  critical: (message: string, context?: Record<string, unknown>) => {
    if (shouldLog('critical')) emit(formatEntry('critical', message, context));
  },
};
