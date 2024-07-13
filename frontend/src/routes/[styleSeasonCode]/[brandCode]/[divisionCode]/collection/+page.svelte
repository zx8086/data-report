<!--+page.svelte (Collection)-->
<script lang="ts">
	import type { Collection, SelectedItemType } from '$lib/types';
	import { selectedItem } from '$lib/stores/selectedItemStore';
	import { page } from '$app/stores';
	import { collectionStore, searchInput, activeFilters, filteredAndSearchedCollection } from '$lib/stores/collectionStore';
	import { translateCode, translatePath } from '$lib/utils/translations';

	import { key } from '$lib/context/tracker';
	import { onMount, getContext } from 'svelte';
	const { getTracker } = getContext(key);

	const baseUrl = 'https://s7g10.scene7.com/is/image/TommyHilfigerEU';
	export let data: {optionsProductView: Collection[] | null, status?: number, error?: string};

	$: if (data?.optionsProductView) {
		console.log('Setting collection store with:', data.optionsProductView.length, 'items');
		collectionStore.set(data.optionsProductView);
	}

	function handleImageError(event: any) {
		event.target.src = '/img/not-found.png';
		event.target.onerror = null;
	}

	let styleSeasonCode : string;
	let brandCode : string;
	let divisionCode : string;

	$: {
		if ($page) {
			const pathParts = $page.url.pathname.split('/');
			styleSeasonCode = pathParts[1];
			brandCode = pathParts[2];
			divisionCode = pathParts[3];
		}
	}

	onMount(() => {
		try {
			const tracker = getTracker();
			if (tracker) {
				try {
					const translatedDivision = translateCode(divisionCode, 'division');
					tracker.event('Page_View', {
						page: `Collection - ${translatedDivision}`,
						category: 'Navigation',
						action: 'View'
					});
				} catch (translationError) {
					console.error('Error translating division code:', translationError);
					tracker.event('Page_View', {
						page: 'Collection',
						category: 'Navigation',
						action: 'View',
						error: 'Translation failed'
					});
				}
			} else {
				console.warn('Tracker not available');
			}
		} catch (error) {
			console.error('Error in onMount:', error);
		}
	});

	async function handleSelect(product: Collection, event: Event | KeyboardEvent) {
		event.preventDefault();
		console.log('handleSelect called with product:', product);

		// Set initial look data
		selectedItem.set({
			type: 'collection',
			data: product,
			meta: {
				styleSeasonCode,
				brandCode,
				divisionCode
			}
		});

		console.log('selectedItem after initial set:', $selectedItem);

		const formData = new FormData();
		formData.append('divisionCode', divisionCode);
		formData.append('styleCode', product.optionCode);
		formData.append('styleSeasonCode', styleSeasonCode);

		try {
			const response = await fetch('?/getImageDetails', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log('Result from server:', result);

			if (result.type === 'success' && result.status === 200) {

				// Parse the nested JSON data
				const parsedData = JSON.parse(result.data);
				// The image details structure is in the third element of the array
				const imageDetailsStructure = parsedData[2];
				// The actual values start from the fourth element
				const values = parsedData.slice(3);

				// Construct the actual image details object
				const imageDetails = Object.fromEntries(
					Object.entries(imageDetailsStructure).map(([key, index]) => [key, values[Number(index) - 3] || ''])
				);

				console.log('Parsed image details:', imageDetails);

				selectedItem.setImageDetails(imageDetails);

				console.log('selectedItem after setting image details:', $selectedItem);
			} else {
				console.error('Failed to fetch image details:', result.error);
			}
		} catch (error) {
			console.error('Error fetching image details:', error);
		}
	}

	let showFilters = false;

	function toggleFilters() {
		console.log('Toggling filters');
		showFilters = !showFilters;
		console.log('showFilters:', showFilters);
	}

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target) {
			console.log('Search input changed:', target.value);
			searchInput.set(target.value);
		}
	}

	function handleFilterChange(filterKey: string, event: Event) {
		const target = event.target as HTMLInputElement;
		if (target) {
			const value = target.checked;
			console.log('Filter changed:', filterKey, value);
			activeFilters.update(filters => {
				// If 'noImageUrl' is checked, uncheck 'imageUrl' and vice versa
				if (filterKey === 'noImageUrl' && value) {
					return {...filters, [filterKey]: value, imageUrl: false};
				} else if (filterKey === 'imageUrl' && value) {
					return {...filters, [filterKey]: value, noImageUrl: false};
				}
				return {...filters, [filterKey]: value};
			});
		}
	}

	function clearFilters() {
		activeFilters.set({
			isAvailable: false,
			isCancelled: false,
			isSoldOut: false,
			isNew: false,
			isOpenForEcom: false,
			missingDeliveryDates: false,
			isClosed: false,
			isInvalid: false,
			isLicensed: false,
			isUpdated: false,
			missingActiveFlag: false,
			missingFrontImageUrl: false,
		});
	}

	$: {
		console.log('searchInput changed:', $searchInput);
		console.log('activeFilters changed:', $activeFilters);
		console.log('filteredAndSearchedCollection length:', $filteredAndSearchedCollection.length);
	}

	const NOT_FOUND_IMG_URL = '/img/not-found.png';
	const KEY_ENTER = 'Enter';
	const KEY_SPACE = ' ';

	function handleKeyDown(product, event) {
		if (event.key === KEY_ENTER || event.key === KEY_SPACE) {
			event.preventDefault();
			handleSelect(product, event);
		}
	}
</script>

<!-- Search and Filter UI -->
<div class="mb-4">
	<input
		type="text"
		placeholder="Search by option code or description"
		class="p-2 border rounded"
		on:input={handleSearchInput}
	/>
	<button type="button"  on:click={toggleFilters} class="ml-2 p-2 bg-blue-500 text-white rounded">
		Filters
	</button>
</div>

{#if showFilters}
	<div class="mb-4 p-4 border rounded">
		<h3 class="text-lg font-bold mb-2">Filters</h3>
		<button on:click={clearFilters} class="my-2 p-2 bg-gray-300 rounded">Clear Filters</button>

		{#each [
			{"label": "Missing Delivery Dates", "key" : "missingDeliveryDates"},
			{"label": "Missing Active Flag", "key": "missingActiveFlag"},
			{"label": "Missing Front Image URL", "key": "missingFrontImageUrl"},
			{"label": "Available", "key": "isAvailable"},
			{"label": "Cancelled", "key": "isCancelled"},
			{"label": "SoldOut", "key": "isSoldOut"},
			{"label": "New", "key": "isNew"},
			{"label": "Open For Ecom", "key": "isOpenForEcom"},
			{"label": "Closed", "key": "isClosed"},
			{"label": "Invalid", "key": "isInvalid"},
			{"label": "Licensed", "key": "isLicensed"},
			{"label": "Updated", "key": "isUpdated"}
		] as filter}
			<label class="block">
				<input
					type="checkbox"
					checked={$activeFilters[filter.key]}
					on:change={(e) => handleFilterChange(filter.key, e)}
				/>
				{filter.label}
			</label>
		{/each}
	</div>
{/if}

<!-- Product Grid -->
<div class="bg-white">
	<div class="m-4">Number of Styles: {$filteredAndSearchedCollection.length}</div>

	<div class="max-w-2xl px-4 py-8 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

		{#if $filteredAndSearchedCollection.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-5">
				{#each $filteredAndSearchedCollection as product (product.optionCode)}
					<div class="relative group">
						<button
							class="w-full overflow-hidden rounded-md mb-3 aspect-w-1 aspect-h-1 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
							on:click={(event) => handleSelect(product, event)}
							on:keydown={(event) => handleKeyDown(product, event)}
							aria-label={`Select ${product.description}`}
						>
							<img
								src={product.imageUrl ? baseUrl + product.imageUrl : NOT_FOUND_IMG_URL}
								alt={product.description}
								class="object-contain object-center w-full h-full"
								on:error={handleImageError}
							/>
						</button>
						<div class="option-code font-bold text-sm text-center">{product.optionCode}</div>
						<div class="description text-xs text-center">{product.description}</div>
					</div>
				{/each}
			</div>
		{:else}
			<div>No products found matching your criteria.</div>
		{/if}
	</div>
</div>