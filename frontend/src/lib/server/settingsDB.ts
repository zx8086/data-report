// settingsDB.ts
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Settings } from '$lib/types';

const SETTINGS_FILE = join(process.cwd(), 'settings.json');

const DEFAULT_SETTINGS: Settings = {
	activeOption: false,
	salesChannels: ['SELLIN']
};

export function getSettings(): Settings {
	console.log("DB: Checking for settings file at:", SETTINGS_FILE);
	if (!existsSync(SETTINGS_FILE)) {
		console.log("DB: Settings file not found, creating with default settings");
		writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
		return DEFAULT_SETTINGS;
	}
	try {
		const fileContents = readFileSync(SETTINGS_FILE, 'utf-8');
		console.log("DB: Raw file contents:", fileContents);
		const parsedSettings = JSON.parse(fileContents);
		console.log("DB: Parsed settings:", parsedSettings);
		return parsedSettings;
	} catch (error) {
		console.error('DB: Error reading settings file:', error);
		return DEFAULT_SETTINGS;
	}
}

export function updateSettings(newSettings: Partial<Settings>): void {
	console.log("DB: Updating settings with:", newSettings);
	const currentSettings = getSettings();
	const updatedSettings = { ...currentSettings, ...newSettings };
	try {
		writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2));
		console.log('DB: Settings updated successfully:', updatedSettings);
	} catch (error) {
		console.error('DB: Error writing settings file:', error);
		throw error;
	}
}

