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

			console.log("Response from action", result);

			if (result && result.type === 'success' && result.data) {
				const parsedData = JSON.parse(result.data);
				if (Array.isArray(parsedData) && parsedData.length > 2 && parsedData[1] === 'success') {
					const dataArray = parsedData.slice(2);
					const indices = dataArray[0];
					const dictionary = dataArray.slice(1);

					console.log("Parsed data:", parsedData);
					console.log("Indices:", indices);
					console.log("Dictionary:", dictionary);

					searchResults = indices.map(index => {
						const item = dictionary[index - 3]; // Adjust index to account for the slicing
						if (typeof item !== 'object' || item === null) {
							return null; // Skip this item if it's not an object
						}
						return {
							__typename: item.__typename !== undefined ? dictionary[item.__typename - 3] : 'Unknown',
							bucket: item.bucket !== undefined ? dictionary[item.bucket - 3] : 'Unknown',
							scope: item.scope !== undefined ? dictionary[item.scope - 3] : 'Unknown',
							collection: item.collection !== undefined ? dictionary[item.collection - 3] : 'Unknown',
							data: item.data === 8 ? null : (item.data !== undefined ? dictionary[item.data - 3] : null),
							timeTaken: item.timeTaken !== undefined ? dictionary[item.timeTaken - 3] : 0
						};
					}).filter(item => item !== null); // Remove any null items

					console.log("Parsed search results:", searchResults);
				} else {
					errorMessage = "Unexpected data structure in response";
				}
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
{:else if !processing && documentKey}
	<p class="mt-4">No results found for the given document key.</p>
{/if}