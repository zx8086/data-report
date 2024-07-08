<!-- ProductImage.svelte -->
<script lang="ts">
	export let src: string;
	export let alt: string;
	export let type: string;
	export let modifiedDate: string;

	function handleImageError(e: Event) {
		console.error(`Error loading ${type} image:`, e);
		(e.target as HTMLImageElement).src = '/img/not-found.png';
	}

	function formatDate(dateString: string) {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
	}
</script>

<div class="mb-4">
	<h4 class="font-semibold mb-1">{type.charAt(0).toUpperCase() + type.slice(1)} View</h4>
	<img
		{src}
		{alt}
		class="w-full mb-2"
		on:error={handleImageError}
	/>
	<p class="text-sm text-gray-600">Modified: {formatDate(modifiedDate)}</p>
</div>