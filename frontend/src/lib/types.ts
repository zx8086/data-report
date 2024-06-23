// $types.ts
import type { LoadEvent } from '@sveltejs/kit';

// In selectedItemStore.ts or a separate types file
export interface SelectedItemType {
	type: string;
	data: {
		optionCode: string;
		description: string;
		imageUrl?: string;
	};
	meta: {
		styleSeasonCode: string;
		brandCode: string;
		divisionCode: string;
	};
}

export interface Collection {
	description: string;
	imageUrl: string;
	optionCode: string;
	isAvailable: boolean;
	isCancelled: boolean;
	isClosed: boolean;
	isInvalid: boolean;
	isLicensed: boolean;
	isNew: boolean;
	isOpenForEcom: boolean;
	isSoldOut: boolean;
	isUpdated: boolean;
	hasDeliveryDropDate: boolean;
	activeOption: boolean;
	brandCode: string;
	divisionCode: string;
	images: string[];
}

export interface Look {
	assetUrl: string;
	divisionCode: string;
	documentKey: string;
	isDeleted: boolean;
	lookType: string;
	relatedStyles: string[];
	title: string;
	trend: string[];
}

// Define LooksSummary interface
export interface LooksSummary {
	__typename: string;
	hasDeliveryName: number;
	hasDescription: number;
	hasGender: number;
	hasRelatedStyles: number;
	hasTag: number;
	relatedStyles: number;
	hasTitle: number;
	hasTrend: number;
	totalLooks: number;
}

// Define CollectionsSummary interface
export interface CollectionsSummary {
	__typename: string;
	totalOptions: number;
	hasImages: number;
	isActive: number;
	isAvailable: number;
	isCancelled: number;
	isClosed: number;
	isInvalid: number;
	isLicensed: number;
	isNew: number;
	isSoldOut: number;
	isUpdated: number;
	isOpenForEcom: number;
	hasDeliveryDates: number;
}

export interface LooksSummaryResponse {
	looksSummary: LooksSummary;
}

export interface CollectionsSummaryResponse {
	optionsSummary: CollectionsSummary;
}

// Export PageServerLoad type
export type PageServerLoad = (event: LoadEvent) => Promise<{
	looksData: LooksSummary;
	collectionsData: CollectionsSummary;
}>;
