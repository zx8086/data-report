// src/routes/api/seasonalAssignments/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { makeGrpcCall } from '$lib/grpcClient';
import type { SeasonalAssignmentsResponse } from '$lib/types';
import { initializeDatabase } from '$lib/db/database';
import { cacheDataInDatabase, fetchDataFromDatabase } from '$lib/db/databaseOperations';

export const GET: RequestHandler = async ({ url }) => {
	const styleSeasonCode : string | null = url.searchParams.get('styleSeasonCode');
	const companyCode : any = url.searchParams.get('companyCode');
	const isActive : boolean = url.searchParams.get('isActive') === 'true';

	if (!styleSeasonCode) {
		return json({ error: 'styleSeasonCode is required' }, { status: 400 });
	}

	try {
		// Initialize the database schema
		initializeDatabase();

		let response: SeasonalAssignmentsResponse;

		// Check if we have data for this styleSeasonCode
		const cachedData = fetchDataFromDatabase(styleSeasonCode, companyCode, isActive);

		if (cachedData.assignments.length === 0) {
			// If no data exists in the database, fetch from gRPC
			console.log(`getAllSeasonalAssignments called with:`, { styleSeasonCode, companyCode, isActive });

			response = await makeGrpcCall<SeasonalAssignmentsResponse>('getAllSeasonalAssignments', {
				styleSeasonCode,
				companyCode,
				isActive
			});

			// Cache the data in the database
			cacheDataInDatabase(response);
		} else {
			response = cachedData;
		}

		console.log("Response:", JSON.stringify(response, null, 2));

		if (companyCode) {
			// If companyCode is provided, return only the matching assignment
			const assignment = response.assignments.find(a => a.companyCode === companyCode);
			if (assignment) {
				return json({ assignments: [assignment] });
			} else {
				return json({ assignments: [] });
			}
		} else {
			// If no companyCode, return all assignments
			return json(response);
		}
	} catch (error) {
		console.error('Error fetching seasonal assignments:', error);
		return json({ error: 'Failed to fetch seasonal assignments' }, { status: 500 });
	}
};