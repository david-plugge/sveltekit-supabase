import type { Price, Product, Subscription } from '$lib/types';
import { loadWithSession, supabaseServerClient } from 'supabase-auth-helpers-sveltekit';
import type { PageLoad } from './$types';

type ProductWithPrices = Product & { prices: Price[] };

export const load: PageLoad = loadWithSession(
	{ status: 303, location: '/signin' },
	async ({ session }) => {
		const { data: subscriptions } = await supabaseServerClient(session.accessToken)
			.from<Subscription>('subscriptions')
			.select('*, prices(*, products(*))')
			.in('status', ['trialing', 'active'])
			.limit(1);
		const subscription = subscriptions ? subscriptions[0] : null;

		const { error: productsError, data: products } = await supabaseServerClient(session.accessToken)
			.from('products')
			.select('*, prices(*)')
			.eq('active', true)
			.eq('prices.active', true)
			.order('metadata->index')
			.order('unit_amount', { foreignTable: 'prices' });

		if (productsError) {
			console.log(productsError);
			return {
				products: [] as ProductWithPrices[]
			};
		}

		return {
			products: products as ProductWithPrices[],
			subscription
		};
	}
);
