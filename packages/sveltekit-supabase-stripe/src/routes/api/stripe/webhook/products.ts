import { supabaseAdmin } from '$lib/db.server';
import type Stripe from 'stripe';
import type { Price, Product } from '$lib/types';

export async function upsertProductRecord(product: Stripe.Product) {
	const productData: Product = {
		id: product.id,
		active: product.active,
		name: product.name,
		description: product.description ?? undefined,
		image: product.images?.[0] ?? null,
		metadata: product.metadata
	};

	const { error } = await supabaseAdmin.from<Product>('products').upsert([productData]);
	if (error) throw error;
	console.log(`Product inserted/updated: ${product.id}`);
}

export async function upsertPriceRecord(price: Stripe.Price) {
	const priceData: Price = {
		id: price.id,
		product_id: typeof price.product === 'string' ? price.product : '',
		active: price.active,
		currency: price.currency,
		description: price.nickname ?? undefined,
		type: price.type,
		unit_amount: price.unit_amount ?? undefined,
		interval: price.recurring?.interval,
		interval_count: price.recurring?.interval_count,
		trial_period_days: price.recurring?.trial_period_days ?? undefined,
		metadata: price.metadata
	};

	const { error } = await supabaseAdmin.from<Price>('prices').upsert([priceData]);
	if (error) throw error;
	console.log(`Price inserted/updated: ${price.id}`);
}
