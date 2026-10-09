import { task } from '@trigger.dev/sdk';
import { ProcessFilePayloadSchema, type ProcessFilePayload } from '@/lib/trigger/payloads';

/**
 * Background task: Process an uploaded file (extract text, update DB status).
 */
export const processFileTask = task({
  id: 'process-file',
  retry: { maxAttempts: 3 },
  run: async (payload: ProcessFilePayload) => {
    const data = ProcessFilePayloadSchema.parse(payload);
    console.log('Processing file', data.fileId, data.mimeType);
    // Step 1: Download from storage
    // Step 2: Extract text
    // Step 3: Update database record
    return { success: true, fileId: data.fileId };
  },
});
