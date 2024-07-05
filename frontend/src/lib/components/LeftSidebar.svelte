<!-- LeftSidebar.svelte -->
<script lang="ts">
	import { selectedItem } from '$lib/stores/selectedItemStore';
	import { onMount } from 'svelte';

	let debugInfo = '';
	let imageUrlInfo = '';
	const baseUrl = 'https://s7g10.scene7.com/is/image/TommyHilfigerEU';


	$: console.log("Look Here", $selectedItem)


	$: {
		console.log('selectedItem in sidebar:', $selectedItem);
		if ($selectedItem && $selectedItem.type === 'collection') {
			console.log('Collection data:', $selectedItem.data);
			console.log('Image details:', $selectedItem.imageDetails);
			debugInfo = JSON.stringify($selectedItem, null, 2);
			imageUrlInfo = $selectedItem.imageDetails ? JSON.stringify($selectedItem.imageDetails, null, 2) : 'No image details';
		} else {
			console.log('No selected item or not a collection');
			debugInfo = 'No selected item';
			imageUrlInfo = 'No image details';
		}
	}

	onMount(() => {
		console.log('LeftSidebar mounted, initial selectedItem:', $selectedItem);
	});

	function handleImageError(e: Event, type: string) {
		console.error(`Error loading ${type} image:`, e);
		(e.target as HTMLImageElement).src = '/img/not-found.png';
	}
</script>

<aside class="w-1/5 bg-slate-200 p-4 overflow-y-auto h-screen">
	{#if $selectedItem && $selectedItem.type === 'collection'}
		<h2 class="text-xl font-bold mb-2">Collection Item</h2>
		<p class="mb-2">Option Code: {$selectedItem.data.optionCode}</p>
		<p class="mb-2">Description: {$selectedItem.data.description}</p>
		{#if $selectedItem.imageDetails}
			<h3 class="text-lg font-bold mt-4 mb-2">Images</h3>
			{#if $selectedItem.imageDetails.frontUrl}
				<img
					src={`${baseUrl}${$selectedItem.imageDetails.frontUrl}`}
					alt="Front view"
					class="w-full mb-2"
					on:error={(e) => handleImageError(e, 'front')}
				/>
			{/if}
			{#if $selectedItem.imageDetails.backUrl}
				<img
					src={`${baseUrl}${$selectedItem.imageDetails.backUrl}`}
					alt="Back view"
					class="w-full mb-2"
					on:error={(e) => handleImageError(e, 'back')}
				/>
			{/if}
			{#if $selectedItem.imageDetails.detailUrl}
				<img
					src={`${baseUrl}${$selectedItem.imageDetails.detailUrl}`}
					alt="Detail view"
					class="w-full mb-2"
					on:error={(e) => handleImageError(e, 'detail')}
				/>
			{/if}
			{#if $selectedItem.imageDetails.front2Url}
				<img
					src={`${baseUrl}${$selectedItem.imageDetails.front2Url}`}
					alt="Front 2 view"
					class="w-full mb-2"
					on:error={(e) => handleImageError(e, 'front2')}
				/>
			{/if}
			{#if $selectedItem.imageDetails.back2Url}
				<img
					src={`${baseUrl}${$selectedItem.imageDetails.back2Url}`}
					alt="Back 2 view"
					class="w-full mb-2"
					on:error={(e) => handleImageError(e, 'back2')}
				/>
			{/if}
			{#if $selectedItem.imageDetails.detail2Url}
				<img
					src={`${baseUrl}${$selectedItem.imageDetails.detail2Url}`}
					alt="Detail 2 view"
					class="w-full mb-2"
					on:error={(e) => handleImageError(e, 'detail2')}
				/>
			{/if}
			{#if $selectedItem.imageDetails.detail3Url}
				<img
					src={`${baseUrl}${$selectedItem.imageDetails.detail3Url}`}
					alt="Detail 3 view"
					class="w-full mb-2"
					on:error={(e) => handleImageError(e, 'detail3')}
				/>
			{/if}
		{:else}
			<p>No image details available</p>
		{/if}
	{:else}
		<p>Select an item to view details</p>
	{/if}

	<div class="mt-4 p-2 bg-gray-100 rounded">
		<h4 class="font-bold">Debug Info:</h4>
		<pre class="whitespace-pre-wrap text-xs">{debugInfo}</pre>
	</div>

	<div class="mt-4 p-2 bg-gray-100 rounded">
		<h4 class="font-bold">Image Url Info:</h4>
		<pre class="whitespace-pre-wrap text-xs">{imageUrlInfo}</pre>
	</div>
</aside>