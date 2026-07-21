import { task, schedules } from '@trigger.dev/sdk';
import { AggregateUsagePayloadSchema, type AggregateUsagePayload } from '@/lib/trigger/payloads';

export const aggregateUsageTask = task({
  id: 'aggregate-usage',
  retry: { maxAttempts: 2 },
  run: async (payload: AggregateUsagePayload) => {
    const data = AggregateUsagePayloadSchema.parse(payload);
    console.log('Aggregating usage for period', data.period);
    // TODO: read Redis usage counters and sync to Convex
    return { success: true, period: data.period };
  },
});

export const dailyUsageAggregation = schedules.task({
  id: 'daily-usage-aggregation',
  cron: '0 0 * * *',
  run: async () => {
    const period = new Date().toISOString().slice(0, 7);
    await aggregateUsageTask.trigger({ period });
    return { triggered: true };
  },
});
