import type { RequestHandler } from '@sveltejs/kit';
import { BUNGIE_API_KEY } from '$env/static/private';
import { refreshAccessToken } from '$lib/services/auth';

export const GET: RequestHandler = async ({ cookies }) => {
  const accessToken = cookies.get('access_token');
  const refreshToken = cookies.get('refresh_token');

  if (!accessToken || !refreshToken) {
    return new Response(null, { status: 401 });
  }

  try {
    const response = await fetch('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/', {
      headers: {
        'X-API-Key': BUNGIE_API_KEY,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      return new Response(null, { status: 200 });
    } else if (response.status === 401) {
      // Token is expired, attempt to refresh
      const newTokens = await refreshAccessToken(refreshToken);
      if (newTokens) {
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
        return new Response(null, { status: 200 });
      }
    }
    return new Response(null, { status: 401 });
  } catch (error) {
    console.error('Error validating token:', error);
    return new Response(null, { status: 500 });
  }
};