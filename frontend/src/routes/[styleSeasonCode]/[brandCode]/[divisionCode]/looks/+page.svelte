<script lang="ts">
	import type { Look } from '$lib/types';
	export let data: { looks: Look[] };
</script>

<div class="bg-white">
	<div class="max-w-2xl px-4 py-8 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
			{#each data.looks as look (look.documentKey)}
				<div class="relative group">
					<div
						class="overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1 lg:aspect-none lg:h-80 transform-gpu transition-transform duration-300 group-hover:scale-110 opacity-85 group-hover:opacity-100">
						{#if look.lookType === '11'}
							<video
								src={look.assetUrl}
								controls
								muted
								class="object-cover object-top w-full h-full lg:w-full lg:h-full"
							/>
						{:else}
							<img
								src={look.assetUrl}
								alt={look.title}
								class="object-cover object-top w-full h-full lg:w-full lg:h-full"
							/>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
