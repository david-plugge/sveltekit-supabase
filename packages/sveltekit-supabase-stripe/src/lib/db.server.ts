import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';

export const supabaseAdmin = createClient(
	env.PUBLIC_SUPABASE_URL,
	privateEnv.SUPABASE_SERVICE_ROLE_KEY,
	{
		persistSession: false,
		autoRefreshToken: false
	}
);
