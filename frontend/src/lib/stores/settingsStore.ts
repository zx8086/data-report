// src/lib/stores/settingsStore.ts
import { writable } from 'svelte/store';

export interface Settings {
	activeOption: boolean;
	salesChannels: string[];
}

function createSettingsStore() {
	const { subscribe, set, update } = writable<Settings>({ activeOption: false, salesChannels: [] });

	return {
		subscribe,
		updateSettings: async (newSettings: Partial<Settings>) => {
			try {
				console.log("Attempting to update settings with:", newSettings);
				const response = await fetch('/api/settings', {
					method: 'POST',
					body: JSON.stringify(newSettings),
					headers: { 'Content-Type': 'application/json' }
				});
				if (!response.ok) {
					throw new Error('Failed to update settings');
				}
				const result = await response.json();
				console.log("Received updated settings from server:", result);
				if (result.success && result.settings) {
					set(result.settings);
					return result.settings;
				} else {
					throw new Error('Invalid response from server');
				}
			} catch (error) {
				console.error("Error updating settings:", error);
				throw error;
			}
		},
		loadSettings: async () => {
			try {
				const response = await fetch('/api/settings');
				if (!response.ok) {
					throw new Error('Failed to load settings');
				}
				const result = await response.json();
				console.log("Loaded settings:", result);
				if (result.settings) {
					set(result.settings);
				} else {
					throw new Error('Invalid response from server');
				}
			} catch (error) {
				console.error("Error loading settings:", error);
				throw error;
			}
		}
	};
}

export const settings = createSettingsStore();