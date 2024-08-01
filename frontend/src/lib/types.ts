// $types.ts
// import type { LoadEvent } from '@sveltejs/kit';


export interface Division {
	name: string;
	code: string;
	isActive: boolean;
}

export interface SeasonalAssignment {
	channels: string[];
	divisions: Division[];
	salesOrganizationCodes: string[];
	companyCode: string;
	name: string;
	brand: string;
	brandName: string;
	styleSeasonCode: string;
	fms: {
		season: Array<{
			code: string;
			name: string;
		}>;
		year: string;
	};
	createdOn: string;
	modifiedOn: string;
}

export interface SeasonalAssignmentsResponse {
	assignments: SeasonalAssignment[];
}


export interface CollectionData {
	optionCode: string;
	description: string;
	imageUrl?: string;
}

export interface Settings {
	activeOption: boolean;
	salesChannels: string[];
}

export interface ImageDetails {
	imageKey?: string;
	backModifiedOn?: string;
	backUrl?: string;
	back2ModifiedOn?: string;
	back2Url?: string;
	detailModifiedOn?: string;
	detailUrl?: string;
	detail2ModifiedOn?: string;
	detail2Url?: string;
	detail3ModifiedOn?: string;
	detail3Url?: string;
	frontModifiedOn?: string;
	frontUrl?: string;
	front2ModifiedOn?: string;
	front2Url?: string;
	insideModifiedOn?: string;
	insideUrl?: string;
	inside2ModifiedOn?: string
	inside2Url?: string
	fabricScanModifiedOn?: string
	fabricScanUrl?: string
	i360ModifiedOn?: string
	i360Url?: string
	imageModifiedOn?: string
	imageUrl?: string
	packageModifiedOn?: string
	packageUrl?: string
	sketchModifiedOn?: string
	sketchUrl?: string
}

export interface SelectedItemMeta {
	styleSeasonCode: string;
	brandCode: string;
	divisionCode: string;
}

export type SelectedItemType =
	| { type: 'collection'; data: CollectionData; meta: SelectedItemMeta; imageDetails?: ImageDetails }
	| { type: 'look'; data: Look; meta: SelectedItemMeta; lookDetails?: LookDetails; isVideo: boolean };

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
	nuxeoId?: string;
	isDeleted: boolean;
	lookType: string;
	gender?: string;
	createdOn?: string;
	createdOnSourceSystem?: string;
	modifiedOn?: string;
	channels?: string[];
	deliveryName?: string | null;
	description?: string | null;
	relatedStyles: string[];
	title: string;
	trend: string[];
}

export interface LookDetails {
	__typename?: string | null;
	assetUrl: string;
	brand: string;
	channels: string[];
	createdOn: string;
	createdOnSourceSystem: string;
	deliveryName: string | null;
	divisionCode: string;
	description: string | null;
	documentUpdatedBy: string;
	gender: string | null;
	isDeleted: boolean;
	lookId: string;
	lookType: number;
	modifiedOn: string;
	modifiedOnSourceSystem: string;
	nuxeoId: string;
	position: number;
	processedOn: string;
	relatedStyles: string[] | string | null;
	sourceSystem: string;
	styleSeasonCodeAfs: string;
	tag: string | null;
	title: string;
	trend: string | null;
}

export interface LooksResponse {
	looks: Look[];
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
// export type PageServerLoad = (event: LoadEvent) => Promise<{
// 	looksData: LooksSummary;
// 	collectionsData: CollectionsSummary;
// }>;
