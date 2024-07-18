<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import DocumentDisplay from '$lib/components/DocumentDisplay.svelte';
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
			try {
				tracker.event('Page_View', {
					page: `Document Search`,
					category: 'Navigation',
					action: 'View'
				});
			} catch (e) {
				console.error('Error:', e);
				tracker.event('Page_View', {
					page: `Document Search`,
					category: 'Navigation',
					action: 'View',
					error: `Failed -${e}`
				});
			}
		}
	});

	let documentKey = '';
	let searchResults = [];
	let processing = false;
	let errorMessage = '';

	const allCollections = [
		{ bucket: "default", scope: "seasons", collection: "dates" },
		{ bucket: "default", scope: "seasons", collection: "dates_import" },
		{ bucket: "default", scope: "seasons", collection: "delivery_dates_import" },
		{ bucket: "default", scope: "seasons", collection: "delivery_dates" },
		{ bucket: "default", scope: "brands_divisions", collection: "brands_divisions" },
		{ bucket: "default", scope: "media_assets", collection: "look_items" },
		{ bucket: "default", scope: "media_assets", collection: "images" },
		{ bucket: "default", scope: "styles", collection: "article" },
		{ bucket: "default", scope: "styles", collection: "variant" },
		{ bucket: "default", scope: "styles", collection: "prepacks" },
		{ bucket: "default", scope: "styles", collection: "distribution_curves" },
		{ bucket: "default", scope: "styles", collection: "product2g" },
		{ bucket: "default", scope: "customer", collection: "assignments" },
		{ bucket: "default", scope: "customer", collection: "sales-organizations" },
		{ bucket: "default", scope: "customer", collection: "customers" },
		{ bucket: "default", scope: "_default", collection: "_default" },
		{ bucket: "default", scope: "_default", collection: "data_merge_check" },
		{ bucket: "default", scope: "prices", collection: "prices" },
		{ bucket: "prices", scope: "_default", collection: "_default" }
	];

	let selectedCollections = allCollections;

	function handleSubmit(event) {
		processing = true;
		errorMessage = '';
		searchResults = [];

		return async ({ result }) => {
			console.log("Form submission result:", result);
			if (result.type === 'success') {
				try {
					const data = result.data;
					console.log("Received data:", data);
					if (data && data.data && data.data.searchDocuments) {
						searchResults = data.data.searchDocuments;
						console.log("Search results:", searchResults);
					} else {
						errorMessage = "Unexpected response structure";
					}
				} catch (e) {
					console.error("Error processing server response:", e);
					errorMessage = "Error processing server response: " + e.message;
				}
			} else if (result.type === 'error') {
				errorMessage = result.error;
			}
			processing = false;
		};
	}

	function toggleCollection(collection) {
		selectedCollections = selectedCollections.includes(collection)
			? selectedCollections.filter(c => c !== collection)
			: [...selectedCollections, collection];
	}

	function selectAllCollections() {
		selectedCollections = [...allCollections];
	}

	function deselectAllCollections() {
		selectedCollections = [];
	}
</script>

<form use:enhance={handleSubmit} method="POST" action="?/searchDocuments" class="max-w-3xl mx-auto">
	<div class="mb-4">
		<label for="documentKey" class="block mb-2">Document Key:</label>
		<input
			type="text"
			id="documentKey"
			name="documentKey"
			bind:value={documentKey}
			class="w-full p-2 border rounded"
		/>
	</div>

	<div class="mb-4">
		<h3 class="mb-2">Select Collections:</h3>
		<button type="button" on:click={selectAllCollections} class="mr-2 px-2 py-1 bg-blue-500 text-white rounded">Select All</button>
		<button type="button" on:click={deselectAllCollections} class="px-2 py-1 bg-blue-500 text-white rounded">Deselect All</button>
		{#each allCollections as collection}
			<label class="block">
				<input
					type="checkbox"
					checked={selectedCollections.includes(collection)}
					on:change={() => toggleCollection(collection)}
				/>
				{collection.bucket}.{collection.scope}.{collection.collection}
			</label>
		{/each}
	</div>

	<input type="hidden" name="collections" value={JSON.stringify(selectedCollections)} />

	<button type="submit" disabled={processing} class="w-full py-2 px-4 bg-blue-500 text-white rounded-md cursor-pointer">
		{processing ? 'Searching...' : 'Search'}
	</button>
</form>

{#if errorMessage}
	<p class="text-red-600 mt-4">{errorMessage}</p>
{/if}

{#if searchResults.length > 0}
	<h2 class="mt-4 mb-2">Search Results:</h2>
	{#each searchResults as result}
		<DocumentDisplay
			bucket={result.bucket}
			scope={result.scope}
			collection={result.collection}
			data={result.data}
			timeTaken={result.timeTaken}
			{documentKey}
		/>
	{/each}
{:else if !processing && documentKey}
	<p class="mt-4">No results found for the given document key.</p>
{/if}

{#if showDebugInfo}
<div class="mt-4">
	<h3>Debug Information:</h3>
	<pre>{JSON.stringify({ processing, errorMessage, searchResults }, null, 2)}</pre>
</div>
{/if}