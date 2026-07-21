/** WorkOS configuration constants */
export const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID ?? '';
export const WORKOS_REDIRECT_URI =
  process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI ??
  'http://localhost:3000/auth/callback';

/** Build the WorkOS authorization URL */
export function buildAuthorizationUrl(options?: {
  screenHint?: 'sign-up' | 'sign-in';
  state?: string;
}): string {
  const params = new URLSearchParams({
    client_id: WORKOS_CLIENT_ID,
    redirect_uri: WORKOS_REDIRECT_URI,
    response_type: 'code',
  });

  if (options?.screenHint) {
    params.set('screen_hint', options.screenHint);
  }
  if (options?.state) {
    params.set('state', options.state);
  }

  return `https://api.workos.com/user_management/authorize?${params}`;
}
