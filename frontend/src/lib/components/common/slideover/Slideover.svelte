<!--Slideover.svelte component-->
<script lang="ts">
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/common/button/Button.svelte';
	import { Icon, XMark } from 'svelte-hero-icons';
	import { settings } from '$lib/stores/settingsStore';
	import type { Settings } from '$lib/types';

	export let open: boolean;
	export let title: string;
	export let subtitle: string = '';
	export let cancelText: string = 'Cancel';
	export let submitText: string = 'Save';
	export let showButtons: boolean = true;

	const dispatch = createEventDispatcher();

	let localSettings: Settings;

	$: if (open) {
		localSettings = { ...$settings };
		console.log("Slideover opened, current settings:", localSettings);
	}

	function handleActiveOptionChange() {
		localSettings.activeOption = !localSettings.activeOption;
		localSettings = { ...localSettings };
		console.log("Active option changed:", localSettings.activeOption);
	}

	function handleSalesChannelChange(channel: string) {
		if (localSettings.salesChannels.includes(channel)) {
			localSettings.salesChannels = localSettings.salesChannels.filter(c => c !== channel);
		} else {
			localSettings.salesChannels = [...localSettings.salesChannels, channel];
		}
		localSettings = { ...localSettings };
		console.log("Sales channels changed:", localSettings.salesChannels);
	}

	async function handleSave() {
		try {
			console.log("Slideover: Attempting to save settings:", localSettings);
			const updatedSettings = await settings.updateSettings(localSettings);
			console.log("Slideover: Settings saved successfully:", updatedSettings);
			dispatch('save');
			open = false;
		} catch (error) {
			console.error("Slideover: Error saving settings:", error);
		}
	}
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
							{#if localSettings}
								<label>
									<input
										type="checkbox"
										checked={localSettings.activeOption}
										on:change={handleActiveOptionChange}
									/>
									Active Option
								</label>
								<div>
									Sales Channels:
									{#each ['SELLIN', 'B2B'] as channel}
										<label>
											<input
												type="checkbox"
												checked={localSettings.salesChannels.includes(channel)}
												on:change={() => handleSalesChannelChange(channel)}
											/>
											{channel}
										</label>
									{/each}
								</div>
							{/if}
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
									on:click={handleSave}>
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