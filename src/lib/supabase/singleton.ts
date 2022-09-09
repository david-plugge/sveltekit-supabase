import { browser } from '$app/environment';

const singletons = new Map<string, unknown>();

export function setSingleton(key: string, value: unknown) {
	if (!singletons.has(key)) {
		singletons.set(key, value);
	}
}

export function getSingleton(key: string) {
	if (!singletons.has(key)) {
		if (browser) {
			throw new Error('Not initialized, make sure to call `setupSupabase({ supabaseClient })`');
		}
		throw new Error('Not initialized, make sure to call `auth()`');
	}
	return singletons.get(key);
}
