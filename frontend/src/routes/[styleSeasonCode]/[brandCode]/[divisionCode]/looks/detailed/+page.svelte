<!--+page.svelte-->

<script lang="ts">
	import type { Look } from '$lib/types';

	export let data: { looks: Look[] };
	// console.log("Passed Data", data);

</script>

{#if data.looks && data.looks.length > 0}
	<ul>
		{#each data.looks as look (look.documentKey)}
			<li>
				<h2>{look.title}</h2>
				{#if look.lookType === '11'}
					<video src={look.assetUrl} controls muted></video>
				{:else}
					<img src={look.assetUrl} alt="{look.title}" />
				{/if}
<!--				<p>Trend: {look.trend}</p>-->
			</li>
			<!--{#each look.relatedStyles as relatedStyle}-->
			<!--	<p>Related Style: {relatedStyle}</p>-->
			<!--{/each}-->
		{/each}
	</ul>
{:else}
	<p>No data found.</p>
{/if}



