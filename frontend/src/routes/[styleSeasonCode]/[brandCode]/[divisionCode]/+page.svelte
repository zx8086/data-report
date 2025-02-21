<!--+page.svelte-->
<script lang="ts">
	/** @type {import('./$types').PageData} */

	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import DivisionalVideoPlayer from '$lib/components/DivisionalVideoPlayer.svelte';
	import StatCard from '$lib/components/common/StatsCard.svelte';
	import { page } from '$app/stores';

	import { key } from '$lib/context/tracker';
	import { onMount, getContext } from 'svelte';
	import { translateCode } from '$lib/utils/translations';

	const { getTracker } = getContext(key);

	onMount(() => {
		try {
			const tracker = getTracker();
			if (tracker) {
				try {
					const translatedDivision = translateCode(divisionCode, 'division');
					tracker.event('Page_View', {
						page: `Divisions - ${translatedDivision}`,
						category: 'Navigation',
						action: 'View'
					});
				} catch (translationError) {
					console.error('Error translating division code:', translationError);
					tracker.event('Page_View', {
						page: 'Divisions',
						category: 'Navigation',
						action: 'View',
						error: 'Translation failed'
					});
				}
			} else {
				console.warn('Tracker not available');
			}
		} catch (error) {
			console.error('Error in onMount:', error);
		}
	});


	export let data: any;
	const { collectionsData, looksData } = data.divisional;

	function getVideoForDivision(divisionCode: string): string {
		let videoMap = {
			'01': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/TH%20SP25%20MSW%20TRAILER_SP25_1920x1080_C5101`,
			'02': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/TH_SP25_MASH%20UP_JEANS_C5102`,
			'04': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/HILFIGER_KIDS_SP25_1920x1080_C5104`,
			'05': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/HILFIGER_WSW%20TRAILER_SP25_1920x1080_C5105`,
			'07': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/HILFIGER_CTB_SP25_1920x1080_C5107`,
			'09': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/WSW_FTW-ACC_SP25_1920x1080_C5109`,
			'61': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKMenswear_sizzle_C5161`,
			'62': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKJeans_sizzle_C5162`,
			'64': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKJeans_sizzle_C5162`,
			'65': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKWomenswear_sizzle_C5165`,
			'67': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKUnderwear_sizzle_C5167`,
			'68': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKSport_sizzle_C5168`,
			'69': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKJeans_sizzle_C5162`,
			'70': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKAccessories_sizzle_C5170`,
			'77': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKSwimwear_sizzle_C5177`,
		};
		return videoMap[divisionCode] || videoMap['01'];
	}

	let video: string = '';
	let styleSeasonCode : any;
	let brandCode : any;
	let divisionCode : any;

	$: {
		if ($page) {
			const pathParts = $page.url.pathname.split('/');
			styleSeasonCode = pathParts[1];
			brandCode = pathParts[2];
			divisionCode = pathParts[3];
			video = getVideoForDivision(divisionCode);
		}
	}
</script>

<div class="container mx-auto p-0">
	<div class="mb-8">
		<DivisionalVideoPlayer src={video}/>
	</div>
	<div class="flex flex-row justify-between">
		{#if collectionsData}
			<div class="w-1/2">
				<div class="card-th">
					<h2 class="heading-th flex justify-center">COLLECTION</h2>
					<div class="flex flex-col items-center">
						<ProgressBar titleHeading="Active" completed={collectionsData.isActive} total={collectionsData.totalOptions} />
						<ProgressBar titleHeading="Available" completed={collectionsData.isAvailable} total={collectionsData.totalOptions} />
						<ProgressBar titleHeading="Front Image" completed={collectionsData.hasFrontImageUrl} total={collectionsData.totalOptions} />
						<ProgressBar titleHeading="Images" completed={collectionsData.hasImages} total={collectionsData.totalOptions} />
						<ProgressBar titleHeading="Delivery Dates" completed={collectionsData.hasDeliveryDates} total={collectionsData.totalOptions} />
						<div class="flex flex-col items-center w-full mt-4 mb-4">
							<StatCard title="Open For Ecom" stat={collectionsData.isOpenForEcom} />
							<StatCard title="Licensed" stat={collectionsData.isLicensed} />
							<StatCard title="New" stat={collectionsData.isNew} />
							<StatCard title="Updated" stat={collectionsData.isUpdated} />
							<StatCard title="Sold Out" stat={collectionsData.isSoldOut} />
							<StatCard title="Closed" stat={collectionsData.isClosed} />
							<StatCard title="Cancelled" stat={collectionsData.isCancelled} />
							<StatCard title="Invalid" stat={collectionsData.isInvalid} />
						</div>
					</div>
					<div class="flex justify-center mt-1">
						<a href={`/${styleSeasonCode}/${brandCode}/${divisionCode}/collection`} class="btn-th-detailed-report border-2 p-2">
							VIEW COLLECTION
						</a>
					</div>
				</div>
			</div>
		{:else}
			<p>Loading Collections data...</p>
		{/if}
		{#if looksData}
			<div class="w-1/2">
				<div class="card-th">
					<h2 class="heading-th flex justify-center">LOOKS</h2>
					<div class="flex flex-col items-center">
						<ProgressBar titleHeading="Title" completed={looksData.hasTitle} total={looksData.totalLooks} />
						<ProgressBar titleHeading="Description" completed={looksData.hasDescription} total={looksData.totalLooks} />
						<ProgressBar titleHeading="Related Styles"  completed={looksData.hasRelatedStyles} total={looksData.totalLooks} />
						<ProgressBar titleHeading="Trends" completed={looksData.hasTrend} total={looksData.totalLooks} />
						<ProgressBar titleHeading="Gender" completed={looksData.hasGender} total={looksData.totalLooks} />
						<ProgressBar titleHeading="Tags" completed={looksData.hasTag} total={looksData.totalLooks} />
					</div>
					<div class="flex justify-center mt-1">
						<a href={`/${styleSeasonCode}/${brandCode}/${divisionCode}/looks`} class="btn-th-detailed-report border-2 p-2">
							VIEW LOOKS
						</a>
					</div>
				</div>
			</div>
		{:else}
			<p>Loading Looks data...</p>
		{/if}
	</div>
</div>
