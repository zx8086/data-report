<!--+layout.svelte-->
<script lang="ts">
	import "../app.css";
	// import config from '../config'
	import posthog from 'posthog-js'
	// posthog.init(config.postHog.API_KEY, { api_host: config.postHog.API_HOST })
	// posthog.capture('$pageview')

	import Breadcrumbs from "$lib/components/Breadcumbs.svelte";
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import RightSidebar from '$lib/components/RightSidebar.svelte';

</script>

<div class="flex flex-col h-screen">
	<div class="flex flex-row justify-between flex-grow">
		<LeftSidebar/>

		<main class="w-3/5">
			<Breadcrumbs />
			<slot />
		</main>

		<RightSidebar />
	</div>
</div>
