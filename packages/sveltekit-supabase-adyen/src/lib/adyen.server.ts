import { env } from '$env/dynamic/private';
import adyen from '@adyen/api-library';

const { Client, CheckoutAPI } = adyen;

const adyenClient = new Client({
	apiKey: env.ADYEN_API_KEY,
	environment: env.ADYEN_ENVIRONMENT
});

export const checkout = new CheckoutAPI(adyenClient);
