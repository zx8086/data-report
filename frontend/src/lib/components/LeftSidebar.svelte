<!-- LeftSidebar.svelte -->
<script lang="ts">
	import { selectedItem } from '$lib/stores/selectedItemStore';
	import type { SelectedItemType, ImageDetails, LookDetails } from '../types';

	import ProductImage from './ProductImage.svelte';
	import { onMount, getContext } from 'svelte';
	import { key } from '$lib/context/tracker';

	let debugInfo = '';
	const baseUrl = 'https://s7g10.scene7.com/is/image/TommyHilfigerEU';
	const { getTracker } = getContext(key);
	let showDebugInfo = false;

	onMount(async () => {
		const tracker = getTracker();
		if (tracker) {
			tracker.onFlagsLoad((flags) => {
				const debugFlag = flags.find(flag => flag.key === 'debug-info-collection');
				if (debugFlag) {
					showDebugInfo = debugFlag.value === true;
				}
			});
			// Optionally, you can reload flags if needed
			// await tracker.reloadFlags();
		}
	});

	function getStyleImageUrl(styleCode: string) {
		if ($selectedItem) {
			const { styleSeasonCode, divisionCode } = $selectedItem.meta;
			const parts = styleCode.split('_');
			const productCode = parts.length > 1 ? parts[parts.length - 1] : styleCode;
			const url = `${baseUrl}/${productCode}_F_${styleSeasonCode}${divisionCode}`;
			console.log('Constructed style image URL:', url);
			return url;
		}
		console.log('Unable to construct style image URL: no selected item');
		return '';
	}

	$: {
		console.log('selectedItem in left sidebar:', $selectedItem);
		if ($selectedItem && $selectedItem.type === 'look') {
			console.log('Look data:', $selectedItem.data);
			console.log('Related styles:', $selectedItem.data.relatedStyles);
			console.log('Related styles type:', typeof $selectedItem.data.relatedStyles);
			console.log('Related styles length:', $selectedItem.data.relatedStyles?.length);
		}
	}

	$: {
		console.log('selectedItem in sidebar:', $selectedItem);
		if ($selectedItem && $selectedItem.type === 'collection') {
			console.log('Collection data:', $selectedItem.data);
			console.log('Image details:', $selectedItem.imageDetails);
			debugInfo = JSON.stringify($selectedItem, null, 2);
		} else {
			console.log('No selected item or not a collection');
			debugInfo = 'No selected item';
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
	{#if $selectedItem}
		{#if $selectedItem.type === 'collection'}
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
		{:else if $selectedItem.type === 'look'}
			<h2 class="text-xl font-bold mb-2">Look Details</h2>
			{#if $selectedItem.data.trend}
				<p class="mb-2">Trend: {$selectedItem.data.trend}</p>
			{/if}
			<h3 class="text-lg font-bold mt-4 mb-2">Related Styles</h3>
			{#if Array.isArray($selectedItem.data.relatedStyles) && $selectedItem.data.relatedStyles.length > 0}
				<div class="grid grid-cols-2 gap-2">
					{#each $selectedItem.data.relatedStyles as styleCode}
						{console.log('Processing styleCode:', styleCode)}
						<div class="text-center">
							<img
								src={getStyleImageUrl(styleCode)}
								alt={styleCode}
								class="w-full h-auto object-cover mb-1"
							/>
							<p class="text-xs">{styleCode.split('_').pop()}</p>
						</div>
					{/each}
				</div>
			{:else}
				<p>No related styles available</p>
				{console.log('No related styles found in selectedItem:', $selectedItem)}
			{/if}
		{/if}
	{:else}
		<p>Select an item to view details</p>
	{/if}
	{#if showDebugInfo}
		<div class="mt-4 p-2 bg-gray-100 rounded">
			<h4 class="font-bold">Debug Info:</h4>
			<pre class="whitespace-pre-wrap text-xs">{debugInfo}</pre>
		</div>
	{/if}
</aside>