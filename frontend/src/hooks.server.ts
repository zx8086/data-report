// src/hooks.server.ts

import { updateSeasonalAssignments } from '$lib/utils/backgroundJobs';
import type { Handle } from '@sveltejs/kit';

let updatePromise: Promise<void> | null = null;

export const handle: Handle = async ({ event, resolve }) => {
	// Start the update process if it's not already running
	if (!updatePromise) {
		updatePromise = updateSeasonalAssignments().finally(() => {
			updatePromise = null;
		});
	}

	// Schedule the next update
	const currentTime = Date.now();
	const hourInMilliseconds = 60 * 60 * 1000;
	const timeUntilNextHour = hourInMilliseconds - (currentTime % hourInMilliseconds);

	setTimeout(() => {
		updatePromise = updateSeasonalAssignments().finally(() => {
			updatePromise = null;
		});
	}, timeUntilNextHour);

	return resolve(event);
};