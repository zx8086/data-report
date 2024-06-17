<script>
	import { onMount } from 'svelte';

	export let showModal = false;
	export let side = 'left';
	export let onClose;
	export let message = null;

	let modalElement;
	let scrollY = 0;

	onMount(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', handleScroll);
		}

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('scroll', handleScroll);
			}
		};
	});
</script>

<div class="fixed top-0 bottom-0 z-10 transition-opacity
            {showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            {side === 'left' ? 'left-0 w-1/5' : ''}
            {side === 'right' ? 'right-0 w-1/5' : ''}"
		 bind:this={modalElement}
		 style="top: {scrollY}px;">
	{#if showModal}
		<div class="bg-white p-4 rounded-md shadow-md">
			<button on:click={onClose}>Close</button>
			<slot />
			{#if message}
				<p>{message}</p>
			{/if}
		</div>
	{/if}
</div>
