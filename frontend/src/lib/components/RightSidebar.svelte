<!-- RightSidebar.svelte -->
<script lang="ts">
	import { selectedItem } from '$lib/stores/selectedItemStore';
</script>

<aside class="w-1/5 bg-green-200 p-4 overflow-y-auto h-screen">
	{#if $selectedItem}
		<h2 class="text-xl font-bold mb-2">Additional Info</h2>
		<p class="mb-2">Style Season Code: {$selectedItem.meta.styleSeasonCode}</p>
		<p class="mb-2">Brand Code: {$selectedItem.meta.brandCode}</p>
		<p class="mb-2">Division Code: {$selectedItem.meta.divisionCode}</p>

		{#if $selectedItem.type === 'collection'}
			<p class="mb-2">Option Code: {$selectedItem.data.optionCode}</p>
			<p class="mb-2">Description: {$selectedItem.data.description}</p>
		{:else if $selectedItem.type === 'look'}
			<p class="mb-2">Document Key: {$selectedItem.data.documentKey}</p>
			{#if $selectedItem.lookDetails}
				<p class="mb-2">Brand: {$selectedItem.lookDetails.brand}</p>
				<p class="mb-2">Created On: {$selectedItem.lookDetails.createdOn}</p>
				<p class="mb-2">Modified On: {$selectedItem.lookDetails.modifiedOn}</p>
				<p class="mb-2">Processed On: {$selectedItem.lookDetails.processedOn}</p>
				<p class="mb-2">Look Type: {$selectedItem.lookDetails.lookType}</p>
				<p class="mb-2">Position: {$selectedItem.lookDetails.position}</p>

			{/if}
		{/if}
	{:else}
		<p>Select an item to view additional information</p>
	{/if}
</aside>

<!--assetUrl-->
<!--brand-->
<!--channels-->
<!--createdOnSourceSystem-->
<!--deliveryName-->
<!--description-->
<!--documentUpdatedBy-->
<!--gender-->
<!--lookId-->
<!--modifiedOnSourceSystem-->
<!--nuxeoId-->
<!--relatedStyles-->
<!--sourceSystem-->
<!--styleSeasonCodeAfs-->
<!--tag-->
<!--title-->
<!--trend-->