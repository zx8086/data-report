<script lang="ts">
	import posthog from 'posthog-js';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import DivisionalVideoPlayer from '$lib/components/DivisionalVideoPlayer.svelte';
	import {page} from '$app/stores';

	posthog.capture('$pageview')

	import type { LooksSummary } from './+page.server';

	export let data: LooksSummary;

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
		<div class="w-1/2">Collections</div>
		<div class="w-1/2">
			<div class="card-th">
				<h2 class="heading-th p-4">LOOKS</h2>
				<div class="p-4">
					<p>Gender
						<ProgressBar percentage={Math.round((data.hasGender / data.totalLooks) * 100)} completed={data.hasGender} total={data.totalLooks} />
					</p>
					<p>Tags
						<ProgressBar percentage={Math.round((data.hasTag / data.totalLooks) * 100)} completed={data.hasTag} total={data.totalLooks} />
					</p>
					<p>Description
						<ProgressBar percentage={Math.round((data.hasDescription / data.totalLooks) * 100)} completed={data.hasDescription} total={data.totalLooks} />
					</p>
					<p>Trends
						<ProgressBar percentage={Math.round((data.hasTrend / data.totalLooks) * 100)} completed={data.hasTrend} total={data.totalLooks} />
					</p>
					<p>Related Styles
						<ProgressBar percentage={Math.round((data.hasRelatedStyles / data.totalLooks) * 100)} completed={data.hasRelatedStyles} total={data.totalLooks} />
					</p>
					<p>Title
						<ProgressBar percentage={Math.round((data.hasTitle / data.totalLooks) * 100)} completed={data.hasTitle} total={data.totalLooks} />
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
