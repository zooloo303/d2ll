import type { PageServerLoad } from './$types';
import type { RequestHandler } from '@sveltejs/kit';
import { BUNGIE_API_KEY } from '$env/static/private';
import { exchangeCodeForTokens } from '$lib/services/auth';

export const load: PageServerLoad = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    throw new Error('Missing code or state');
  }

  try {
    const { tokens, memberships } = await exchangeCodeForTokens(code);

    // Set HTTP-only cookies for tokens
    cookies.set('access_token', tokens.access_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: tokens.expires_in
    });

    cookies.set('refresh_token', tokens.refresh_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    // Return user data
    return {
      status: 200,
      body: {
        bungieNetUser: memberships.bungieNetUser,
        destinyMemberships: memberships.destinyMemberships
      }
    };
  } catch (err) {
    console.error('Error during authentication:', err);
    throw new Error('Authentication failed');
  }
};