// settingsStore.ts
import { writable } from 'svelte/store';

export interface Settings {
	activeOption: boolean;
	salesChannels: string[];
}

const DEFAULT_SETTINGS: Settings = {
	activeOption: false,
	salesChannels: ['SELLIN']
};

function createSettingsStore() {
	const { subscribe, set, update } = writable<Settings>(DEFAULT_SETTINGS);

	return {
		subscribe,
		loadSettings: async () => {
			try {
				const response = await fetch('/api/settings');
				if (!response.ok) {
					throw new Error('Failed to load settings');
				}
				const settings = await response.json();
				console.log("Loaded settings:", settings);
				set(settings);
			} catch (error) {
				console.error("Error loading settings:", error);
				set(DEFAULT_SETTINGS);  // Use default settings if there's an error
			}
		},
		updateSettings: async (newSettings: Partial<Settings>) => {
			try {
				const response = await fetch('/api/settings', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newSettings)
				});
				if (!response.ok) {
					throw new Error('Failed to update settings');
				}
				const result = await response.json();
				if (result.success && result.settings) {
					set(result.settings);
				} else {
					throw new Error('Invalid response from server');
				}
			} catch (error) {
				console.error("Error updating settings:", error);
				throw error;
			}
		}
	};
}

export const settings = createSettingsStore();