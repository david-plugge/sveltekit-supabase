import type { SupabaseClient } from '@supabase/supabase-js';

export interface ClientConfig {
	supabaseClient: SupabaseClient;
	tokenRefreshMargin: number;
}
