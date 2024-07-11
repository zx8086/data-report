<!--+page.svelte(Looks)-->
<script lang="ts">
	// import type { PageData } from './$types';
	import { page } from '$app/stores';
	import type { Look, LookDetails } from '$lib/types';
	import { selectedItem } from '$lib/stores/selectedItemStore';
	import { key } from '$lib/context/tracker';
	import { onMount, getContext } from 'svelte';
	import { translateCode, translatePath } from '$lib/utils/translations';

	export let data: { looks: Look[] | null, status?: number, error?: string };

	const { getTracker } = getContext(key);
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
						page: `Looks - ${translatedDivision}`,
						category: 'Navigation',
						action: 'View'
					});
				} catch (translationError) {
					console.error('Error translating division code:', translationError);
					tracker.event('Page_View', {
						page: 'Looks',
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

	async function handleSelect(look: Look, event?: Event | KeyboardEvent) {
		if (event) {
			event.preventDefault();
		}
		console.log('handleSelect called with look:', look);

		selectedItem.set({
			type: 'look',
			data: look,
			meta: {
				styleSeasonCode,
				brandCode,
				divisionCode
			}
		});

		console.log('selectedItem after initial set:', $selectedItem);

		try {
			const formData = new FormData();
			formData.append('lookDocKey', look.documentKey);

			const response = await fetch('?/getLookDetails', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log('Result from server:', result);

			if (result) {
				console.log('Fetched additional look details:', result.data);
				debugger
				selectedItem.setLookDetails(result.lookDetails);
				console.log('selectedItem after setting look details:', $selectedItem);
			} else {
				console.error('Failed to fetch look details:', result.error || 'Unknown error');
			}
		} catch (error) {
			console.error('Error fetching look details:', error instanceof Error ? error.message : String(error));
		}
	}


	function handleKeyDown(look: Look, event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleSelect(look, event);
		}
	}

</script>

<!-- Looks Grid -->
<div class="bg-white">
	<div class="max-w-2xl px-4 py-8 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
		{#if data?.looks}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
				{#each data.looks as look, index (look.documentKey)}
					<button
						class="relative group w-full text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						on:click={(event) => handleSelect(look, event)}
						on:keydown={(event) => handleKeyDown(look, event)}
						aria-label={`Select ${look.title}`}
					>
						<div class="overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1 lg:aspect-none lg:h-80 transform-gpu transition-transform duration-300 group-hover:scale-110 opacity-85 group-hover:opacity-100">
							<img src={look.assetUrl} alt={look.title} class="object-cover object-top w-full h-full lg:w-full lg:h-full" />
						</div>
					</button>
				{/each}
			</div>
		{:else if data?.status === 404}
			<div>{data.error}</div>
		{:else if data?.status === 500}
			<div>{data.error}</div>
		{:else}
			<div>Loading...</div>
		{/if}
	</div>
</div>
