import { type NextRequest, NextResponse } from 'next/server';
import { getStorage, buildStorageKey } from '@/lib/storage';
import { getSession } from '@/lib/session';
import { isAcceptedMime, getMaxSize } from '@/lib/upload/config';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const RequestSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
  size: z.number().positive(),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = RequestSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!isAcceptedMime(body.contentType)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
  }

  const maxSize = getMaxSize(body.contentType);
  if (body.size > maxSize) {
    return NextResponse.json(
      { error: `File too large. Max size is ${maxSize / 1024 / 1024} MB.` },
      { status: 400 }
    );
  }

  try {
    const storage = getStorage();
    const key = buildStorageKey(session.user.id, body.filename);
    const uploadUrl = await storage.getSignedUploadUrl(key, 900); // 15 min

    return NextResponse.json({ uploadUrl, key });
  } catch (err) {
    // Storage not configured — return a graceful error
    if ((err as Error).message.includes('Missing AWS')) {
      return NextResponse.json(
        { error: 'Storage not configured' },
        { status: 503 }
      );
    }
    console.error('Storage sign-upload error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
