import { supabaseAdmin } from '$lib/db.server';
import { stripe } from '$lib/stripe.server';
import type Stripe from 'stripe';
import { toDateTime } from './helpers';
import type { Customer, UserDetails } from '$lib/types';

/**
 * Copies the billing details from the payment method to the customer object.
 */
export async function copyBillingDetailsToCustomer(
	uuid: string,
	payment_method: Stripe.PaymentMethod
) {
	//Todo: check this assertion
	const customer = payment_method.customer as string;
	const { name, phone, address } = payment_method.billing_details;
	if (!name || !phone || !address) return;
	await stripe.customers.update(customer, { name, phone, address: address as Stripe.AddressParam });
	const { error } = await supabaseAdmin
		.from<UserDetails>('users')
		.update({
			billing_address: address as Stripe.Address,
			payment_method: payment_method['acss_debit']
		})
		.eq('id', uuid);
	if (error) throw error;
}

export async function manageSubscriptionStatusChange(
	subscriptionId: string,
	customerId: string,
	createAction = false
) {
	// Get customer's UUID from mapping table.
	const { data: customerData, error: noCustomerError } = await supabaseAdmin
		.from<Customer>('customers')
		.select('id')
		.eq('stripe_customer_id', customerId)
		.single();
	if (noCustomerError) throw noCustomerError;

	const { id: uuid } = customerData || {};

	const subscription = (await stripe.subscriptions.retrieve(subscriptionId, {
		expand: ['default_payment_method']
	})) as Stripe.Response<Stripe.Subscription> & { quantity?: number };
	// Upsert the latest status of the subscription object.
	const subscriptionData = {
		id: subscription.id,
		user_id: uuid,
		metadata: subscription.metadata,
		status: subscription.status,
		price_id: subscription.items.data[0].price.id,
		//TODO check quantity on subscription
		quantity: typeof subscription.quantity === 'number' ? subscription.quantity : undefined,
		cancel_at_period_end: subscription.cancel_at_period_end,
		cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at) : null,
		canceled_at: subscription.canceled_at ? toDateTime(subscription.canceled_at) : null,
		current_period_start: toDateTime(subscription.current_period_start),
		current_period_end: toDateTime(subscription.current_period_end),
		created: toDateTime(subscription.created),
		ended_at: subscription.ended_at ? toDateTime(subscription.ended_at) : null,
		trial_start: subscription.trial_start ? toDateTime(subscription.trial_start) : null,
		trial_end: subscription.trial_end ? toDateTime(subscription.trial_end) : null
	};

	const { error } = await supabaseAdmin.from('subscriptions').upsert([subscriptionData]);
	if (error) throw error;
	console.log(`Inserted/updated subscription [${subscription.id}] for user [${uuid}]`);

	// For a new subscription copy the billing details to the customer object.
	// NOTE: This is a costly operation and should happen at the very end.
	if (createAction && subscription.default_payment_method && uuid)
		await copyBillingDetailsToCustomer(
			uuid,
			subscription.default_payment_method as Stripe.PaymentMethod
		);
}
