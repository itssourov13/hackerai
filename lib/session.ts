import { cookies } from 'next/headers';

const SESSION_COOKIE = 'hackerai_session';

export interface SessionUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
}

export interface Session {
  user: SessionUser;
  accessToken: string;
  rawSession: string;
}

/** Store session cookie (server-side) */
export async function createSession(sessionData: string): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/** Remove session cookie */
export async function deleteSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Read raw session cookie value */
export function getSessionCookie(): string | null {
  try {
    const cookieStore = cookies();
    return cookieStore.get(SESSION_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

/** Get the current session from the cookie */
export async function getSession(): Promise<Session | null> {
  const rawSession = getSessionCookie();
  if (!rawSession) return null;

  try {
    const parsed = JSON.parse(rawSession) as {
      accessToken: string;
      user: SessionUser;
    };

    if (!parsed.accessToken || !parsed.user) return null;

    return {
      user: parsed.user,
      accessToken: parsed.accessToken,
      rawSession,
    };
  } catch {
    return null;
  }
}

/** Get user or null — safe to call from any server component */
export async function getUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}
