// stores/collectionStore.ts
import { writable, derived } from 'svelte/store';
import type { Collection } from '$lib/types';

function createCollectionStore() {
	const { subscribe, set, update } = writable<Collection[]>([]);

	return {
		subscribe,
		set: (value: Collection[]) => {
			console.log('Setting collection store with:', value.length, 'items');
			set(value);
		},
		update: (updater: (value: Collection[]) => Collection[]) => {
			update(currentValue => {
				const newValue = updater(currentValue);
				console.log('Updating collection store. New length:', newValue.length);
				return newValue;
			});
		}
	};
}

export const collectionStore = createCollectionStore();
export const searchInput = writable('');

export const activeFilters = writable({
	isAvailable: false,
	isCancelled: false,
	isSoldOut: false,
	isNew: false,
	isOpenForEcom: false,
	hasDeliveryDropDate: false,
	imageUrl: false,
	noImageUrl: false,
	isClosed: false,
	isInvalid: false,
	isLicensed: false,
	isUpdated: false,
	activeOption: false,
	hasImageDocument: false,
});

export const filteredAndSearchedCollection = derived(
	[collectionStore, searchInput, activeFilters],
	([$collectionStore, $searchInput, $activeFilters]) => {
		console.log('Deriving filtered and searched collection...');
		console.log('Current collection store:', $collectionStore);
		console.log('Current search input:', $searchInput);
		console.log('Current active filters:', $activeFilters);

		let filtered = $collectionStore;

		// Apply filters
		const activeFilterEntries = Object.entries($activeFilters).filter(([_, value]) => value);
		if (activeFilterEntries.length > 0) {
			console.log('Active filters:', activeFilterEntries);
			filtered = filtered.filter(item => {
				return activeFilterEntries.every(([key, _]) => {
					if (key === 'noImageUrl') {
						// Reverse logic for imageUrl
						return !item.imageUrl;
					}
					return item[key as keyof Collection];
				});
			});
		}

		// Apply search
		if ($searchInput.trim()) {
			const searchLower = $searchInput.toLowerCase().trim();
			console.log('Applying search with input:', searchLower);
			filtered = filtered.filter(item =>
				item.optionCode.toLowerCase().includes(searchLower) ||
				item.description.toLowerCase().includes(searchLower)
			);
		}

		console.log('Filtered results count:', filtered.length);
		return filtered;
	}
);
