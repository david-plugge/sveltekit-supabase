import { supabaseClient } from '$lib/db';
import { invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { CookieSerializeOptions } from 'cookie';

const cookieOptions: CookieSerializeOptions = {
	maxAge: 365 * 24 * 60 * 60,
	path: '/',
	sameSite: 'strict',
	httpOnly: true,
	secure: false
};

export const actions: Actions = {
	async signin({ request, cookies }) {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email) {
			return invalid(400, {
				email,
				emailMissing: true
			});
		}
		if (!password) {
			return invalid(400, {
				email,
				passwordMissing: true
			});
		}

		const { data, error } = await supabaseClient.auth.api.signInWithEmail(email, password);

		if (error || !data) {
			if (error?.status === 400) {
				return invalid(400, {
					invalidCredentials: true
				});
			}
			return invalid(500, {
				serverError: true
			});
		}

		if (data.access_token) {
			cookies.set('sb-access-token', data.access_token, cookieOptions);
		}
		if (data.refresh_token) {
			cookies.set('sb-refresh-token', data.refresh_token, cookieOptions);
		}

		throw redirect(303, '/');
	}
};
