import { BUNGIE_API_KEY } from '$env/static/private';
import { BUNGIE_API_ROOT } from '$lib/utils/constants';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch, cookies }) => {
    const membershipType = url.searchParams.get('membershipType');
    const destinyMembershipId = url.searchParams.get('destinyMembershipId');
    const accessToken = cookies.get('access_token');

    if (!membershipType || !destinyMembershipId || !accessToken) {
        return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
    }

    const apiUrl = `${BUNGIE_API_ROOT}/Destiny2/${membershipType}/Profile/${destinyMembershipId}/?components=200,206`;

    const response = await fetch(apiUrl, {
        headers: {
            'X-API-Key': BUNGIE_API_KEY,
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch character data from Bungie API' }), { status: response.status });
    }

    const data = await response.json();

    const characters = data.Response.characters.data;
    const loadouts = data.Response.characterLoadouts.data;

    return new Response(JSON.stringify({ characters, loadouts }));
};
