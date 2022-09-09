import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';
import type { CookieSerializeOptions } from 'cookie';

interface PostBody {
	event: AuthChangeEvent;
	session: Session | null;
}

const cookieOptions: CookieSerializeOptions = {
	maxAge: 365 * 24 * 60 * 60,
	path: '/',
	sameSite: 'strict',
	httpOnly: true,
	secure: false
};

export const POST: RequestHandler = async ({ cookies, request }) => {
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

	return new Response(null, { status: 204 });
};
