import type { RequestHandler } from './$types';
import { checkout } from '$lib/adyen.server';
import { Types } from '@adyen/api-library';
import { redirect } from '@sveltejs/kit';

const ResultCodes = Types.checkout.PaymentResponse.ResultCodeEnum;

export const POST: RequestHandler = async ({ url }) => {
	const redirectResult = url.searchParams.get('redirectResult');
	const redirectPayload = url.searchParams.get('payload');
	const details: {
		redirectResult?: string;
		payload?: string;
	} = {};

	if (redirectResult) {
		details.redirectResult = redirectResult;
	} else if (redirectPayload) {
		details.payload = redirectPayload;
	}

	try {
		const response = await checkout.paymentsDetails({ details });
		switch (response.resultCode) {
			case ResultCodes.Authorised:
				throw redirect(303, '/result/success');
			case ResultCodes.Pending:
			case ResultCodes.Received:
				throw redirect(303, '/result/pending');
			case ResultCodes.Refused:
				throw redirect(303, '/result/failed');
			default:
				throw redirect(303, '/result/error');
		}
	} catch (err: unknown) {
		console.log(err);

		if (err instanceof Types.checkout.ServiceError) {
			console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
		}
		throw redirect(303, '/result/error');
	}
};
