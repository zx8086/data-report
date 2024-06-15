<!--+page.svelte-->
<script lang="ts">
	/** @type {import('./$types').PageData} */

	import posthog from 'posthog-js';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import DivisionalVideoPlayer from '$lib/components/DivisionalVideoPlayer.svelte';
	import { page } from '$app/stores';

	posthog.capture('$pageview');

	export let data: any;
	const { collectionsData, looksData } = data.divisional;

	console.log("Looks Data",looksData)
	console.log("Collection Data",collectionsData)

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
			'65': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKWomenswear_sizzle_C5165`,
			'67': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKUnderwear_sizzle_C5167`,
			'68': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKSport_sizzle_C5168`,
			'70': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKAccessories_sizzle_C5170`,
			'77': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKSwimwear_sizzle_C5177`,
		};
		return videoMap[divisionCode] || videoMap['01'];
	}

	let video: string = '';
	$: {
		if ($page && $page.url) {
			const divisionCode = $page.url.pathname.split('/')[3];
			video = getVideoForDivision(divisionCode);
			console.log("Division Code", divisionCode);
			console.log("Video", video);
		}
	}
</script>

<div class="container mx-auto p-0">
	<div class="flex items-center justify-center mb-8">
		<DivisionalVideoPlayer src={video} class="mx-auto"/>
	</div>
	<div class="flex flex-row justify-between">
		{#if collectionsData}
			<div class="w-1/2 pr-4">
				<div class="card-th">
					<h2 class="heading-th p-4">COLLECTIONS</h2>
					<div class="p-4">
							<ProgressBar titleHeading="Active" percentage={Math.round((collectionsData.isActive / collectionsData.totalOptions) * 100)} completed={collectionsData.isActive} total={collectionsData.totalOptions} />
							<ProgressBar titleHeading="Sold Out" percentage={Math.round((collectionsData.isSoldOut / collectionsData.totalOptions) * 100)} completed={collectionsData.isSoldOut} total={collectionsData.totalOptions} />
							<ProgressBar titleHeading="Images" percentage={Math.round((collectionsData.hasImages / collectionsData.totalOptions) * 100)} completed={collectionsData.hasImages} total={collectionsData.totalOptions} />
							<ProgressBar titleHeading="Available" percentage={Math.round((collectionsData.isAvailable / collectionsData.totalOptions) * 100)} completed={collectionsData.isAvailable} total={collectionsData.totalOptions} />
							<ProgressBar titleHeading="Cancelled" percentage={Math.round((collectionsData.isCancelled / collectionsData.totalOptions) * 100)} completed={collectionsData.isCancelled} total={collectionsData.totalOptions} />
							<ProgressBar titleHeading="Closed" percentage={Math.round((collectionsData.isClosed / collectionsData.totalOptions) * 100)} completed={collectionsData.isClosed} total={collectionsData.totalOptions} />
							<ProgressBar titleHeading="Invalid" percentage={Math.round((collectionsData.isInvalid / collectionsData.totalOptions) * 100)} completed={collectionsData.isInvalid} total={collectionsData.totalOptions} />
							<ProgressBar titleHeading="Licensed" percentage={Math.round((collectionsData.isLicensed / collectionsData.totalOptions) * 100)} completed={collectionsData.isLicensed} total={collectionsData.totalOptions} />
							<ProgressBar titleHeading="New" percentage={Math.round((collectionsData.isNew / collectionsData.totalOptions) * 100)} completed={collectionsData.isNew} total={collectionsData.totalOptions} />
							<ProgressBar titleHeading="Updated" percentage={Math.round((collectionsData.isUpdated / collectionsData.totalOptions) * 100)} completed={collectionsData.isUpdated} total={collectionsData.totalOptions} />
							<ProgressBar titleHeading="Open For Ecom" percentage={Math.round((collectionsData.isOpenForEcom / collectionsData.totalOptions) * 100)} completed={collectionsData.isOpenForEcom} total={collectionsData.totalOptions} />
							<ProgressBar titleHeading="Delivery Dates" percentage={Math.round((collectionsData.hasDeliveryDates / collectionsData.totalOptions) * 100)} completed={collectionsData.hasDeliveryDates} total={collectionsData.totalOptions} />
					</div>
				</div>
			</div>
		{:else}
			<p>Loading Collections data...</p>
		{/if}
		{#if looksData}
			<div class="w-1/2 pl-4">
				<div class="card-th">
					<h2 class="heading-th p-4">LOOKS</h2>
					<div class="p-4">
							<ProgressBar titleHeading="Gender" percentage={Math.round((looksData.hasGender / looksData.totalLooks) * 100)} completed={looksData.hasGender} total={looksData.totalLooks} />
							<ProgressBar titleHeading="Tags" percentage={Math.round((looksData.hasTag / looksData.totalLooks) * 100)} completed={looksData.hasTag} total={looksData.totalLooks} />
							<ProgressBar titleHeading="Description" percentage={Math.round((looksData.hasDescription / looksData.totalLooks) * 100)} completed={looksData.hasDescription} total={looksData.totalLooks} />
							<ProgressBar titleHeading="Trends" percentage={Math.round((looksData.hasTrend / looksData.totalLooks) * 100)} completed={looksData.hasTrend} total={looksData.totalLooks} />
							<ProgressBar titleHeading="Related Styles" percentage={Math.round((looksData.hasRelatedStyles / looksData.totalLooks) * 100)} completed={looksData.hasRelatedStyles} total={looksData.totalLooks} />
							<ProgressBar titleHeading="Title" percentage={Math.round((looksData.hasTitle / looksData.totalLooks) * 100)} completed={looksData.hasTitle} total={looksData.totalLooks} />
					</div>
				</div>
			</div>
		{:else}
			<p>Loading Looks data...</p>
		{/if}
	</div>
</div>

