<!-- DocumentDisplay.svelte -->
<script lang="ts">
	export let bucket: string;
	export let scope: string;
	export let collection: string;
	export let data: any;
	export let timeTaken: number;

	let isExpanded = false;

	function toggleExpand() {
		isExpanded = !isExpanded;
	}
</script>

<div class="border rounded-md p-4 mb-4">
	<h3 class="font-bold cursor-pointer" on:click={toggleExpand}>
		{bucket}.{scope}.{collection}
		<span class="ml-2">{isExpanded ? '▼' : '►'}</span>
	</h3>
	<p>Time taken: {timeTaken}ms</p>
	{#if isExpanded}
		<div class="mt-2 max-h-60 overflow-y-auto">
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	{/if}
</div>
