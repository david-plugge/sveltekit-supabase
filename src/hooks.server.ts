import { dev } from '$app/environment';
import { supabaseClient } from '$lib/db';
import { auth } from '$lib/supabase/server/';

export const handle = auth({
	supabaseClient,
	cookieOptions: {
		secure: !dev
	}
});
