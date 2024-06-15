<script lang="ts">
	import posthog from 'posthog-js';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import DivisionalVideoPlayer from '$lib/components/DivisionalVideoPlayer.svelte';
	import {page} from '$app/stores';

	posthog.capture('$pageview')

	import type { LooksSummary, CollectionsSummary } from './+page.server';

	export let looksData: LooksSummary;
	export let collectionsData: CollectionsSummary;

	console.log("Collection Data",collectionsData)
	console.log("Looks Data", looksData)

	function getVideoForDivision(divisionCode: string): string {
		let videoMap = {
			'01': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/TH%20SP25%20MSW%20TRAILER_SP25_1920x1080_C5101`,
			'02': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/TH_SP25_MASH%20UP_JEANS_C5102`,
			'03': ``,
			'04': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/HILFIGER_KIDS_SP25_1920x1080_C5104`,
			'05': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/HILFIGER_WSW%20TRAILER_SP25_1920x1080_C5105`,
			'06': ``,
			'07': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/HILFIGER_CTB_SP25_1920x1080_C5107`,
			'08': ``,
			'09': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/WSW_FTW-ACC_SP25_1920x1080_C5109`,
			// '09': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/MSW_FTW_ACC_SP25_1920x1080_C5109`,
			'10': ``,
			'61': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKMenswear_sizzle_C5161`,
			'62': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKJeans_sizzle_C5162`,
			'63': ``,
			'64': ``,
			'65': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKWomenswear_sizzle_C5165`,
			'66': ``,
			'67': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKUnderwear_sizzle_C5167`,
			'68': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKSport_sizzle_C5168`,
			'69': ``,
			'70': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKAccessories_sizzle_C5170`,
			'77': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/CKSP25_CKSwimwear_sizzle_C5177`,
			'97': ``
		}
		// You can set a default URL as well
		return videoMap[divisionCode]  || videoMap['01']; // default video when there is no videoMap for current `divisionCode`
	}

	// let video = `https://s7g10.scene7.com/is/content/TommyHilfigerEU/TH%20SP25%20MSW%20TRAILER_SP25_1920x1080_C5101`;

	let video: any = null;
	$: {
		if ($page && $page.url) {
			// a reactive statement to update the video based on the page URL
			const divisionCode = $page.url.pathname.split('/')[3];  // using `split` to get the division code from the URL.
			video = getVideoForDivision(divisionCode);
			console.log("Division Code",divisionCode)
			console.log("Video",video);
		}
	}
</script>

<div class="container ml-20 mx-auto p-0">
	<div class="flex items-center justify-center">
		<DivisionalVideoPlayer src={video} class="mx-auto"/>
	</div>
	<div class="flex flex-row justify-center space-x-4">
		<div class="w-1/2">
			<div class="card-th">
				<h2 class="heading-th p-4">COLLECTIONS</h2>
				<div class="p-4">
					<p>Active
						<ProgressBar percentage={Math.round((collectionsData.isActive / collectionsData.totalOptions) * 100)} completed={collectionsData.isActive} total={collectionsData.totalOptions} />
					</p>
					<p>Sold Out
						<ProgressBar percentage={Math.round((collectionsData.isSoldOut / collectionsData.totalOptions) * 100)} completed={collectionsData.isSoldOut} total={collectionsData.totalOptions} />
					</p>
					<!-- Add other fields as you see fit -->
				</div>
			</div>
		</div>
		<div class="w-1/2">
			<div class="card-th">
				<h2 class="heading-th p-4">LOOKS</h2>
				<div class="p-4">
					<p>Gender
						<ProgressBar percentage={Math.round((looksData.hasGender / looksData.totalLooks) * 100)} completed={looksData.hasGender} total={looksData.totalLooks} />
					</p>
					<p>Tags
						<ProgressBar percentage={Math.round((looksData.hasTag / looksData.totalLooks) * 100)} completed={looksData.hasTag} total={looksData.totalLooks} />
					</p>
					<p>Description
						<ProgressBar percentage={Math.round((looksData.hasDescription / looksData.totalLooks) * 100)} completed={looksData.hasDescription} total={looksData.totalLooks} />
					</p>
					<p>Trends
						<ProgressBar percentage={Math.round((looksData.hasTrend / looksData.totalLooks) * 100)} completed={looksData.hasTrend} total={looksData.totalLooks} />
					</p>
					<p>Related Styles
						<ProgressBar percentage={Math.round((looksData.hasRelatedStyles / looksData.totalLooks) * 100)} completed={looksData.hasRelatedStyles} total={looksData.totalLooks} />
					</p>
					<p>Title
						<ProgressBar percentage={Math.round((looksData.hasTitle / looksData.totalLooks) * 100)} completed={looksData.hasTitle} total={looksData.totalLooks} />
					</p>
				</div>
			</div>
		</div>
	</div>
</div>