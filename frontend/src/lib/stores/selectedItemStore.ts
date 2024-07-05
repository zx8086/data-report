// lib/stores/selectedItemStore.ts
import { writable } from 'svelte/store';
import type { SelectedItemType, ImageDetails } from '../types';

function createSelectedItemStore() {
	const { subscribe, set, update } = writable<SelectedItemType | null>(null);

	return {
		subscribe,
		set: (value: SelectedItemType | null) => {
			console.log('Setting selectedItem:', value);
			set(value);
		},
		update,
		setImageDetails: (imageDetails: ImageDetails) => update(item => {
			if (item && item.type === 'collection') {
				return { ...item, imageDetails };
			}
			return item;
		}),
		reset: () => {
			console.log('Resetting selectedItem');
			set(null);
		}
	};
}

export const selectedItem = createSelectedItemStore();