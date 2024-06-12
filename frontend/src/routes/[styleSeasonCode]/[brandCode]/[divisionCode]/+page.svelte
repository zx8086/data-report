<script lang="ts">
	import posthog from 'posthog-js';
	posthog.capture('$pageview')


	import type { LooksSummary } from './+page.server';
	import ProgressBar from '$lib/components/ProgressBar.svelte';

	export let data: LooksSummary;
	// let divisionName = 'Kids';
</script>

<div class="container ml-20 mx-auto p-0">
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
