import type { RequestHandler } from './$types';
import { handleCallbackSession } from 'sveltekit-supabase-auth/server';

// TODO: remove this when the cookie bug if fixed
export const POST: RequestHandler = handleCallbackSession;
