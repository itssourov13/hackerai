export type AIProvider = 'openai' | 'openrouter';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  contextWindow: number;
  description: string;
  tier: 'free' | 'pro';
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    contextWindow: 128000,
    description: 'Most capable OpenAI model',
    tier: 'pro',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    contextWindow: 128000,
    description: 'Fast and affordable',
    tier: 'free',
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    contextWindow: 16384,
    description: 'Fast and efficient',
    tier: 'free',
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'openrouter',
    contextWindow: 200000,
    description: 'Anthropic\'s best model',
    tier: 'pro',
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    provider: 'openrouter',
    contextWindow: 131072,
    description: 'Meta\'s open-source model',
    tier: 'free',
  },
  {
    id: 'mistralai/mistral-7b-instruct',
    name: 'Mistral 7B',
    provider: 'openrouter',
    contextWindow: 32768,
    description: 'Efficient instruction model',
    tier: 'free',
  },
];

export const DEFAULT_MODEL = 'gpt-4o-mini';
export const DEFAULT_SYSTEM_PROMPT =
  'You are HackerAI, an expert AI assistant specialized in software development, coding, and system design. ' +
  'You provide accurate, production-ready code and technical guidance. ' +
  'Format code with proper syntax highlighting using markdown code blocks.';
