import { type NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/storage';
import { getSession } from '@/lib/session';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const RequestSchema = z.object({
  key: z.string().min(1),
  expiresIn: z.number().optional(),
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
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Ensure users can only access their own files (path-prefix check prevents traversal)
  const expectedPrefix = `uploads/${session.user.id}/`;
  if (!body.key.startsWith(expectedPrefix)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const storage = getStorage();
    const downloadUrl = await storage.getSignedDownloadUrl(
      body.key,
      body.expiresIn ?? 3600
    );

    return NextResponse.json({ downloadUrl });
  } catch (err) {
    if ((err as Error).message.includes('Missing AWS')) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });
    }
    console.error('Storage sign-download error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
