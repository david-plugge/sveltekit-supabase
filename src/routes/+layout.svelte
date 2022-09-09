<script lang="ts" context="module">
	// this is needed to set the client instance
	// must happen in module context to ensure it´s run before any load functions
	import { supabaseClient } from '$lib/db';
	import { setupSupabase } from '$lib/supabase';

	setupSupabase({ supabaseClient });
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { startSupabaseSessionSync, enhanceAndInvalidate } from '$lib/supabase';

	// this sets up automatic token refreshing
	startSupabaseSessionSync();
</script>

<nav>
	<a href="/">Home</a>
	{#if $page.data.session.user}
		<a href="/posts">Posts</a>
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
