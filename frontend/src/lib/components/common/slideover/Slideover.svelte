<!--Slideover.svelte component-->
<script lang="ts">
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/common/button/Button.svelte';
	import { Icon, XMark } from 'svelte-hero-icons';

	export let open: boolean;
	export let title: string;
	export let subtitle: string = '';
	export let cancelText: string = 'Cancel';
	export let submitText: string = 'Save';
	export let showButtons: boolean = true;

	const dispatch = createEventDispatcher();
</script>

{#if open}
	<div class="fixed inset-0 overflow-hidden" style="z-index: 50;">
		<div class="absolute inset-0 overflow-hidden">
			<div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
				<div
					class="pointer-events-auto w-screen max-w-md"
					transition:fly={{ x: '100%', opacity: 1, duration: 300 }}>
					<div class="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
						<div class="bg-primary px-4 py-6 sm:px-6">
							<div class="flex items-center justify-between">
								<h2 class="text-xl font-semibold leading-6 text-primary-content">
									{title}
								</h2>
								<button type="button" on:click={() => (open = false)}>
									<Icon src={XMark} color="white" size="1.6rem" />
								</button>
							</div>
							<div class="mt-1">
								<p class="text-sm text-primary-content text-opacity-80">{subtitle}</p>
							</div>
						</div>
						<div class="relative flex-1 px-4 py-6 sm:px-6">
							<slot />
						</div>
						{#if showButtons}
							<div class="flex flex-shrink-0 justify-end gap-2 px-4 py-4">
								<Button
									type="button"
									class="btn-outline border-base-300"
									on:click={() => {
                    open = false;
                    dispatch('cancel');
                  }}>
									{cancelText}
								</Button>
								<Button
									type="submit"
									class="btn-primary"
									on:click={() => dispatch('save')}>
									{submitText}
								</Button>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}