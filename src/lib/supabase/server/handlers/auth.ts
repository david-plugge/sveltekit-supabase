import { sequence } from '@sveltejs/kit/hooks';
// import callback from './callback';
import session from './session';
import type { SupabaseClient } from '@supabase/supabase-js';
import { setServerConfig } from '../config';
import { COOKIE_OPTIONS, TOKEN_REFRESH_MARGIN } from '../../constants';
import type { CookieOptions } from '../types';

interface Options {
	supabaseClient: SupabaseClient;
	tokenRefreshMargin?: number;
	cookieName?: string;
	cookieOptions?: CookieOptions;
}

export default function auth({
	supabaseClient,
	cookieName = 'sb',
	cookieOptions = {},
	tokenRefreshMargin = TOKEN_REFRESH_MARGIN
}: Options) {
	setServerConfig({
		supabaseClient,
		cookieName,
		cookieOptions: { ...COOKIE_OPTIONS, ...cookieOptions },
		tokenRefreshMargin
	});

	return sequence(
		// callback(),
		session()
	);
}
