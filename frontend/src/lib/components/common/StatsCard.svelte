<!-- StatsCard.svelte -->
<script>
	export let title = '';
	export let stat = '';
	export let icon = null;

	const defaultIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `;
</script>

<div class="w-4/5 my-2 py-1">
	<div class="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300">
		<div class="flex items-center gap-2">
      <span class="text-gray-500">
        {@html icon || defaultIcon}
      </span>
			<span>{title}</span>
		</div>
		<span class="font-semibold">{stat}</span>
	</div>
</div>