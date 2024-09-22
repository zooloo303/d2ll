import type { RequestHandler } from '@sveltejs/kit';
import { BUNGIE_API_KEY } from '$env/static/private';
import { BUNGIE_API_ROOT } from '$lib/utils/constants';

export const GET: RequestHandler = async ({ cookies, fetch }) => {
  const accessToken = cookies.get('access_token');

  if (!accessToken) {
    return new Response(null, { status: 401 });
  }

  try {
    const response = await fetch(`${BUNGIE_API_ROOT}/User/GetMembershipsForCurrentUser/`, {
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