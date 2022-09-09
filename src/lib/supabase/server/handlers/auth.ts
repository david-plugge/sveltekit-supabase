import { sequence } from '@sveltejs/kit/hooks';
// import callback from './callback';
import session from './session';
import type { SupabaseClient } from '@supabase/supabase-js';
import { setSingleton } from '../../singleton';
import { COOKIE_OPTIONS } from '../../constants';
import type { CookieOptions } from '../../types';

interface Options {
	supabaseClient: SupabaseClient;
	tokenRefreshMargin?: number;
	cookieOptions?: CookieOptions;
}

export default function auth(options: Options) {
	setSingleton('client', options.supabaseClient);
	setSingleton('cookieOptions', { ...COOKIE_OPTIONS, ...options.cookieOptions });

	return sequence(
		// callback(options),
		session(options)
	);
}
