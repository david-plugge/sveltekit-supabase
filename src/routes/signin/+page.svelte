<script lang="ts">
	import { supabaseClient } from '$lib/db';

	import { enhanceAndInvalidate } from '$lib/enhance';

	export let form: any;
</script>

<button
	on:click={() => {
		supabaseClient.auth.signIn({ provider: 'github' }, { scopes: 'public_repo user:email' });
	}}
>
	GitHub with scopes
</button>

<form action="?/signin" method="post" use:enhanceAndInvalidate>
	{#if form?.invalidCredentials}
		<p class="error">Invalid credentials</p>
	{/if}
	{#if form?.serverError}
		<p class="error">Server error. Try again later.</p>
	{/if}

	<input type="email" name="email" value="test@davidplugge.de" />
	{#if form?.emailMissing}
		<p class="error">Please enter your email</p>
	{/if}

	<input type="password" name="password" value="secretpassword" />
	{#if form?.passwordMissing}
		<p class="error">Please enter your password</p>
	{/if}

	<button type="submit">Sign in</button>
</form>

<style>
	.error {
		color: red;
	}
</style>
