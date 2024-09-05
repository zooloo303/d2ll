import type { RequestHandler } from '@sveltejs/kit';
import { BUNGIE_API_KEY } from '$env/static/private';

export const GET: RequestHandler = async ({ cookies }) => {
  const accessToken = cookies.get('access_token');

  if (!accessToken) {
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
    } else {
      return new Response(null, { status: 401 });
    }
  } catch (error) {
    console.error('Error validating token:', error);
    return new Response(null, { status: 500 });
  }
};