<script lang="ts">
	import type { Collection } from './+page.server';

	import posthog from 'posthog-js';
	import { page } from '$app/stores';
	posthog.capture('$pageview')

	const baseUrl = 'https://s7g10.scene7.com/is/image/TommyHilfigerEU';
	export let data: {optionsProductView: Collection[] | null, status?: number, error?: string};

	function handleImageError(event: any) {
		event.target.src = '/img/not-found.png';
		// Prevents the fallback image from triggering an infinite loop if it's also missing
		event.target.onerror = null;
	}

	let styleSeasonCode : any;
	let brandCode : any;
	let divisionCode : any;

	$: {
		if ($page) {
			const pathParts = $page.url.pathname.split('/');
			styleSeasonCode = pathParts[1];
			brandCode = pathParts[2];
			divisionCode = pathParts[3];
			posthog.capture(`Divisional Collection: ${styleSeasonCode}-${brandCode}-${divisionCode}`);
		}
	}

</script>

<div class="bg-white">
	<div class="max-w-2xl px-4 py-8 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
		{#if data?.optionsProductView}
			<div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-5">
				{#each data.optionsProductView as product (product.optionCode)}
					<div class="relative group">
						<div class="overflow-hidden rounded-md mb-3 aspect-w-1 aspect-h-1 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100">
							<img
								src={product.imageUrl ? baseUrl + product.imageUrl : '/img/not-found.png'}
								alt={product.description}
								class="object-contain object-center w-full h-full"
								on:error={handleImageError}
							/>
						</div>
						<div class="option-code font-bold text-sm text-center">{product.optionCode}</div>
						<div class="description text-xs text-center">{product.description}</div>
					</div>
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
