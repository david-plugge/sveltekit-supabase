import { deleteSession } from '$lib/supabase/server';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	async default({ cookies }) {
		deleteSession(cookies);
		throw redirect(303, '/');
	}
};
