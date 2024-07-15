<script lang="ts">
	import { onMount } from 'svelte';
	export let src: string;

	let videoElement: HTMLVideoElement;

	onMount(() => {
		if (typeof videojs !== 'undefined') {
			const player = videojs(videoElement, {
				controls: false,
				autoplay: true,
				muted: true,
				loop: true,
				fluid: true,
				aspectRatio: '16:9',
			});

			return () => {
				if (player) {
					player.dispose();
				}
			};
		}
	});
</script>

<div class="w-full max-w-7xl mx-auto"> <!-- max-w-7xl is roughly 1280px -->
	<div class="aspect-w-16 aspect-h-9">
		<video bind:this={videoElement} class="video-js vjs-big-play-centered w-full h-full object-cover">
			<source {src} type="video/mp4" />
			<track kind="captions" srclang="en" />
		</video>
	</div>
</div>