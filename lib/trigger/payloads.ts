import { z } from 'zod';

/** Payload schemas for all background jobs */

export const ProcessFilePayloadSchema = z.object({
  fileId: z.string(),
  userId: z.string(),
  storageKey: z.string(),
  mimeType: z.string(),
  filename: z.string(),
});

export const CleanupStoragePayloadSchema = z.object({
  userId: z.string().optional(),
  olderThanDays: z.number().default(30),
});

export const AggregateUsagePayloadSchema = z.object({
  userId: z.string().optional(),
  period: z.string(), // YYYY-MM
});

export const SendNotificationPayloadSchema = z.object({
  userId: z.string(),
  type: z.enum(['job_complete', 'job_failed', 'storage_warning', 'payment_failed']),
  data: z.record(z.unknown()).optional(),
});

export const ExportReportPayloadSchema = z.object({
  userId: z.string(),
  reportType: z.enum(['usage', 'billing', 'activity']),
  period: z.string(),
});

export type ProcessFilePayload = z.infer<typeof ProcessFilePayloadSchema>;
export type CleanupStoragePayload = z.infer<typeof CleanupStoragePayloadSchema>;
export type AggregateUsagePayload = z.infer<typeof AggregateUsagePayloadSchema>;
export type SendNotificationPayload = z.infer<typeof SendNotificationPayloadSchema>;
export type ExportReportPayload = z.infer<typeof ExportReportPayloadSchema>;
