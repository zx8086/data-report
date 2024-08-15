<!--frontend/src/routes/support/document-search/+page.svelte-->

<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import DocumentDisplay from '$lib/components/DocumentDisplay.svelte';
	import { onMount, getContext } from 'svelte';
	import { key } from '$lib/context/tracker';
	import { getCollections } from '$lib/collectionManager';

	const { getTracker } = getContext(key);
	let showDebugInfo = false;
	let debugInfo = '';

	let documentKey = '';
	let searchResults = [];
	let processing = false;
	let errorMessage = '';
	let searchPerformed = false;

	let allCollections: { bucket: string; scope_name: string; collection_name: string; }[] = [];
	let selectedCollections: { bucket: string; scope_name: string; collection_name: string; }[] = [];

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

		try {
			allCollections = await getCollections();
			selectedCollections = [...allCollections];
		} catch (error) {
			console.error('Error fetching collections:', error);
			errorMessage = 'Failed to fetch collections. Please try again later.';
		}
	});

	function handleSubmit(event) {
		processing = true;
		errorMessage = '';
		searchResults = [];
		searchPerformed = true;

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

	function toggleCollection(collection: { bucket: string; scope_name: string; collection_name: string; }) {
		const index = selectedCollections.findIndex(c =>
			c.bucket === collection.bucket && c.scope_name === collection.scope_name && c.collection_name === collection.collection_name
		);

		if (index !== -1) {
			selectedCollections = selectedCollections.filter((_, i) => i !== index);
		} else {
			selectedCollections = [...selectedCollections, collection];
		}
	}

	function selectAllCollections() {
		selectedCollections = [...allCollections];
	}

	function deselectAllCollections() {
		selectedCollections = [];
	}

	$: isSelected = (collection: { bucket: string; scope_name: string; collection_name: string; }) => {
		return selectedCollections.some(c =>
			c.bucket === collection.bucket && c.scope_name === collection.scope_name && c.collection_name === collection.collection_name
		);
	};
</script>

<form use:enhance={handleSubmit} method="POST" action="?/searchDocuments" class="max-w-3xl mx-auto">
	<div class="mb-4">
		<label for="documentKey" class="block mb-2">Document Key:</label>
		<input
			type="text"
			id="documentKey"
			name="documentKey"
			bind:value={documentKey}
			on:input={() => { searchPerformed = false; }}
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
					checked={isSelected(collection)}
					on:change={() => toggleCollection(collection)}
				/>
				{collection.bucket}.{collection.scope_name}.{collection.collection_name}
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
{:else if !processing && documentKey && searchPerformed}
	<p class="mt-4">No results found for the given document key.</p>
{/if}

{#if showDebugInfo}
	<div class="mt-4">
		<h3>Debug Information:</h3>
		<pre>{JSON.stringify({ processing, errorMessage, searchResults, allCollections, selectedCollections }, null, 2)}</pre>
	</div>
{/if}