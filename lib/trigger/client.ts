// Trigger.dev v3 client configuration
// Set TRIGGER_API_KEY environment variable to enable background jobs.

import { configure } from '@trigger.dev/sdk';

const apiKey = process.env.TRIGGER_API_KEY;

if (apiKey) {
  configure({ secretKey: apiKey });
}

export const isTriggerConfigured = !!apiKey;
