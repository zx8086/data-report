// src/lib/backgroundJobs.ts

import { makeGrpcCall } from '$lib/grpcClient';
import type { SeasonalAssignmentsResponse } from '$lib/types';
import { initializeDatabase } from '$lib/db/database';
import { cacheDataInDatabase } from '$lib/db/databaseOperations';

export async function updateSeasonalAssignments() {
	try {
		initializeDatabase();

		const styleSeasonCodesToUpdate: any = ['C51', 'C52'];

		for (const styleSeasonCode of styleSeasonCodesToUpdate) {
			console.log(`Background Job: Updating data for style season code: ${styleSeasonCode}`);

			const response : SeasonalAssignmentsResponse = await makeGrpcCall<SeasonalAssignmentsResponse>('getAllSeasonalAssignments', {
				styleSeasonCode,
			});

			cacheDataInDatabase(response)
			console.log("Background Job: cacheDataInDatabase Response", response)
			console.log(`Background Job: Updated data for style season code: ${styleSeasonCode}`);
		}
	} catch (error) {
		console.error('Error updating seasonal assignments:', error);
	}
}