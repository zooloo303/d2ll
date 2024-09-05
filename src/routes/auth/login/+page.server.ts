import { redirect } from '@sveltejs/kit';
import { getAuthUrl } from '$lib/services/auth';

export function load() {
  const state = crypto.randomUUID();
  const authUrl = getAuthUrl(state);
  throw redirect(307, authUrl);
}