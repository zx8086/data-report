<script>
	/** @type {import('./$types').PageData} */

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { key } from '$lib/context/tracker';
	import { onMount, getContext } from 'svelte';

	const { getTracker } = getContext(key);

	// Get the current styleSeasonCode from the page store
	$: currentSeasonCode = $page.params.styleSeasonCode;

	let seasonalAssignments = [];

	async function fetchSeasonalAssignments(styleSeasonCode) {
		try {
			const response = await fetch(`/api/seasonalAssignments?styleSeasonCode=${styleSeasonCode}&isActive=true`);
			if (!response.ok) {
				throw new Error('Failed to fetch seasonal assignments');
			}
			const data = await response.json();
			return data.assignments;
		} catch (error) {
			console.error('Error fetching seasonal assignments:', error);
			return [];
		}
	}

	onMount(async () => {
		const tracker = getTracker();
		if (tracker) {
			tracker.event('Page_View', {
				page: 'Seasons',
				category: 'Navigation',
				action: 'View'
			});
		}

		// Fetch seasonal assignments when the component mounts
		if (currentSeasonCode) {
			seasonalAssignments = await fetchSeasonalAssignments(currentSeasonCode);
		}
	});

	function navigateToBrand(brandCode) {
		if (currentSeasonCode) {
			goto(`/${currentSeasonCode}/${brandCode}`);
		} else {
			console.error('No season code available');
		}
	}

	// Helper function to check if a company has active divisions
	function hasActiveDivisions(assignment) {
		return assignment.divisions.some(d => d.isActive);
	}
</script>

<h1>PVH Brands</h1>
<div class="flex flex-col space-y-4 my-4">
	{#each seasonalAssignments as assignment}
		{#if hasActiveDivisions(assignment)}
			<button
				class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-64"
				on:click={() => navigateToBrand(assignment.companyCode)}
			>
				{assignment.brandName}
			</button>
		{/if}
	{/each}
</div>