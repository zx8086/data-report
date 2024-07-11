<!-- RightSidebar.svelte -->
<script lang="ts">
	import { selectedItem } from '$lib/stores/selectedItemStore';
	$: console.log('selectedItem in sidebar:', $selectedItem);
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
			{#if $selectedItem.data.relatedStyles}
				<p class="mb-2">Related Styles: {$selectedItem.data.relatedStyles.join(', ')}</p>
			{/if}
			<p class="mb-2">Look Type: {$selectedItem.data.lookType}</p>
			{#if $selectedItem.data.gender}
				<p class="mb-2">Gender: {$selectedItem.data.gender}</p>
			{/if}
			{#if $selectedItem.data.createdOn}
				<p class="mb-2">Created On: {$selectedItem.data.createdOn}</p>
			{/if}
			{#if $selectedItem.data.modifiedOn}
				<p class="mb-2">Modified On: {$selectedItem.data.modifiedOn}</p>
			{/if}
			{#if $selectedItem.data.channels}
				<p class="mb-2">Channels: {$selectedItem.data.channels.join(', ')}</p>
			{/if}
		{/if}
	{:else}
		<p>Select an item to view additional information</p>
	{/if}
</aside>