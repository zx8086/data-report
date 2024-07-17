<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { key } from '$lib/context/tracker';
	import { onMount, getContext } from 'svelte';

	const { getTracker } = getContext(key);

	// Get the current styleSeasonCode from the page store
	$: currentSeasonCode = $page.params.styleSeasonCode;

	onMount(() => {
		const tracker = getTracker();
		if (tracker) {
			tracker.event('Page_View', {
				page: 'Seasons',
				category: 'Navigation',
				action: 'View'
			});
		}
	});

	function navigateToBrand(brandCode) {
		if (currentSeasonCode) {
			goto(`/${currentSeasonCode}/${brandCode}`);
		} else {
			console.error('No season code available');
			// Handle the case when there's no season code, maybe navigate to a default page or show an error
		}
	}
</script>

<h1>PVH Brands</h1>
<div class="flex flex-col space-y-4 my-4">
	<button
		class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-64"
		on:click={() => navigateToBrand('THEU')}
	>
		Tommy Hilfiger
	</button>
	<button
		class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-64"
		on:click={() => navigateToBrand('CKEU')}
	>
		Calvin Klein
	</button>
</div>