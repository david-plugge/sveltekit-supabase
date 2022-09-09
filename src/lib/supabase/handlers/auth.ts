import type { CookieSerializeOptions } from 'cookie';
import { sequence } from '@sveltejs/kit/hooks';
// import callback from './callback';
import session from './session';
import type { SupabaseClient } from '@supabase/supabase-js';

interface Options {
	supabaseClient: SupabaseClient;
	tokenRefreshMargin?: number;
	cookieOptions?: CookieSerializeOptions;
}

export default function auth(options: Options) {
	return sequence(
		// callback(options),
		session(options)
	);
}
