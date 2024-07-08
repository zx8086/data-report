<!-- LeftSidebar.svelte -->
<script lang="ts">
	import { selectedItem } from '$lib/stores/selectedItemStore';
	import ProductImage from './ProductImage.svelte';

	let debugInfo = '';
	let imageUrlInfo = '';
	const baseUrl = 'https://s7g10.scene7.com/is/image/TommyHilfigerEU';

	$: {
		console.log('selectedItem in sidebar:', $selectedItem);
		if ($selectedItem && $selectedItem.type === 'collection') {
			console.log('Collection data:', $selectedItem.data);
			console.log('Image details:', $selectedItem.imageDetails);
			debugInfo = JSON.stringify($selectedItem, null, 2);
			// imageUrlInfo = $selectedItem.imageDetails ? JSON.stringify($selectedItem.imageDetails, null, 2) : 'No image details';
		} else {
			console.log('No selected item or not a collection');
			debugInfo = 'No selected item';
			// imageUrlInfo = 'No image details';
		}
	}

	$: imageUrls = $selectedItem && $selectedItem.type === 'collection' && $selectedItem.imageDetails
		? [
			{ type: 'front', url: $selectedItem.imageDetails.frontUrl, modifiedDate: $selectedItem.imageDetails.frontModifiedOn },
			{ type: 'back', url: $selectedItem.imageDetails.backUrl, modifiedDate: $selectedItem.imageDetails.backModifiedOn },
			{ type: 'detail', url: $selectedItem.imageDetails.detailUrl, modifiedDate: $selectedItem.imageDetails.detailModifiedOn },
			{ type: 'inside', url: $selectedItem.imageDetails.insideUrl, modifiedDate: $selectedItem.imageDetails.insideModifiedOn },
			{ type: 'fabric Scan', url: $selectedItem.imageDetails.fabricScanUrl, modifiedDate: $selectedItem.imageDetails.fabricScanModifiedOn },
			{ type: 'package', url: $selectedItem.imageDetails.packageUrl, modifiedDate: $selectedItem.imageDetails.packageModifiedOn },
			{ type: 'sketch', url: $selectedItem.imageDetails.sketchUrl, modifiedDate: $selectedItem.imageDetails.sketchModifiedOn },
			{ type: 'i360', url: $selectedItem.imageDetails.i360Url, modifiedDate: $selectedItem.imageDetails.i360ModifiedOn },
			{ type: 'front 2', url: $selectedItem.imageDetails.front2Url, modifiedDate: $selectedItem.imageDetails.front2ModifiedOn },
			{ type: 'back 2', url: $selectedItem.imageDetails.back2Url, modifiedDate: $selectedItem.imageDetails.back2ModifiedOn },
			{ type: 'detail 2', url: $selectedItem.imageDetails.detail2Url, modifiedDate: $selectedItem.imageDetails.detail2ModifiedOn },
			{ type: 'inside 2', url: $selectedItem.imageDetails.inside2Url, modifiedDate: $selectedItem.imageDetails.inside2ModifiedOn },
			{ type: 'detail 3', url: $selectedItem.imageDetails.detail3Url, modifiedDate: $selectedItem.imageDetails.detail3ModifiedOn },
		].filter(img => img.url)
		: [];
</script>

<aside class="w-1/5 bg-slate-200 p-4 overflow-y-auto h-screen">
	{#if $selectedItem && $selectedItem.type === 'collection'}
		<h2 class="text-xl font-bold mb-2">Collection Item</h2>
		<p class="mb-2">Option Code: {$selectedItem.data.optionCode}</p>
		<p class="mb-2">Description: {$selectedItem.data.description}</p>
		{#if imageUrls.length > 0}
			<h3 class="text-lg font-bold mt-4 mb-2">Images</h3>
			{#each imageUrls as { type, url, modifiedDate }}
				<ProductImage
					src={`${baseUrl}${url}`}
					alt={`${type} view`}
					{type}
					{modifiedDate}
				/>
			{/each}
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

<!--	<div class="mt-4 p-2 bg-gray-100 rounded">-->
<!--		<h4 class="font-bold">Image Url Info:</h4>-->
<!--		<pre class="whitespace-pre-wrap text-xs">{imageUrlInfo}</pre>-->
<!--	</div>-->
</aside>