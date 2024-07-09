<script>
	/** @type {import('../../../.svelte-kit/types/src/routes').PageData} */

	import { key } from '$lib/context/tracker';
	import { onMount, getContext } from 'svelte';

	const { getTracker } = getContext(key);

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
</script>
Videos -> TH / CK