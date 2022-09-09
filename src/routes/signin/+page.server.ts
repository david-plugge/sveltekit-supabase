import { supabaseClient } from '$lib/db';
import { invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { saveSession } from '$lib/supabase/server';

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

		saveSession(cookies, data);
		throw redirect(303, '/');
	},

	async signup({ request, url }) {
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

		const { data, error } = await supabaseClient.auth.api.signUpWithEmail(email, password, {
			redirectTo: url.origin
		});

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

		return { success: true };
	}
};
