import type { RequestHandler } from './$types';
import { handleCallbackSession } from '$lib/supabase/server';

// TODO: remove this when the cookie bug if fixed
export const POST: RequestHandler = handleCallbackSession;
