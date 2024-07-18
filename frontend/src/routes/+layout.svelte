<!--+layout.svelte (Main Site)-->
<script lang="ts">
	import "../app.css";
	import { afterNavigate } from '$app/navigation';
	import Breadcrumbs from "$lib/components/Breadcumbs.svelte";
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import RightSidebar from '$lib/components/RightSidebar.svelte';
	import Slideover from '$lib/components/common/slideover/Slideover.svelte';
	import Button from '$lib/components/common/button/Button.svelte';
	import { selectedItem } from '$lib/stores/selectedItemStore';
	import { settings } from '$lib/stores/settingsStore';
	import { onMount, setContext } from 'svelte';
	import { Tracker, key } from '$lib/context/tracker';
	import type { Options } from '@openreplay/tracker';

	$: console.log("Current settings in layout:", $settings);

	let tracker: any | null = null;
	let slideoverOpen = false;

	function initializeTracker() {
		if (typeof window !== 'undefined' && !tracker && Tracker) {
			tracker = new Tracker({
				projectKey: "XULAx3Gt1QjSuNsrm586",
				ingestPoint: "https://api.openreplay.com/ingest",
				obscureTextNumbers: false,
				obscureTextEmails: true,
				__DISABLE_SECURE_MODE: true,
				network: {
					capturePayload: true,
					sessionTokenHeader: false,
					failuresOnly: false,
					ignoreHeaders: ['Authorization', 'Cookie', 'Set-Cookie'],
					captureInIframes: false,
				},
				capturePerformance: true,
				respectDoNotTrack: false,
				verbose: true,
				console: {
					enabled: true,
					level: ['log', 'info', 'warn', 'error']
				},
			} as Options);
		}
		return tracker;
	}

	function getTracker() {
		return tracker || initializeTracker();
	}

	onMount(async () => {
		try {
			await settings.loadSettings();
			console.log("Settings loaded successfully from layout.svelte");
		} catch (error) {
			console.error("Error loading settings from +layout.svelte:", error);
			// Handle the error, maybe set default values or show an error message
		}

		// Initialize OpenReplay tracker
		try {
			const trackerInstance = getTracker();
			if (trackerInstance) {
				await trackerInstance.start({
					userID: "simon.owusu@tommy.com",
					metadata: {
						balance: "10M",
						plan: "free"
					}
				});
				console.log("OpenReplay tracker started successfully");
			}
		} catch (error) {
			console.error("Failed to initialize OpenReplay:", error);
		}
	});

	setContext(key, { getTracker });

	afterNavigate(() => {
		selectedItem.reset();
	});

	function handleSave() {
		console.log('Settings saved from +layout.svelte');
		slideoverOpen = false;
	}

	function handleCancel() {
		console.log('Settings canceled from +layout.svelte');
		slideoverOpen = false;
	}
</script>

<div class="flex h-screen overflow-hidden">
	<LeftSidebar/>

	<main class="flex-grow overflow-y-auto">
		<Breadcrumbs />
		<slot />
	</main>

	<RightSidebar />

	<div class="fixed bottom-4 left-4 z-40">
		<Button on:click={() => slideoverOpen = true}>Settings</Button>
	</div>

	<Slideover
		bind:open={slideoverOpen}
		title="Settings"
		subtitle="Adjust your preferences"
		on:save={handleSave}
		on:cancel={handleCancel}
		cancelText="Close"
		submitText="Save Changes"
	/>
</div>