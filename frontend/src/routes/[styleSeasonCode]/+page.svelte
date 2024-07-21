<!-- +page.svelte (For PVH Brands)-->
<script lang="ts">
	/** @type {import('./$types').PageData} */

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { key } from '$lib/context/tracker';
	import { onMount, getContext } from 'svelte';
	import { browser } from '$app/environment';

	function goBack() {
		if (browser) {
			window.history.back();
		}
	}
	const { getTracker } = getContext(key);

	$: currentSeasonCode = $page.params.styleSeasonCode;

	let seasonalAssignments = [];
	let loading = true;

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
		} finally {
			loading = false;
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

	$: activeAssignments = seasonalAssignments.filter(hasActiveDivisions);
</script>

<h1>PVH Brands</h1>
<div class="flex flex-col space-y-4 my-4">
	{#if loading}
		<p>Loading...</p>
	{:else if activeAssignments.length === 0}
		<section class="flex items-center h-full sm:p-16 dark:bg-gray-50 dark:text-gray-800">
			<div class="container flex flex-col items-center justify-center px-5 mx-auto my-8 space-y-8 text-center sm:max-w-md">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-40 h-40 dark:text-gray-400">
					<path fill="currentColor" d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"></path>
					<rect width="176" height="32" x="168" y="320" fill="currentColor"></rect>
					<polygon fill="currentColor" points="210.63 228.042 186.588 206.671 207.958 182.63 184.042 161.37 162.671 185.412 138.63 164.042 117.37 187.958 141.412 209.329 120.042 233.37 143.958 254.63 165.329 230.588 189.37 251.958 210.63 228.042"></polygon>
					<polygon fill="currentColor" points="383.958 182.63 360.042 161.37 338.671 185.412 314.63 164.042 293.37 187.958 317.412 209.329 296.042 233.37 319.958 254.63 341.329 230.588 365.37 251.958 386.63 228.042 362.588 206.671 383.958 182.63"></polygon>
				</svg>
				<p class="text-3xl">No active assignments found for this season</p>
				<button on:click={goBack} class="px-8 py-3 font-semibold rounded dark:bg-violet-600 dark:text-gray-50">Back to previous page</button>
			</div>
		</section>
	{:else}
		{#each activeAssignments as assignment}
			<button
				class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-64"
				on:click={() => navigateToBrand(assignment.companyCode)}
			>
				{assignment.brandName}
			</button>
		{/each}
	{/if}
</div>