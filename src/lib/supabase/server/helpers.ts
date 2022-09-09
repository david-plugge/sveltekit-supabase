import type { RequestEvent } from '.svelte-kit/types/src/routes/signin/$types';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { Cookies } from '@sveltejs/kit';
import { getSingleton } from '../singleton';
import type { CookieOptions } from '../types';

export function saveSession(cookies: Cookies, session: Session) {
	const cookie_options = getSingleton('cookieOptions') as CookieOptions;

	if (session.access_token) {
		cookies.set('sb-access-token', session.access_token, cookie_options);
	}
	if (session.refresh_token) {
		cookies.set('sb-refresh-token', session.refresh_token, cookie_options);
	}
	if (session.provider_token) {
		cookies.set('sb-provider-token', session.provider_token, cookie_options);
	}
}

export function deleteSession(cookies: Cookies) {
	const cookie_options = getSingleton('cookieOptions') as CookieOptions;

	['sb-access-token', 'sb-refresh-token', 'sb-provider-token'].forEach((name) => {
		cookies.set(name, '', {
			...cookie_options,
			maxAge: -1
		});
	});
}

interface PostBody {
	event: AuthChangeEvent;
	session: Session | null;
}

export async function handleCallbackSession({ cookies, request }: RequestEvent) {
	const { event: sessionEvent, session }: PostBody = await request.json();

	if (sessionEvent === 'SIGNED_IN' && session) {
		saveSession(cookies, session);
	} else if (sessionEvent === 'SIGNED_OUT') {
		deleteSession(cookies);
	}

	return new Response(null, { status: 204 });
}
