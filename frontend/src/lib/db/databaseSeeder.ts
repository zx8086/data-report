// src/lib/databaseSeeder.ts

// src/lib/databaseSeeder.ts
import { db } from './database';
import { makeGrpcCall } from '$lib/grpcClient';
import type { SeasonalAssignmentsResponse } from '$lib/types';

export async function seedDatabase(styleSeasonCode: string) {
	try {
		// Fetch data from gRPC endpoint
		const response = await makeGrpcCall<SeasonalAssignmentsResponse>('getAllSeasonalAssignments', {
			styleSeasonCode,
		});

		// Prepare statements
		const insertAssignment = db.prepare(`
      INSERT OR REPLACE INTO seasonal_assignments 
      (company_code, name, brand, brand_name, style_season_code, channels, sales_organization_codes, fms_year, created_on, modified_on)
      VALUES ($company_code, $name, $brand, $brand_name, $style_season_code, $channels, $sales_organization_codes, $fms_year, $created_on, $modified_on)
    `);

		const insertDivision = db.prepare(`
      INSERT OR REPLACE INTO divisions 
      (company_code, division_code, division_name, is_active)
      VALUES ($company_code, $division_code, $division_name, $is_active)
    `);

		const insertFmsSeason = db.prepare(`
      INSERT OR REPLACE INTO fms_seasons
      (company_code, season_code, season_name)
      VALUES ($company_code, $season_code, $season_name)
    `);

		// Start a transaction
		db.transaction(() => {
			for (const assignment of response.assignments) {
				insertAssignment.run({
					company_code: assignment.companyCode,
					name: assignment.name,
					brand: assignment.brand,
					brand_name: assignment.brandName,
					style_season_code: assignment.styleSeasonCode,
					channels: JSON.stringify(assignment.channels),
					sales_organization_codes: JSON.stringify(assignment.salesOrganizationCodes),
					fms_year: assignment.fms.year,
					created_on: assignment.createdOn,
					modified_on: assignment.modifiedOn,
				});

				for (const division of assignment.divisions) {
					insertDivision.run({
						company_code: assignment.companyCode,
						division_code: division.code,
						division_name: division.name,
						is_active: division.isActive ? 1 : 0,
					});
				}

				for (const season of assignment.fms.season) {
					insertFmsSeason.run({
						company_code: assignment.companyCode,
						season_code: season.code,
						season_name: season.name,
					});
				}
			}
		})();

		console.log(`Database seeded with seasonal assignments for ${styleSeasonCode}`);
	} catch (error) {
		console.error('Error seeding database:', error);
	}
}