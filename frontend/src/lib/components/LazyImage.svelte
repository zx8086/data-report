<!-- $lib/components/LazyImage.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let src: string;
	export let alt: string;
	export let fallbackSrc: string = '/img/not-found.png';

	let loaded = false;
	let error = false;
	let imgElement: HTMLImageElement;

	const loadImage = () => {
		const img = new Image();
		img.src = src;
		img.onload = () => {
			loaded = true;
			if (imgElement) imgElement.src = src;
		};
		img.onerror = () => {
			error = true;
			console.error('Failed to load image:', src);
		};
	};

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadImage();
					observer.disconnect();
				}
			},
			{ rootMargin: '200px' }
		);

		if (imgElement) observer.observe(imgElement);

		return () => observer.disconnect();
	});
</script>

<div class="w-full h-full">
	{#if !loaded && !error}
		<div class="w-full h-full bg-gray-200 animate-pulse"></div>
	{/if}

	<img
		bind:this={imgElement}
		src={error ? fallbackSrc : src}
		{alt}
		class={`w-full h-full object-contain ${loaded ? '' : 'hidden'}`}
		on:error={() => (error = true)}
	/>
</div>