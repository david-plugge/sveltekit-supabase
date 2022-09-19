import type { PageLoad } from './$types';
import { loadWithSession } from 'sveltekit-supabase-auth';

export const load: PageLoad = loadWithSession({ status: 303, location: '/signin' });
