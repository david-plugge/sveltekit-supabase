<script lang="ts" context="module">
	// this is needed to set the client instance
	// must happen in module context to ensure it´s run before any load functions
	import { supabaseClient } from '$lib/db';
	import { setupSupabase } from 'sveltekit-supabase-auth';

	setupSupabase({ supabaseClient });
</script>

<script lang="ts">
	import '../app.css';
	import { enhanceAndInvalidate, startSupabaseSessionSync } from 'sveltekit-supabase-auth';
	import { page } from '$app/stores';

	// this sets up automatic token refreshing
	startSupabaseSessionSync();
</script>

<nav class="flex gap-2">
	<a href="/">Pricing</a>
	{#if $page.data.session.user}
		<a href="/account">Account</a>
		<form action="/logout" method="post" use:enhanceAndInvalidate>
			<button type="submit">Sign out</button>
		</form>
	{:else}
		<a href="/signin">Sign in</a>
	{/if}
</nav>

<main class="my-4">
	<slot />
</main>
