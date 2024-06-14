<script lang="ts">
	export let src: string;
</script>

<video controls autoplay muted loop>
	<source src={src} type="video/mp4" />
	<track kind="captions" src="path/to/your/captions.vtt" srclang="en" />
</video>