import type { RequestHandler } from './$types';
import { handleCallbackSession } from '$lib/supabase/server/helpers';

export const POST: RequestHandler = handleCallbackSession;
