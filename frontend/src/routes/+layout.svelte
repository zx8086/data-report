<!--+layout.svelte-->
<script lang="ts">
	import "../app.css";
	import Breadcrumbs from "$lib/components/Breadcumbs.svelte";
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import RightSidebar from '$lib/components/RightSidebar.svelte';
</script>

<div class="flex h-screen overflow-hidden">
	<LeftSidebar/>

	<main class="flex-grow overflow-y-auto">
		<Breadcrumbs />
		<slot />
	</main>

	<RightSidebar />
</div>