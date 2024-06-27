<!--+page.svelte(Looks)-->
<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import type { Look } from '$lib/types';


	export let data: { looks: Look[] | null, status?: number, error?: string };

	function handleSelect(look: Look) {
		$page.data.activeLook = look;
	}
</script>

<div class="bg-white">
	<div class="max-w-2xl px-4 py-8 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
		{#if data?.looks}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
				{#each data.looks as look, index (look.documentKey)}
					<div
						role="button"
						tabindex="0"
						on:click={() => handleSelect(look)}
						on:keydown={(event) => { if (event.key === 'Enter') handleSelect(look) }}
						class="relative group">
						<div class="overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1 lg:aspect-none lg:h-80 transform-gpu transition-transform duration-300 group-hover:scale-110 opacity-85 group-hover:opacity-100">
							{#if look.lookType === '11'}
								<video controls autoplay muted loop playsinline>
									<source src={`${look.assetUrl}`} type="video/mp4" />
									<track kind="captions" src="path/to/your/captions.vtt" srclang="en" />
								</video>
							{:else}
								<img src={look.assetUrl} alt={look.title} class="object-cover object-top w-full h-full lg:w-full lg:h-full" />
							{/if}
						</div>
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
