import { browser } from '$app/environment';
import { applyAction, enhance } from '$app/forms';
import { invalidateAll } from '$app/navigation';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import { getClientConfig } from './config';

export function enhanceAndInvalidate(form: HTMLFormElement) {
	return enhance(form, () => async ({ result }) => {
		await applyAction(result);
		if (result.type === 'redirect' || result.type === 'success') {
			await invalidateAll();
		}
	});
}

export function supabaseServerClient(access_token: string | null | undefined): SupabaseClient {
	const { supabaseClient } = getClientConfig();
	// no need to set the token on the browser
	if (!browser && access_token) {
		supabaseClient?.auth.setAuth(access_token);
	}
	return supabaseClient;
}

export function ensureAuth(
	user: User | null,
	{ status = 303, location = '/' }: { status?: number; location?: string } = {}
) {
	if (!user) {
		throw redirect(status, location);
	}
}
