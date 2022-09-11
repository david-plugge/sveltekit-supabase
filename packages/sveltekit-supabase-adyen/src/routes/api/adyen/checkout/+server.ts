import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { error, json } from '@sveltejs/kit';
import { checkout } from '$lib/adyen.server';
import clm from 'country-locale-map';

export const POST: RequestHandler = async ({ locals }) => {
	const orderRef = (Math.random() * 1e9).toFixed(0); // TODO: set to orderId
	const countryCode = 'DE';
	const currency = clm.getCurrencyByAlpha2(countryCode);
	const shopperLocale = clm.getLocaleByAlpha2(countryCode);

	const user = locals.user;
	if (!user) {
		throw error(400, 'Not logged in');
	}
	if (!currency) {
		throw error(400, 'Cannot get currency');
	}
	const amount = { currency, value: 1099 };

	const sessionResponse = await checkout.sessions({
		amount,
		reference: orderRef,
		returnUrl: `/handleShopperRedirect?order=${orderRef}`,
		merchantAccount: env.ADYEN_MERCHANT_ACCOUNT,
		countryCode,
		shopperLocale,
		shopperReference: user.id,
		shopperEmail: user.email,
		allowedPaymentMethods: [
			'scheme',
			'sepadirectdebit',
			'giropay',
			'directEbanking',
			'klarna_paynow',
			'googlepay',
			'paypal',
			'amazonpay'
		],
		deliveryAddress: {
			country: 'DE',
			city: 'Musterstadt',
			houseNumberOrName: '1',
			postalCode: '12345',
			street: 'Musterstraße'
		},
		shopperName: {
			firstName: 'Max',
			lastName: 'Mustermann'
		}
	});
	return json(sessionResponse, { status: 200 });
};
