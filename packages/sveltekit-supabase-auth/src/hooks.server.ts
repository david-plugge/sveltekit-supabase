import { dev } from '$app/environment';
import { supabaseClient } from '$lib/db';
import { auth } from 'sveltekit-supabase-auth/server';

export const handle = auth({
	supabaseClient,
	cookieOptions: {
		secure: !dev
	}
});
