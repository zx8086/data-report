<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { goto } from '$app/navigation';

	import { key } from '$lib/context/tracker';
	import { onMount, getContext } from 'svelte';
	const { getTracker } = getContext(key);

	onMount(() => {
		try {
			const tracker = getTracker();
			if (tracker) {
				try {
					tracker.event('Page_View', {
						page: 'Support',
						category: 'Navigation',
						action: 'View'
					});
				} catch (e) {
					tracker.event('Page_View', {
						page: 'Support',
						category: 'Navigation',
						action: 'View',
						error: `Failed -${e}`
					});
				}
			} else {
				console.warn('Tracker not available');
			}
		} catch (error) {
			console.error('Error in onMount:', error);
		}
	});
</script>

<div class="flex flex-col space-y-4 mb-4">
	<button
		class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-64"
		on:click={() => goto('/support/document-search')}
	>
		Document Search
	</button>
	<button
		class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-64"
		on:click={() => goto('/support/check-collection-images')}
	>
		Collection Check
	</button>
	<button
		class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-64"
		on:click={() => goto('/support/check-look-images')}
	>
		Looks Check
	</button>
</div>