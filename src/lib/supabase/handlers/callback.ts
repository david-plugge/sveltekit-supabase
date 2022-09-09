import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { Handle } from '@sveltejs/kit';
import type { CookieSerializeOptions } from 'cookie';

interface PostBody {
	event: AuthChangeEvent;
	session: Session | null;
}

interface Options {
	cookieOptions?: CookieSerializeOptions;
}

export default function callback({ cookieOptions }: Options = {}): Handle {
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
			if (session.access_token) {
				cookies.set('sb-access-token', session.access_token, cookieOptions);
			}
			if (session.refresh_token) {
				cookies.set('sb-refresh-token', session.refresh_token, cookieOptions);
			}
			if (session.provider_token) {
				cookies.set('sb-provider-token', session.provider_token, cookieOptions);
			}
		} else if (sessionEvent === 'SIGNED_OUT') {
			['sb-access-token', 'sb-refresh-token', 'sb-provider-token'].forEach((name) => {
				cookies.delete(name);
			});
		}

		return new Response(null, { status: 200 });
	};
}
