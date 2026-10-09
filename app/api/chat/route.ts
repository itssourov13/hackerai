import { type NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkRateLimit, rateLimitHeaders } from '@/lib/redis/rate-limit';

export const runtime = 'edge';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

type Provider = 'openai' | 'openrouter';

function getClient(provider: Provider): OpenAI {
  if (provider === 'openrouter') {
    return new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: OPENROUTER_API_KEY ?? '',
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
        'X-Title': 'HackerAI',
      },
    });
  }
  return new OpenAI({ apiKey: OPENAI_API_KEY ?? '' });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
      model?: string;
      provider?: Provider;
      systemPrompt?: string;
      userId?: string;
    };

    const { messages, model = 'gpt-4o-mini', provider = 'openai', systemPrompt, userId } = body;

    if (!messages?.length) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 });
    }

    // Rate limiting
    const identifier = userId ?? (request.headers.get('x-forwarded-for') ?? 'anonymous');
    const rl = await checkRateLimit(identifier, 'chat').catch(() => ({
      success: true, remaining: 1, reset: 0, limit: 60,
    }));

    if (!rl.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before sending another message.' },
        { status: 429, headers: rateLimitHeaders(rl) }
      );
    }

    const client = getClient(provider);
    const systemMessage = systemPrompt
      ? [{ role: 'system' as const, content: systemPrompt }]
      : [];

    const stream = await client.chat.completions.create({
      model,
      messages: [...systemMessage, ...messages],
      stream: true,
      max_tokens: 4096,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? '';
            if (delta) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`)
              );
            }
            if (chunk.choices[0]?.finish_reason === 'stop') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            }
          }
        } catch {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        ...rateLimitHeaders(rl),
      },
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
