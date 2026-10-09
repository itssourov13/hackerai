import { logger } from './logger';

export interface AppError {
  message: string;
  code?: string;
  service?: string;
  userId?: string;
  requestId?: string;
  stack?: string;
}

/** Capture and log an error with context */
export function captureError(error: Error | unknown, context?: Partial<AppError>): void {
  const err = error instanceof Error ? error : new Error(String(error));

  const entry: AppError = {
    message: err.message,
    stack: err.stack,
    ...context,
  };

  // Mask any accidentally included sensitive fields
  const safe = {
    message: entry.message,
    code: entry.code,
    service: entry.service,
    userId: entry.userId,
    requestId: entry.requestId,
  };

  logger.error('Application error', safe);

  // In production, forward to external error tracking (e.g., Sentry)
  // if (process.env.SENTRY_DSN) Sentry.captureException(err);
}

/** Track API response time */
export function trackLatency(label: string, durationMs: number, context?: Record<string, unknown>): void {
  logger.info('Performance metric', { label, durationMs, ...context });
}

/** Wrap an async function to automatically capture errors */
export function withErrorCapture<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Partial<AppError>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (err) {
      captureError(err, context);
      throw err;
    }
  }) as T;
}
