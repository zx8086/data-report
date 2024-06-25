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

		<!-- Add these new filters -->
		<label class="block">
			<input
				type="checkbox"
				checked={$activeFilters.noImageUrl}
				on:change={(e) => handleFilterChange('noImageUrl', e)}
			/>
			No Image
		</label>
		<label class="block">
			<input
				type="checkbox"
				checked={$activeFilters.imageUrl}
				on:change={(e) => handleFilterChange('imageUrl', e)}
			/>
			Has Image
		</label>

		<!-- Keep the existing filters if needed -->
		{#each Object.entries($activeFilters) as [key, value]}
			{#if key !== 'imageUrl' && key !== 'noImageUrl'}
				<label class="block">
					<input
						type="checkbox"
						checked={value}
						on:change={(e) => handleFilterChange(key, e)}
					/>
					{key}
				</label>
			{/if}
		{/each}
	</div>
{/if}

<!-- Product Grid -->
<div><p>Filtered Results: {$filteredAndSearchedCollection.length}</p></div>
<div class="bg-white">
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
