<script lang="ts">
	import { enhanceAndInvalidate } from '$lib/enhance';
	import { page } from '$app/stores';
	import { setupSupabase } from '$lib/supabase/client';
	import { supabaseClient } from '$lib/db';

	setupSupabase({
		supabaseClient
	});
</script>

<nav>
	<a href="/">Home</a>
	{#if $page.data.session.user}
		<form action="/logout" method="post" use:enhanceAndInvalidate>
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
