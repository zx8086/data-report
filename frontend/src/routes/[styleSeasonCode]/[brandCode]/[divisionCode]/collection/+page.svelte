<!--+page.svelte (Collection)-->
<script lang="ts">
	import type { Collection, SelectedItemType } from '$lib/types';
	// import posthog from 'posthog-js';
	import { page } from '$app/stores';
	import { selectedItem } from '$lib/stores/selectedItemStore';
	import { collectionStore, searchInput, activeFilters, filteredAndSearchedCollection } from '$lib/stores/collectionStore';

	// posthog.capture('$pageview')

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
			// posthog.capture(`Divisional Collection: ${styleSeasonCode}-${brandCode}-${divisionCode}`);
		}
	}

	function handleSelect(product: Collection, event: Event | KeyboardEvent) {
		event.preventDefault();
		console.log('handleSelect called with product:', product);
		selectedItem.set({
			type: 'collection',
			data: product,
			meta: {
				styleSeasonCode,
				brandCode,
				divisionCode
			}
		} as SelectedItemType);
		console.log('selectedItem set to:', $selectedItem);
	}

	let showFilters = false;

	function toggleFilters() {
		debugger
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
			activeFilters.update(filters => ({...filters, [filterKey]: value}));
		}
	}

	function clearFilters() {
		activeFilters.set({
			isMissingImages: false,
			isCancelled: false,
			isSoldOut: false,
			isNew: false,
			isOpenForEcom: false,
			hasDeliveryDropDate: false,
		});
	}

	$: {
		console.log('searchInput changed:', $searchInput);
		console.log('activeFilters changed:', $activeFilters);
		console.log('filteredAndSearchedCollection length:', $filteredAndSearchedCollection.length);
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
		{#each Object.entries($activeFilters) as [key, value]}
			<label class="block">
				<input
					type="checkbox"
					checked={value}
					on:change={(e) => handleFilterChange(key, e)}
				/>
				{key}
			</label>
		{/each}
		<button on:click={clearFilters} class="mt-2 p-2 bg-gray-300 rounded">Clear Filters</button>
	</div>
{/if}

<!-- Product Grid -->
<div class="bg-white">
	<div class="max-w-2xl px-4 py-8 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
		{#if $collectionStore.length === 0}
			<div>Loading products...</div>
		{:else if $filteredAndSearchedCollection.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-5">
				{#each $filteredAndSearchedCollection as product (product.optionCode)}
					<div class="relative group">
						<button
							class="w-full overflow-hidden rounded-md mb-3 aspect-w-1 aspect-h-1 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
							on:click={(event) => handleSelect(product, event)}
							on:keydown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleSelect(product, event);
                }
              }}
							aria-label={`Select ${product.description}`}
						>
							<img
								src={product.imageUrl ? baseUrl + product.imageUrl : '/img/not-found.png'}
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
