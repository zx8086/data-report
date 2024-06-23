<!-- LeftSidebar.svelte -->
<script lang="ts">
	import { selectedItem } from '$lib/stores/selectedItemStore';
	$: console.log('selectedItem in sidebar:', $selectedItem);

</script>

<aside class="w-1/5 bg-slate-200 p-4">
	{#if $selectedItem}
		{#if $selectedItem.type === 'collection'}
			<h2 class="text-xl font-bold mb-2">Collection Item</h2>
			<p class="mb-2">Option Code: {$selectedItem.data.optionCode}</p>
			<p class="mb-2">Description: {$selectedItem.data.description}</p>
		{:else if $selectedItem.type === 'look'}
			<h2 class="text-xl font-bold mb-2">{$selectedItem.data.title}</h2>
			<p class="mb-2">Type: {$selectedItem.data.lookType}</p>
		{/if}
	{:else}
		<p>Select an item to view details</p>
	{/if}
</aside>