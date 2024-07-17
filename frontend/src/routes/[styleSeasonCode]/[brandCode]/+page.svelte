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

	$: {
		if ($page) {
			const pathParts = $page.url.pathname.split('/');
			styleSeasonCode = pathParts[1];
			brandCode = pathParts[2];
			divisionCode = pathParts[3];
		}
	}

	// Define divisions for each brand using the translation utility
	const brandDivisions = {
		THEU: ['01', '02', '03', '04', '05', '07', '09', '10'],
		CKEU: ['61', '62', '64', '65', '67', '68', '69', '70', '77'],
		NIKE: ['97']
	};

	// Get the correct divisions based on the current brand
	$: divisions = (brandDivisions[brandCode as keyof typeof brandDivisions] || []).map(code => ({
		code,
		name: translateCode(code, 'division')
	}));

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
	{#each divisions as division}
		<button
			class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-64"
			on:click={() => navigateToDivision(division.code)}
		>
			{division.name}
		</button>
	{/each}
</div>

<h2>Charts -> Divisional</h2>
<!-- Add your divisional charts here -->

<pre>
  Current Path: {JSON.stringify(translatedPath, null, 2)}
</pre>