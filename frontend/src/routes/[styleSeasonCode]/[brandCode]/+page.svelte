<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { key } from '$lib/context/tracker';
	import { onMount, getContext } from 'svelte';
	import { translateCode, translatePath } from '$lib/utils/translations';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const { getTracker } = getContext(key);

	let styleSeasonCode: string;
	let brandCode: string;
	let divisionCode: string;
	let divisions: { code: string; name: string; isActive: boolean }[] = [];
	let loading = true;

	$: {
		if ($page) {
			const pathParts = $page.url.pathname.split('/');
			styleSeasonCode = pathParts[1];
			brandCode = pathParts[2];
			divisionCode = pathParts[3];
		}
	}

	async function fetchSeasonalAssignments(styleSeasonCode: string, brandCode: string) {
		try {
			const response = await fetch(`/api/seasonalAssignments?styleSeasonCode=${styleSeasonCode}&companyCode=${brandCode}&isActive=true`);
			if (!response.ok) {
				throw new Error('Failed to fetch seasonal assignments');
			}
			const data = await response.json();
			return data.assignments[0]; // Return the first (and only) assignment
		} catch (error) {
			console.error('Error fetching seasonal assignments:', error);
			return null;
		} finally {
			loading = false;
		}
	}

	$: {
		if (styleSeasonCode && brandCode) {
			loading = true;
			fetchSeasonalAssignments(styleSeasonCode, brandCode).then(assignment => {
				if (assignment && assignment.divisions) {
					divisions = assignment.divisions
						.filter(div => div.isActive)
						.map(div => ({
							code: div.code,
							name: translateCode(div.code, 'division'),
							isActive: div.isActive
						}));
				} else {
					divisions = [];
				}
			});
		}
	}

	function navigateToDivision(divisionCode: string) {
		if (styleSeasonCode && brandCode) {
			goto(`/${styleSeasonCode}/${brandCode}/${divisionCode}`);
		} else {
			console.error('Missing season code or brand code');
		}
	}

	onMount(() => {
		try {
			const tracker = getTracker();
			if (tracker) {
				const translatedBrand = translateCode(brandCode, 'brand');
				tracker.event('Page_View', {
					page: `Brands - ${translatedBrand}`,
					category: 'Navigation',
					action: 'View'
				});
			} else {
				console.warn('Tracker not available');
			}
		} catch (error) {
			console.error('Error in onMount:', error);
		}
	});

	$: translatedPath = translatePath($page.url.pathname);
</script>

<h1>{translateCode(brandCode, 'brand')} Divisions</h1>
<h2>{translateCode(styleSeasonCode, 'season')}</h2>
<div class="flex flex-col space-y-4 my-4">
	{#if loading}
		<p>Loading...</p>
	{:else if divisions.length === 0}
		<p>No active divisions found for this brand and season.</p>
	{:else}
		{#each divisions as division}
			<button
				class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-64"
				on:click={() => navigateToDivision(division.code)}
			>
				{division.name}
			</button>
		{/each}
	{/if}
</div>
