<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { key } from '$lib/context/tracker';

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

</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
