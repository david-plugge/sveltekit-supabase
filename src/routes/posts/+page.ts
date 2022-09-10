import { supabaseServerClient, loadWithSession } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = loadWithSession(
	{ status: 303, location: '/' },
	async ({ session }) => {
		// authenticate the client
		// works on the server and the client
		const { data: posts, error: postsError } = await supabaseServerClient(session.accessToken)
			.from('posts')
			.select();

		if (postsError) {
			throw error(500, postsError);
		}

		return { posts: posts ?? [] };
	}
);
