import type { PageLoad } from './$types';
import { loadWithSession } from 'supabase-auth-helpers-sveltekit';

export const load: PageLoad = loadWithSession({ status: 303, location: '/signin' });
