<script lang="ts">
	import posthog from 'posthog-js';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import DivisionalVideoPlayer from '$lib/components/DivisionalVideoPlayer.svelte';

	posthog.capture('$pageview')

	import type { LooksSummary } from './+page.server';

	export let data: LooksSummary;

	function getVideoForDivision(divisionCode: string): string {
		let videoMap = {
			'01': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/TH%20SP25%20MSW%20TRAILER_SP25_1920x1080_C5101`,
			'02': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/TH_SP25_MASH%20UP_JEANS_C5102`,
			'03': `https://s7g10.scene7.com/is/content/TommyHilfigerEU/TH_SP25_MASH%20UP_JEANS_C5102`
		}
		// You can set a default URL as well
		return videoMap[divisionCode]
	}

	let video = `https://s7g10.scene7.com/is/content/TommyHilfigerEU/TH%20SP25%20MSW%20TRAILER_SP25_1920x1080_C5101`;

	console.log("Video",video)

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
