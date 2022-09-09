import { ensureAuth, supabaseServerClient } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { session } = await parent();
	ensureAuth(session.user);

	// authenticate the client
	// works on the server and the client
	const { data: posts, error: postsError } = await supabaseServerClient(session.accessToken)
		.from('posts')
		.select();

	if (postsError) {
		throw error(500, postsError);
	}

	return { posts: posts ?? [] };
};
