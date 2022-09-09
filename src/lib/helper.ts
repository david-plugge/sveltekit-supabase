import { derived, type Readable } from 'svelte/store';

export function dedupe<T, R>(
	store: Readable<T>,
	fn: (data: T) => R = (data) => data as unknown as R
): Readable<R> {
	let value: R;
	return derived(store, (data, set) => {
		const newValue = fn(data);
		if (value !== newValue) {
			value = newValue;
			set(value);
		}
	});
}
