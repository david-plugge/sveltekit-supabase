<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { setupSupabase } from '$lib/supabase/client';
	import { supabaseClient } from '$lib/db';
	import { invalidateAll } from '$app/navigation';

	setupSupabase({
		supabaseClient
	});
</script>

<nav>
	<a href="/">Home</a>
	{#if $page.data.session.user}
		<form
			action="/logout"
			method="post"
			use:enhance={() =>
				async ({ result }) => {
					if (result.type === 'redirect' || result.type === 'success') {
						await invalidateAll();
					}
					await applyAction(result);
				}}
		>
			<button type="submit">Sign out</button>
		</form>
	{:else}
		<a href="/signin">Sign in</a>
	{/if}
</nav>

<main>
	<slot />
</main>

<style>
	nav {
		display: flex;
		gap: 0.5em;
	}
	main {
		margin-top: 2em;
	}
</style>
