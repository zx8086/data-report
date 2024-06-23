<!-- Breadcrumbs.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { generateBreadcrumbs } from '$lib/utils';

	const breadcrumbs = derived(page, $page => {
		const path = $page.url.pathname;
		// console.log('Current path:', path);
		const result = generateBreadcrumbs(path);
		// console.log('Generated breadcrumbs:', result);
		return result;
	});
</script>

<div class="bg-gray-200 dark:bg-gray-800">
	<div class="container flex items-center px-6 py-4 mx-auto overflow-x-auto whitespace-nowrap">
		{#if $breadcrumbs.length > 1}
			{#each $breadcrumbs as { label, href }, index}
				<a
					href={href}
					class:text-blue-600={index === $breadcrumbs.length - 1}
					class:dark:text-blue-400={index === $breadcrumbs.length - 1}
					class:hover:underline={index === $breadcrumbs.length - 1}
					class="text-gray-600 dark:text-gray-200 hover:underline"
				>
					{label}
				</a>

				{#if index < $breadcrumbs.length - 1}
					<span class="mx-5 text-gray-500 dark:text-gray-300 rtl:-scale-x-100">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</span>
				{/if}
			{/each}
		{/if}
	</div>
</div>
