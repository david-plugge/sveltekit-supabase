import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { Handle } from '@sveltejs/kit';
import { deleteSession, saveSession } from '../helpers';

interface PostBody {
	event: AuthChangeEvent;
	session: Session | null;
}

export default function callback(): Handle {
	return async ({ resolve, event }) => {
		if (event.url.pathname !== '/api/auth/callback') {
			return resolve(event);
		}

		const { request, cookies } = event;
		if (request.method !== 'POST') {
			const headers = new Headers({
				Allow: 'POST'
			});
			return new Response('Method Not Allowed', { headers, status: 405 });
		}

		const { event: sessionEvent, session }: PostBody = await request.json();

		if (sessionEvent === 'SIGNED_IN' && session) {
			saveSession(cookies, session);
		} else if (sessionEvent === 'SIGNED_OUT') {
			deleteSession(cookies);
		}

		return new Response(null, { status: 200 });
	};
}
