import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { hmacValidator, type Types } from '@adyen/api-library';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	// TODO: basic auth
	const username = '';
	const password = '';
	if (username !== env.ADYEN_WEBHOOK_USER && password !== env.ADYEN_WEBHOOK_PASSWORD) {
		throw error(403, 'Unauthorized');
	}

	const validator = new hmacValidator();

	const notification: Types.notification.Notification = await request.json();
	const notificationItems = notification.notificationItems;

	notificationItems.forEach((notificationRequestItem) => {
		const notification = notificationRequestItem.NotificationRequestItem;
		if (validator.validateHMAC(notification, env.ADYEN_WEBHOOK_SECRET)) {
			const merchantReference = notification.merchantReference;
			const eventCode = notification.eventCode;
			console.log({ eventCode, merchantReference });
		} else {
			throw error(401, 'Invalid HMAC signature');
		}
	});

	return new Response('[accepted]', { status: 200 });
};
