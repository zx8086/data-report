// ++server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Settings } from '$lib/types';
import { updateSettings, getSettings } from '$lib/server/settingsDB';

const DEFAULT_SETTINGS: Settings = {
	activeOption: true,
	salesChannels: ['SELLIN']
};

export const GET: RequestHandler = async () => {
	try {
		const settings = getSettings();
		console.log("API GET: Retrieved settings:", settings);
		return json(settings);
	} catch (error) {
		console.error("API GET: Error fetching settings:", error);
		return json(DEFAULT_SETTINGS, { status: 200 });  // Return default settings instead of an error
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const newSettings = await request.json();
		console.log("API POST: Received new settings:", newSettings);
		updateSettings(newSettings);
		const updatedSettings = getSettings();
		console.log("API POST: Settings updated, new settings:", updatedSettings);
		return json({ success: true, settings: updatedSettings });
	} catch (error) {
		console.error("API POST: Error updating settings:", error);
		return json({ error: "Failed to update settings" }, { status: 500 });
	}
};