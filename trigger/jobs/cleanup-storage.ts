import { task, schedules } from '@trigger.dev/sdk';
import { CleanupStoragePayloadSchema, type CleanupStoragePayload } from '@/lib/trigger/payloads';

export const cleanupStorageTask = task({
  id: 'cleanup-storage',
  retry: { maxAttempts: 2 },
  run: async (payload: CleanupStoragePayload) => {
    const data = CleanupStoragePayloadSchema.parse(payload);
    console.log('Starting storage cleanup', { olderThanDays: data.olderThanDays });
    // TODO: find and delete orphaned files, clear expired Redis keys
    return { success: true };
  },
});

export const weeklyStorageCleanup = schedules.task({
  id: 'weekly-storage-cleanup',
  cron: '0 2 * * 0',
  run: async () => {
    await cleanupStorageTask.trigger({ olderThanDays: 30 });
    return { triggered: true };
  },
});
