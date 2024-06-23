<!-- RightSidebar.svelte -->
<script lang="ts">
	import { selectedItem } from '$lib/stores/selectedItemStore';
	$: console.log('selectedItem in sidebar:', $selectedItem);

</script>

<aside class="w-1/5 bg-green-200 p-4">
	{#if $selectedItem}
		<h2 class="text-xl font-bold mb-2">Additional Info</h2>
		{#if $selectedItem.type === 'collection'}
			<p class="mb-2">Style Season Code: {$selectedItem.meta.styleSeasonCode}</p>
			<p class="mb-2">Brand Code: {$selectedItem.meta.brandCode}</p>
			<p class="mb-2">Division Code: {$selectedItem.meta.divisionCode}</p>
		{:else if $selectedItem.type === 'look'}
			<p class="mb-2">Document Key: {$selectedItem.data.documentKey}</p>
		{/if}
	{:else}
		<p>Select an item to view additional information</p>
	{/if}
</aside>