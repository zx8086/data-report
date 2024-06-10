<script lang="ts">
	import type { LooksSummary } from './+page.server';
	import ProgressBar from '$lib/components/ProgressBar.svelte';

	export let data: LooksSummary;

	console.log("Passed Data", data)

	let divisionName = "Kids";
</script>

<div class="container ml-20 mx-auto p-0">
	<div class="flex flex-row justify-center space-x-4">
		<div class="w-1/2"></div>

		<div class="w-1/2">
			<div class="card-th mb-4">
				<h2 class="heading-th p-4">{divisionName} LOOKS</h2>
				<div class="p-4">
					<p class="font-bold">LOOKS</p>
					<p>{data.hasTitle} OF {data.totalLooks} COMPLETE</p>

					<p>
						<ProgressBar
							percentage={((data.totalLooks - data.hasTitle) / data.totalLooks) * 100}
							completed={data.hasTitle}
							total={data.totalLooks}
						/>
					</p>
					{#if data.hasDescription}
						<p>
							<ProgressBar
								percentage={(data.hasDescription / data.totalLooks) * 100}
								completed={data.hasDescription}
								total={data.totalLooks}
							/>
						</p>
					{/if}
					{#if data.hasGender}
						<p>
							<ProgressBar
								percentage={(data.hasGender / data.totalLooks) * 100}
								completed={data.hasGender}
								total={data.totalLooks}
							/>
						</p>
					{/if}
					{#if data.hasRelatedStyles}
						<p>
							<ProgressBar
								percentage={(data.hasRelatedStyles / data.totalLooks) * 100}
								completed={data.hasRelatedStyles}
								total={data.totalLooks}
							/>
						</p>
					{/if}
					{#if data.hasTag}
						<p>
							<ProgressBar
								percentage={(data.hasTag / data.totalLooks) * 100}
								completed={data.hasTag}
								total={data.totalLooks}
							/>
						</p>
					{/if}
					{#if data.hasTrend}
						<p>
							<ProgressBar
								percentage={(data.hasTrend / data.totalLooks) * 100}
								completed={data.hasTrend}
								total={data.totalLooks}
							/>
						</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
