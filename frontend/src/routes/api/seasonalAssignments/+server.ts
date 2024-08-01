// src/routes/api/seasonalAssignments/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { makeGrpcCall } from '$lib/grpcClient';
import type { Division, SeasonalAssignment, SeasonalAssignmentsResponse } from '$lib/types'

export const GET: RequestHandler = async ({ url }) => {
	const styleSeasonCode = url.searchParams.get('styleSeasonCode');
	const companyCode = url.searchParams.get('companyCode');
	const isActive = url.searchParams.get('isActive') === 'true';

	if (!styleSeasonCode) {
		return json({ error: 'styleSeasonCode is required' }, { status: 400 });
	}

	try {
		let response: SeasonalAssignmentsResponse;

		if (companyCode) {
			// Fetch for a specific company
			response = await makeGrpcCall<SeasonalAssignmentsResponse>('getAllSeasonalAssignments', {
				styleSeasonCode,
				companyCode,
				isActive
			});
		} else {
			// Fetch for all companies
			response = await makeGrpcCall<SeasonalAssignmentsResponse>('getAllSeasonalAssignments', {
				styleSeasonCode,
				isActive
			});
		}

		console.log("gRPC response:", JSON.stringify(response, null, 2));

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