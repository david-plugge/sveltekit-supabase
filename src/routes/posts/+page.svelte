<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<ul>
	{#each data.posts as post}
		<li>
			<div>{post.title}</div>
			<p>{post.content}</p>
		</li>
	{/each}
</ul>
