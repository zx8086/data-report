<!-- LeftSidebar.svelte -->
<script lang="ts">
	import { selectedItem } from '$lib/stores/selectedItemStore';
	import type { SelectedItemType, ImageDetails, LookDetails } from '../types';
	import ProductImage from './ProductImage.svelte';
	import RelatedStylesImage from './RelatedStylesImage.svelte';
	import { onMount, getContext } from 'svelte';
	import { key } from '$lib/context/tracker';
	const { getTracker } = getContext(key);
	let showDebugInfo = false;
	let debugInfo = '';



	onMount(async () => {
		const tracker = getTracker();
		if (tracker) {
			tracker.onFlagsLoad((flags) => {
				const debugFlag = flags.find(flag => flag.key === 'debug-info-collection');
				if (debugFlag) {
					showDebugInfo = debugFlag.value === true;
				}
			});
		}
	});

	const baseUrl = 'https://s7g10.scene7.com/is/image/TommyHilfigerEU';


	function getStyleImageUrl(styleCode: string) {
		if ($selectedItem && $selectedItem.type === 'look' && $selectedItem.lookDetails) {
			const { styleSeasonCodeAfs, divisionCode } = $selectedItem.lookDetails;
			const parts = styleCode.split('_');
			const productCode = parts.length > 1 ? parts[parts.length - 1] : styleCode;
			return `${baseUrl}/${productCode}_F_${styleSeasonCodeAfs}${divisionCode}`;
		}
		return '';
	}

	$: {
		console.log('selectedItem in LeftSidebar:', $selectedItem);
		if ($selectedItem && $selectedItem.type === 'look') {
			console.log('Look data:', $selectedItem.data);
			console.log('Look details:', $selectedItem.lookDetails);
			debugInfo = JSON.stringify($selectedItem, null, 2);
		} else if ($selectedItem && $selectedItem.type === 'collection') {
			console.log('Collection data:', $selectedItem.data);
			console.log('Image details:', $selectedItem.imageDetails);
			debugInfo = JSON.stringify($selectedItem, null, 2);
		} else {
			console.log('No selected item');
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
			<p class="mb-2">Title: {$selectedItem.data.title}</p>
			{#if $selectedItem.data.trend}
				<p class="mb-2">Trend: {$selectedItem.data.trend}</p>
			{/if}
			{#if $selectedItem.lookDetails}
				{#if $selectedItem.lookDetails.relatedStyles && $selectedItem.lookDetails.relatedStyles.length > 0}
					<h3 class="text-lg font-bold mt-4 mb-2">Related Styles</h3>
					<div class="space-y-4">
						{#each $selectedItem.lookDetails.relatedStyles as styleCode}
							<RelatedStylesImage
								src={getStyleImageUrl(styleCode)}
								alt={`Related style ${styleCode}`}
								{styleCode}
							/>
						{/each}
					</div>
				{:else}
					<p>No related styles available</p>
				{/if}
			{/if}
		{/if}
	{:else}
		<p>Select an item to view details</p>
	{/if}
	{#if showDebugInfo}
		<div class="mt-4 p-2 bg-gray-100 rounded max-w-full overflow-x-auto">
			<h4 class="font-bold">Debug Info:</h4>
			<pre class="whitespace-pre-wrap text-xs break-words">{debugInfo}</pre>
		</div>
	{/if}
</aside>