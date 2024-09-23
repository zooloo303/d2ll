import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleCors: Handle = async ({ event, resolve }) => {

    console.log(`Handling ${event.request.method} request to ${event.url.pathname}`);
    
    const response = await resolve(event);
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (event.request.method === 'OPTIONS') {
        return new Response(null, {
            headers: response.headers
        });
    }
    
    return response;
};

// You can add more middleware functions here if needed
// const handleSomethingElse: Handle = async ({ event, resolve }) => {
//     // Your logic here
//     return await resolve(event);
// };

export const handle: Handle = sequence(handleCors/*, handleSomethingElse */);