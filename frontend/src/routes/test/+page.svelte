<script lang="ts">
	import { onMount } from 'svelte';

	let showFilters = false;

	function toggleFilters(event: Event) {
		event.stopPropagation();
		event.preventDefault();
		console.log('Button clicked');
		console.log('Before toggle:', showFilters);
		showFilters = !showFilters;
		console.log('After toggle:', showFilters);
	}

	onMount(() => {
		const button = document.querySelector('.filter-button');
		if (button) {
			button.addEventListener('click', toggleFilters, true); // true for capture phase
		}

		// Debugging: Check for event listeners on parent elements
		document.querySelectorAll('*').forEach(el => {
			el.addEventListener('click', (event) => {
				console.log('Element clicked:', el);
			}, true); // Capture phase
		});

		// Debugging: Log clicks on the document to ensure no interference
		document.addEventListener('click', (event) => {
			console.log('Document clicked');
		}, true); // Capture phase
	});
</script>

<div>
	<button class="filter-button ml-2 p-2 bg-blue-500 text-white rounded">
		Filters
	</button>

	{#if showFilters}
		<div class="mb-4 p-4 border rounded">
			<!-- Filters UI -->
			<h3 class="text-lg font-bold mb-2">Filters</h3>
			<!-- Filter options -->
			<label><input type="checkbox" /> Option 1</label>
			<label><input type="checkbox" /> Option 2</label>
			<!-- Clear filters button -->
			<button on:click={() => showFilters = false} class="mt-2 p-2 bg-gray-300 rounded">Clear Filters</button>
		</div>
	{/if}
</div>
