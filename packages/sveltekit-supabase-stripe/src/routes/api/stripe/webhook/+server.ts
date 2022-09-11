import { env } from '$env/dynamic/private';
import { stripe } from '$lib/stripe.server';
import { json } from '@sveltejs/kit';
import type Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { manageSubscriptionStatusChange } from './payments';
import { upsertPriceRecord, upsertProductRecord } from './products';

export const POST: RequestHandler = async ({ request }) => {
	const sig = request.headers.get('stripe-signature');
	const webhookSecret = env.STRIPE_WEBHOOK_SECRET_LIVE ?? env.STRIPE_WEBHOOK_SECRET;

	let event!: Stripe.Event;
	try {
		if (!sig || !webhookSecret) {
			return new Response(null, { status: 500 });
		}
		const arrayBuffer = await request.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		event = await stripe.webhooks.constructEventAsync(buffer, sig, webhookSecret);
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.log(`❌ Error message: ${err.message}`);
			return new Response(`Webhook Error: ${err.message}`, { status: 400 });
		}
	}

	try {
		switch (event.type) {
			case 'product.created':
			case 'product.updated':
				{
					await upsertProductRecord(event.data.object as Stripe.Product);
				}
				break;
			case 'price.created':
			case 'price.updated':
				{
					await upsertPriceRecord(event.data.object as Stripe.Price);
				}
				break;
			case 'customer.subscription.created':
			case 'customer.subscription.updated':
			case 'customer.subscription.deleted':
				{
					const subscription = event.data.object as Stripe.Subscription;
					await manageSubscriptionStatusChange(
						subscription.id,
						subscription.customer as string,
						event.type === 'customer.subscription.created'
					);
				}
				break;
			case 'checkout.session.completed':
				{
					const checkoutSession = event.data.object as Stripe.Checkout.Session;
					if (checkoutSession.mode === 'subscription') {
						const subscriptionId = checkoutSession.subscription;
						await manageSubscriptionStatusChange(
							subscriptionId as string,
							checkoutSession.customer as string,
							true
						);
					}
				}
				break;
			default:
				console.log(event.type);

				throw new Error('Unhandled relevant event!');
		}
		return json({ received: true });
	} catch (err: unknown) {
		console.log(err);
		return new Response('Webhook error: "Webhook handler failed. View logs."');
	}
};
