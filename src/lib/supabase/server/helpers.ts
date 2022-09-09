import type { Session } from '@supabase/supabase-js';
import type { Cookies } from '@sveltejs/kit';
import type { CookieOptions } from '../types';
import { getSingleton } from '../singleton';

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
