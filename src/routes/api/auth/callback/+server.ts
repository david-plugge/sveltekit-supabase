import type { RequestHandler } from './$types';
import { handleCallbackSession } from '$lib/supabase/server';

export const POST: RequestHandler = handleCallbackSession;
