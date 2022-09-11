<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let loading = false;
	export let form: any;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ action, result }) => {
			loading = false;
			await applyAction(result);
			if (result.type === 'redirect' && action.searchParams.has('/signin')) {
				await invalidateAll();
			}
		};
	};
</script>

<form action="?/signin" method="post" use:enhance={handleSubmit}>
	{#if form?.success}
		<p class="success">Success! Check your emails.</p>
	{/if}

	{#if form?.invalidCredentials}
		<p class="error">Invalid credentials</p>
	{/if}
	{#if form?.serverError}
		<p class="error">Server error. Try again later.</p>
	{/if}

	<input type="email" name="email" placeholder="Email" />
	{#if form?.emailMissing}
		<p class="error">Please enter your email</p>
	{/if}

	<input type="password" name="password" placeholder="Password" />
	{#if form?.passwordMissing}
		<p class="error">Please enter your password</p>
	{/if}

	<button disabled={loading} type="submit">Sign in</button>
	<button disabled={loading} type="submit" formaction="?/signup">Sign up</button>
</form>

<style lang="postcss">
	.error {
		color: red;
	}
	.success {
		color: green;
	}

	input {
		@apply bg-neutral-200 px-2 py-1;
	}
</style>
