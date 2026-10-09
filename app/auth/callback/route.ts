import { type NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL('/sign-in?error=missing_code', request.url));
  }

  try {
    const apiKey = process.env.WORKOS_API_KEY;
    const clientId = process.env.WORKOS_CLIENT_ID;
    const redirectUri =
      process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI ||
      'http://localhost:3000/auth/callback';

    if (!apiKey || !clientId) {
      return NextResponse.redirect(
        new URL('/sign-in?error=misconfigured', request.url)
      );
    }

    const tokenResponse = await fetch(
      'https://api.workos.com/user_management/authenticate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: apiKey,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const text = await tokenResponse.text();
      console.error('WorkOS token exchange failed:', text);
      return NextResponse.redirect(
        new URL('/sign-in?error=auth_failed', request.url)
      );
    }

    const data = (await tokenResponse.json()) as {
      access_token: string;
      user: {
        id: string;
        email: string;
        first_name?: string;
        last_name?: string;
        profile_picture_url?: string;
      };
    };

    const sessionPayload = JSON.stringify({
      accessToken: data.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        profilePictureUrl: data.user.profile_picture_url,
      },
    });

    await createSession(sessionPayload);

    const redirectTo = state ? decodeURIComponent(state) : '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (err) {
    console.error('Auth callback error:', err);
    return NextResponse.redirect(
      new URL('/sign-in?error=server_error', request.url)
    );
  }
}
