import { type NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  await deleteSession();

  const apiKey = process.env.WORKOS_API_KEY;
  const clientId = process.env.WORKOS_CLIENT_ID;

  if (apiKey && clientId) {
    const logoutUrl = `https://api.workos.com/user_management/sessions/logout?client_id=${clientId}`;
    const response = NextResponse.redirect(logoutUrl);
    response.cookies.delete('hackerai_session');
    return response;
  }

  return NextResponse.redirect(new URL('/', request.url));
}
