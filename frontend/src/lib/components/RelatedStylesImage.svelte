<!-- RelatedStylesImage.svelte -->
<script lang="ts">
	export let src: string;
	export let alt: string;
	export let styleCode: string;

	function handleImageError(e: Event) {
		console.error(`Error loading related style image:`, e);
		(e.target as HTMLImageElement).src = '/img/not-found.png';
	}
</script>

<div class="mb-4">
	<h4 class="font-semibold mb-1">{styleCode}</h4>
	<img
		{src}
		{alt}
		class="w-full mb-2"
		on:error={handleImageError}
	/>
</div>