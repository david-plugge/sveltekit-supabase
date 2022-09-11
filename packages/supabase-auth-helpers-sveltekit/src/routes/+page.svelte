<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.data.session.user}
	<pre>{JSON.stringify($page.data.session.user, null, 2)}</pre>
{/if}
