import { stripe } from '$lib/stripe.server';
import { createOrRetrieveCustomer } from '$lib/utils/customer';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	async checkout({ request, locals, url }) {
		const formData = await request.formData();
		const priceIdRaw = formData.get('priceId');

		if (!priceIdRaw) {
			return invalid(400, {
				noPrice: true
			});
		}

		const priceId = priceIdRaw.toString();

		const user = locals.user;
		if (!user) {
			throw error(400, 'Could not get user');
		}
		const customer = await createOrRetrieveCustomer(user);
		if (!customer) throw error(400, 'Could not get customer');

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			billing_address_collection: 'required',
			customer,
			line_items: [{ price: priceId, quantity: 1 }],
			mode: 'subscription',
			allow_promotion_codes: true,
			subscription_data: {
				trial_from_plan: true
			},
			success_url: `${url.origin}/account`,
			cancel_url: `${url.origin}/`
		});

		if (!session.url) {
			throw error(400, 'Could not get url');
		}
		throw redirect(303, session.url);
	}
};
