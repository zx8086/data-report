// In selectedItemStore.ts
import { writable } from 'svelte/store';
import type { SelectedItemType } from '$lib/types';

export const selectedItem = writable<SelectedItemType | null>(null);