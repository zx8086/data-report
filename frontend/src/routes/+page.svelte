<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import { goto } from '$app/navigation';
	import { onMount, getContext } from 'svelte';
	import { key } from '$lib/context/tracker';
	import { translateCode, seasonTranslations } from '$lib/utils/translations';

	const { getTracker } = getContext(key);

	onMount(() => {
		const tracker = getTracker();
		if (tracker) {
			tracker.event('Page_View', {
				page: 'Home Page',
				category: 'Navigation',
				action: 'View'
			});
		}
	});

	const seasons = Object.entries(seasonTranslations);
</script>

<h1>Data Report</h1>
<div class="flex flex-col space-y-4 my-4">
	{#each seasons as [seasonCode, seasonName]}
		<button
			class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-64"
			on:click={() => goto(`/${seasonCode}/`)}
		>
			{seasonName}
		</button>
	{/each}
	<button
		class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-64"
		on:click={() => goto('/support')}
	>
		Support
	</button>
</div>