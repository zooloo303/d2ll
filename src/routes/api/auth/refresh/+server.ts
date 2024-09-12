import type { RequestHandler } from '@sveltejs/kit';
import { BUNGIE_API_KEY, BUNGIE_CLIENT_ID, BUNGIE_CLIENT_SECRET } from '$env/static/private';
import { BUNGIE_TOKEN_URL } from '$lib/utils/constants';

export const POST: RequestHandler = async ({ cookies }) => {
  const refreshToken = cookies.get('refresh_token');

  if (!refreshToken) {
    return new Response(JSON.stringify({ error: 'No refresh token found' }), { status: 401 });
  }

  try {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: BUNGIE_CLIENT_ID,
      client_secret: BUNGIE_CLIENT_SECRET
    });

    const response = await fetch(BUNGIE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Key': BUNGIE_API_KEY
      },
      body: body
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to refresh token' }), { status: response.status });
    }

    const newTokens = await response.json();

    cookies.set('access_token', newTokens.access_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: newTokens.expires_in
    });

    cookies.set('refresh_token', newTokens.refresh_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
