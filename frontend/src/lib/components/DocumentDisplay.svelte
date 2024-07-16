<!-- DocumentDisplay.svelte -->
<script lang="ts">
	export let bucket: string | null = null;
	export let scope: string | null = null;
	export let collection: string | null = null;
	export let data: any = null;
	export let timeTaken: number | null = null;

	let isExpanded = false;

	function toggleExpand() {
		isExpanded = !isExpanded;
	}

	$: hasData = data !== null && Object.keys(data).length > 0;
</script>

<div class="border rounded-md p-4 mb-4 ml-32 mr-32 relative">
	{#if hasData}
    <span class="absolute -top-1 -right-1 flex h-3 w-3">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
    </span>
	{/if}
	<h3 class="font-bold cursor-pointer" on:click={toggleExpand}>
    <span class={hasData ? "text-green-600" : ""}>
      {bucket || 'Unknown'}.{scope || 'Unknown'}.{collection || 'Unknown'}
    </span>
		<span class="ml-2">{isExpanded ? '▼' : '►'}</span>
	</h3>
	<p>Time taken: {timeTaken !== null ? `${timeTaken}ms` : 'Unknown'}</p>
	{#if isExpanded}
		<div class="mt-2 h-[75vh] overflow-y-auto"> <!-- Changed this line -->
			{#if hasData}
				<pre class="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
			{:else}
				<p>No data found in this collection.</p>
			{/if}
		</div>
	{/if}
</div>