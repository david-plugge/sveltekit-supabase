import { invalidateAll } from '$app/navigation';
import { page } from '$app/stores';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { onMount } from 'svelte';

interface Options {
	supabaseClient: SupabaseClient;
	tokenRefreshMargin?: number;
}

export function setupSupabase({ supabaseClient, tokenRefreshMargin = 10 }: Options) {
	onMount(() => {
		let timeout: ReturnType<typeof setTimeout> | null;
		let expiresAt: number | undefined;

		const pageUnsub = page.subscribe(({ data }) => {
			const exp = (data.session?.user as User & { exp: number })?.exp;

			if (!exp) {
				timeout && clearTimeout(timeout);
				timeout = null;
				return;
			}

			if (exp !== expiresAt) {
				expiresAt = exp;

				const timeNow = Math.round(Date.now() / 1000);
				const expiresIn = expiresAt - timeNow;
				const refreshDurationBeforeExpires =
					expiresIn > tokenRefreshMargin ? tokenRefreshMargin : 0.5;

				timeout && clearTimeout(timeout);

				timeout = setTimeout(() => {
					// refresh token
					invalidateAll();
				}, (expiresIn - refreshDurationBeforeExpires) * 1000);
			}
		});

		const { data: subscription } = supabaseClient.auth.onAuthStateChange((event, session) => {
			fetch('/api/auth/callback', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ event, session }),
				credentials: 'same-origin'
			}).then((response) => {
				if (response.ok) {
					invalidateAll();
				}
			});
		});

		return () => {
			timeout && clearTimeout(timeout);
			pageUnsub();
			subscription?.unsubscribe();
		};
	});
}
