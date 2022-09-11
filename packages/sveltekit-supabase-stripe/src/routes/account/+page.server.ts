import { stripe } from '$lib/stripe.server';
import { createOrRetrieveCustomer } from '$lib/utils/customer';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	async openCustomerPortal({ locals, url }) {
		try {
			const user = locals.user;
			if (!user) {
				throw error(400, {
					message: 'Not authenticated'
				});
			}
			const customer = await createOrRetrieveCustomer(user);
			if (!customer) {
				throw error(400, {
					message: 'Cannot get customer'
				});
			}
			const { url: portalUrl } = await stripe.billingPortal.sessions.create({
				customer,
				return_url: `${url.origin}/account`
			});
			console.log({ portalUrl });

			throw redirect(303, portalUrl);
		} catch (err: unknown) {
			console.log(err);
			return invalid(500, {
				serverError: true
			});
		}
	}
};
