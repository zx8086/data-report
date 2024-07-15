<!-- +page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { writable } from 'svelte/store';
	import DocumentDisplay from '$lib/components/DocumentDisplay.svelte';

	export let form: ActionData;

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
		{ bucket: "prices", scope: "_default", collection: "_default" }
	];

	let selectedCollections = writable(allCollections);

	function toggleCollection(collection) {
		selectedCollections.update(cols => {
			const index = cols.findIndex(c =>
				c.bucket === collection.bucket &&
				c.scope === collection.scope &&
				c.collection === collection.collection
			);
			if (index > -1) {
				cols.splice(index, 1);
			} else {
				cols.push(collection);
			}
			return cols;
		});
	}

	function selectAllCollections() {
		selectedCollections.set([...allCollections]);
	}

	function deselectAllCollections() {
		selectedCollections.set([]);
	}

	async function handleSubmit(event) {
		processing = true;
		errorMessage = '';
		searchResults = [];

		const form = event.target;
		const formData = new FormData(form);
		formData.set('collections', JSON.stringify($selectedCollections));
		formData.set('keys', JSON.stringify([documentKey]));

		try {
			const response = await fetch('?/searchDocuments', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			console.log("Fetched Results from action", result)

			if (result) {
				searchResults = JSON.parse(result.data);
			} else {
				errorMessage = result.error || "An error occurred during the search";
			}
		} catch (error) {
			console.error("Search error:", error);
			errorMessage = "An error occurred while communicating with the server.";
		} finally {
			processing = false;
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="max-w-3xl mx-auto">
	<div class="mb-4">
		<label for="documentKey" class="block mb-2">Document Key:</label>
		<input
			type="text"
			id="documentKey"
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
					checked={$selectedCollections.some(c =>
            c.bucket === collection.bucket &&
            c.scope === collection.scope &&
            c.collection === collection.collection
          )}
					on:change={() => toggleCollection(collection)}
				/>
				{collection.bucket}.{collection.scope}.{collection.collection}
			</label>
		{/each}
	</div>

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
		/>
	{/each}
{/if}