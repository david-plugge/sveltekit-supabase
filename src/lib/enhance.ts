import { applyAction, enhance } from '$app/forms';
import { invalidateAll } from '$app/navigation';

export function enhanceAndInvalidate(node: HTMLFormElement) {
	return enhance(node, () => async ({ result }) => {
		if (result.type === 'redirect' || result.type === 'success') {
			await invalidateAll();
		}
		await applyAction(result);
	});
}
