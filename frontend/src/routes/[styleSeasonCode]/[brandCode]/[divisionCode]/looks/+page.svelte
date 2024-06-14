<script lang="ts">
	import type { Look } from '$lib/types';
	import posthog from 'posthog-js';
	posthog.capture('$pageview')
	export let data: { looks: Look[] | null, status?: number, error?: string };
</script>

<div class="bg-white">
	<div class="max-w-2xl px-4 py-8 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
		{#if data?.looks}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
				{#each data.looks as look (look.documentKey)}
					<div class="relative group">
						<div
							class="overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1 lg:aspect-none lg:h-80 transform-gpu transition-transform duration-300 group-hover:scale-110 opacity-85 group-hover:opacity-100">
							{#if look.lookType === '11'}
								<video
									autoplay
									loop
									muted
									playsinline
									class="object-cover object-top w-full h-full lg:w-full lg:h-full"
									onerror={event => console.log("Video error", event.target.error)}
								>
									<source src={`${look.assetUrl}_C5101.mp4`} type="video/mp4">
									Sorry, your browser doesn't support embedded videos.
								</video>
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
		{:else if data?.status === 404}
			<div>{data.error}</div>
		{:else if data?.status === 500}
			<div>{data.error}</div>
		{:else}
			<div>Loading...</div>
		{/if}
	</div>
</div>