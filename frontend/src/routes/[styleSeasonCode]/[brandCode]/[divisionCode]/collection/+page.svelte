<!--+page.svelte-->
<script lang="ts">
	import type { Collection } from './+page.server';
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';

	if (browser) {
		posthog.capture('$pageview');
	}

	export let data: { optionsProductView: Collection[] };
	let baseUrl = 'https://s7g10.scene7.com/is/image/TommyHilfigerEU';

	function handleImageError(event: Event) {
		const target = event.target as HTMLImageElement;
		target.src = '/static/not-found.png';
		target.onerror = null;
	}

</script>
<div class="bg-white">
	<div class="max-w-2xl px-4 py-8 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
		{#if data?.optionsProductView}
			<div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
				{#each data.optionsProductView as product (product.optionCode)}
					<div class="relative group">
						<div
							class="overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1 lg:aspect-none lg:h-80 group-hover:scale-50 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100">
							<img
								src={baseUrl + (product.imageUrl ?? '/static/path-to-your-placeholder-image.jpg')}
								alt={product.description}
								class="object-cover object-top w-full h-full lg:w-full lg:h-full"
								on:error={handleImageError}
							/>
						</div>
						<div class="option-code text-center">{product.optionCode}</div>
						<div class="description text-center">{product.description}</div>
					</div>
				{/each}
			</div>
		{:else}
			<div>Loading...</div>
		{/if}
	</div>
</div>