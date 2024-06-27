<!--+layout.svelte-->
<script lang="ts">
	import "../app.css";
	import Breadcrumbs from "$lib/components/Breadcumbs.svelte";
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import RightSidebar from '$lib/components/RightSidebar.svelte';
	// import { key } from "$lib/context/tracker"
	// import { onMount, setContext } from "svelte";
	//
	// let Tracker;
	//
	// onMount(async () => {
	// 	if (typeof window !== undefined) {
	// 		Tracker = (await import("$lib/context/tracker")).Tracker;
	// 	}
	//
	// 	let tracker;
	//
	// 	if(Tracker) {
	// 		tracker = new Tracker({
	// 			projectKey: "XULAx3Gt1QjSuNsrm586",
	// 			ingestPoint: "ingestPoint"
	// 		});
	//
	// 		setContext(key, tracker);
	//
	// 		tracker.start();
	// 		tracker.setUserID('');
	// 	}
	// });
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
