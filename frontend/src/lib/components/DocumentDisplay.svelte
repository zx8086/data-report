<!-- DocumentDisplay.svelte -->
<script lang="ts">
	export let bucket: string = '';
	export let scope: string = '';
	export let collection: string = '';
	export let data: any = null;
	export let timeTaken: number = 0;

	let isExpanded = false;

	function toggleExpand() {
		isExpanded = !isExpanded;
	}
</script>

<div class="border rounded-md p-4 mb-4">
	<h3 class="font-bold cursor-pointer" on:click={toggleExpand}>
		{bucket || 'Unknown'}.{scope || 'Unknown'}.{collection || 'Unknown'}
		<span class="ml-2">{isExpanded ? '▼' : '►'}</span>
	</h3>
	<p>Time taken: {timeTaken !== undefined ? `${timeTaken}ms` : 'Unknown'}</p>
	{#if isExpanded}
		<div class="mt-2 max-h-60 overflow-y-auto">
			{#if data !== null && data !== undefined}
				<pre>{JSON.stringify(data, null, 2)}</pre>
			{:else}
				<p>No data found in this collection.</p>
			{/if}
		</div>
	{/if}
</div>