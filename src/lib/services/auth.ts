import { BUNGIE_CLIENT_ID, BUNGIE_API_KEY, BUNGIE_CLIENT_SECRET } from '$env/static/private';
import { BUNGIE_API_ROOT, BUNGIE_BASE_URL } from '$lib/utils/constants';

const BUNGIE_AUTH_URL = `${BUNGIE_BASE_URL}/en/OAuth/Authorize`;
const BUNGIE_TOKEN_URL = 'https://www.bungie.net/platform/app/oauth/token/';

export function getAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: BUNGIE_CLIENT_ID,
    response_type: 'code',
    state: state
  });
  return `${BUNGIE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    client_id: BUNGIE_CLIENT_ID,
    client_secret: BUNGIE_CLIENT_SECRET
  });

  try {
    const response = await fetch(BUNGIE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Key': BUNGIE_API_KEY
      },
      body: body
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', response.status, errorText);
      throw new Error(`Failed to exchange code for tokens: ${response.status} ${errorText}`);
    }

    const tokens = await response.json();
    
    // Fetch user memberships
    const membershipResponse = await fetch(`${BUNGIE_API_ROOT}/User/GetMembershipsForCurrentUser/`, {
      headers: {
        'X-API-Key': BUNGIE_API_KEY,
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    if (!membershipResponse.ok) {
      throw new Error('Failed to fetch user memberships');
    }

    const membershipData = await membershipResponse.json();

    return {
      tokens,
      memberships: membershipData.Response
    };
  } catch (error) {
    console.error('Error during token exchange or membership fetch:', error);
    throw error;
  }
}

export async function refreshAccessToken(refreshToken: string) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: BUNGIE_CLIENT_ID,
    client_secret: BUNGIE_CLIENT_SECRET // Add client_secret here
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
    throw new Error('Failed to refresh access token');
  }

  return await response.json();
}