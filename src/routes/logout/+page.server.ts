import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	async default({ cookies }) {
		['sb-access-token', 'sb-refresh-token', 'sb-provider-token'].forEach((name) => {
			cookies.delete(name);
		});
		throw redirect(303, '/');
	}
};
