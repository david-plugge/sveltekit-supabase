<script lang="ts">
	import { page } from '$app/stores';
	import type Stripe from 'stripe';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ products, subscription } = data);

	$: subscriptionProduct = subscription?.prices?.products;
	$: billingInterval =
		($page.url.searchParams.get('type') as Stripe.Price.Recurring.Interval) ?? 'month';
</script>

<div>
	<a href="?type=month">Monthly</a>
	<a href="?type=year">Yearly</a>
</div>

<div class="grid grid-cols-2 lg:grid-cols-4 px-8">
	{#each products as product}
		{@const price = product.prices.find((p) => p.interval === billingInterval)}
		{#if price}
			{@const isActive = subscriptionProduct?.id === product.id}
			{@const priceString = new Intl.NumberFormat('de-DE', {
				style: 'currency',
				currency: price?.currency,
				minimumFractionDigits: 0
			}).format((price?.unit_amount ?? 0) / 100)}

			<div class="rounded p-6" class:border-pink-500={isActive} class:border={isActive}>
				<h2 class="text-lg font-medium">{product.name}</h2>
				<p>{product.description}</p>
				<p class="mt-4">
					<span class="text-2xl font-bold">{priceString}</span>
					<span>/{price.interval}</span>
				</p>
				<form class="mt-4" action="?/checkout" method="post">
					<input type="hidden" name="priceId" value={price.id} />
					{#if !!subscription}
						<a class="inline-block bg-neutral-700 text-white px-2 py-1 rounded" href="/account"
							>{isActive ? 'Manage' : 'Subscribe'}</a
						>
					{:else}
						<button class="bg-neutral-700 text-white px-2 py-1 rounded">
							{isActive ? 'Manage' : 'Subscribe'}
						</button>
					{/if}
				</form>
			</div>
		{/if}
	{/each}
</div>
