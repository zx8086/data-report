<script lang="ts">
	import "../app.css";
	import Breadcrumbs from "$lib/components/Breadcumbs.svelte";
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import RightSidebar from '$lib/components/RightSidebar.svelte';

	import { onMount, setContext } from 'svelte';
	import { Tracker, key } from '$lib/context/tracker';
	import type { Options } from '@openreplay/tracker';

	let tracker: any | null = null;

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
</script>

<div class="flex h-screen overflow-hidden">
	<LeftSidebar/>

	<main class="flex-grow overflow-y-auto">
		<Breadcrumbs />
		<slot />
	</main>

	<RightSidebar />
</div>