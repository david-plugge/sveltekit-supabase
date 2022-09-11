import { supabaseAdmin } from '$lib/db.server';
import { stripe } from '$lib/stripe.server';
import type { User } from '@supabase/supabase-js';
import type Stripe from 'stripe';

export async function createOrRetrieveCustomer(user: User): Promise<string | undefined> {
	const { error, data } = await supabaseAdmin
		.from('customers')
		.select('stripe_customer_id')
		.eq('id', user.id)
		.single();

	if (error) {
		const customerData: Stripe.CustomerCreateParams = {
			metadata: {
				supabaseUUID: user.id
			}
		};
		if (user.email) {
			customerData.email = user.email;
		}
		const customer = await stripe.customers.create(customerData);
		const { error: customerInsertError } = await supabaseAdmin
			.from('customers')
			.insert({ id: user.id, stripe_customer_id: customer.id });
		if (customerInsertError) {
			throw customerInsertError;
		}
		return customer.id;
	}
	return data?.stripe_customer_id;
}
