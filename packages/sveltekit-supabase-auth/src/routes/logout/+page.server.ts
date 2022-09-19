import { deleteSession } from 'sveltekit-supabase-auth/server';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	async default({ cookies }) {
		deleteSession(cookies);
		throw redirect(303, '/');
	}
};
