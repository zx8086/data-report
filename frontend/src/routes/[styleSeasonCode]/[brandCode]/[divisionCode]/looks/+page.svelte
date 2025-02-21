<!--+page.svelte(Looks)-->
<script lang="ts">
	import { page } from '$app/stores';
	import type { Look, LookDetails } from '$lib/types';
	import { selectedItem } from '$lib/stores/selectedItemStore';
	import { key } from '$lib/context/tracker';
	import { onMount, getContext } from 'svelte';
	import { translateCode, translatePath } from '$lib/utils/translations';
	import { collectionStore } from '$lib/stores/collectionStore';

	export let data: { looks: Look[] | null, status?: number, error?: string };

	const { getTracker } = getContext(key);

	$: if (data?.looks) {
		console.log('Setting collection store with:', data.looks.length, 'items');
		// collectionStore.set(data.looks);
	}

	function initializeVideoJS(element: HTMLVideoElement) {
		if (typeof videojs !== 'undefined') {
			videojs(element, {
				controls: true,
				autoplay: true,
				muted: true,
				preload: 'auto'
			});
		}
	}

	function handleImageError(event: any) {
		event.target.src = '/img/not-found.png';
		event.target.onerror = null;
	}

	function normalizeArray(value: any[] | any | null): any[] {
		if (Array.isArray(value)) {
			return value;
		} else if (value !== null && value !== undefined) {
			return [value];
		} else {
			return [];
		}
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

		// Initialize Video.js for all video elements
		document.querySelectorAll('.video-js').forEach((videoElement) => {
			initializeVideoJS(videoElement as HTMLVideoElement);
		});
	});

	async function handleSelect(look: Look, event: Event | KeyboardEvent) {
		event.preventDefault();
		console.log('handleSelect called with look:', look);

		// Set initial look data
		selectedItem.set({
			type: 'look',
			data: look,
			meta: {
				styleSeasonCode,
				brandCode,
				divisionCode
			},
			isVideo: [9, 10, 11, 12, 13, 14, 16].includes(Number(look.lookType))
		});

		console.log('selectedItem after initial set:', $selectedItem);

		const formData = new FormData();
		formData.append('lookDocKey', look.documentKey);

		try {
			const response = await fetch('?/getLookDetails', {
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
				// The look details structure is in the third element of the array
				const lookDetailsStructure = parsedData[2];
				// The actual values start from the fourth element
				const values = parsedData.slice(3);

				const lookDetails = Object.fromEntries(
					Object.entries(lookDetailsStructure).map(([key, index]) => {
						if (key === 'relatedStyles' || key === 'channels') {
							// Extract the actual values for relatedStyles and channels
							const indices = values[Number(index as any) - 3];
							return [key, Array.isArray(indices) ? indices.map((idx: number) => values[idx - 3]) : []];
						}
						return [key, values[Number(index as any) - 3]];
					})
				);

				console.log('Parsed look details:', lookDetails);

				// Use the normalization function for both relatedStyles and channels
				lookDetails.relatedStyles = normalizeArray(lookDetails.relatedStyles);
				lookDetails.channels = normalizeArray(lookDetails.channels);

				// debugger
				selectedItem.setLookDetails(lookDetails);

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
				{#each data.looks as look (look.documentKey)}
					<button
						class="relative group w-full text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						on:click={(event) => handleSelect(look, event)}
						on:keydown={(event) => handleKeyDown(look, event)}
						aria-label={`Select ${look.title}`}
					>
						<div class="overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1 lg:aspect-none lg:h-80 transform-gpu transition-transform duration-300 group-hover:scale-110 opacity-85 group-hover:opacity-100">
							{#if [9, 10, 11, 12, 13, 14, 16].includes(Number(look.lookType))}
								<video
									class="video-js vjs-default-skin object-cover object-top w-full h-full lg:w-full lg:h-full"
									controls
									autoplay
									muted
									preload="auto"
									width="100%"
									height="100%"
									poster={look.assetUrl}
									data-setup="{{}}"
								>
									<source src={look.assetUrl} type="video/mp4" />
									<p class="vjs-no-js">
										To view this video please enable JavaScript, and consider upgrading to a
										web browser that
										<a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
									</p>
								</video>
							{:else}
								<img
									src={look.assetUrl}
									alt={look.title}
									class="object-cover object-top w-full h-full lg:w-full lg:h-full"
									on:error={handleImageError}
								/>
							{/if}
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