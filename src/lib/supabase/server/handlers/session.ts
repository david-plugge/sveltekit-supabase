import type { Handle } from '@sveltejs/kit';
import { decodeJwt } from 'jose';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { COOKIE_OPTIONS, TOKEN_REFRESH_MARGIN } from '../../constants';
import type { CookieOptions } from '../../types';

interface Options {
	supabaseClient: SupabaseClient;
	tokenRefreshMargin?: number;
	cookieOptions?: CookieOptions;
}

export default function session({
	supabaseClient,
	cookieOptions,
	tokenRefreshMargin = TOKEN_REFRESH_MARGIN
}: Options): Handle {
	const cookie_options = { ...COOKIE_OPTIONS, ...cookieOptions };

	return async ({ resolve, event }) => {
		const { cookies, locals } = event;
		try {
			const accessToken = cookies.get('sb-access-token');

			if (!accessToken) {
				throw 'AccessTokenNotFound';
			}

			const jwt = decodeJwt(accessToken);

			if (!jwt.exp) {
				throw 'JWTPayloadFailed';
			}

			const timeNow = Math.round(Date.now() / 1000);

			if (jwt.exp < timeNow + tokenRefreshMargin) {
				const refreshToken = cookies.get('sb-refresh-token');
				if (!refreshToken) {
					throw 'RefreshTokenNotFound';
				}
				const { data, error } = await supabaseClient.auth.api.refreshAccessToken(refreshToken);
				if (error || !data) {
					throw error;
				}
				cookies.set('sb-access-token', data.access_token, cookie_options);
				if (data.refresh_token) {
					cookies.set('sb-refresh-token', data.refresh_token, cookie_options);
				}
				locals.user = { ...data.user, exp: data.expires_at } as User;
				locals.accessToken = accessToken;
			} else {
				const { data } = await supabaseClient.auth.api.getUser(accessToken);
				locals.user = { ...data, exp: jwt.exp } as User;
				locals.accessToken = accessToken;
			}
		} catch (err) {
			locals.accessToken = null;
			locals.user = null;
		}

		return resolve(event);
	};
}
