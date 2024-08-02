// src/lib/databaseOperations.ts
import { db } from './database';
import type { SeasonalAssignmentsResponse, SeasonalAssignment } from '$lib/types';

export function cacheDataInDatabase(response: SeasonalAssignmentsResponse) {
	db.transaction(() => {
		for (const assignment of response.assignments) {
			db.prepare(`
        INSERT OR REPLACE INTO seasonal_assignments 
        (company_code, name, brand, brand_name, style_season_code, channels, sales_organization_codes, fms_year, created_on, modified_on)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
				assignment.companyCode,
				assignment.name,
				assignment.brand,
				assignment.brandName,
				assignment.styleSeasonCode,
				JSON.stringify(assignment.channels),
				JSON.stringify(assignment.salesOrganizationCodes),
				assignment.fms.year,
				assignment.createdOn,
				assignment.modifiedOn
			);

			for (const division of assignment.divisions) {
				db.prepare(`
          INSERT OR REPLACE INTO divisions 
          (company_code, division_code, division_name, is_active)
          VALUES (?, ?, ?, ?)
        `).run(
					assignment.companyCode,
					division.code,
					division.name,
					division.isActive ? 1 : 0
				);
			}

			for (const season of assignment.fms.season) {
				db.prepare(`
          INSERT OR REPLACE INTO fms_seasons
          (company_code, season_code, season_name)
          VALUES (?, ?, ?)
        `).run(
					assignment.companyCode,
					season.code,
					season.name
				);
			}
		}
	})();
	console.log("cacheDataInDatabase: Database seeded with seasonal assignments");
}

export function fetchDataFromDatabase(styleSeasonCode: string, companyCode?: string, isActive?: boolean): SeasonalAssignmentsResponse {

	console.log(`Fetching Assignments from database: ${styleSeasonCode}:`)

	let query = `
    SELECT sa.*, 
           GROUP_CONCAT(DISTINCT d.division_code || ':' || d.division_name || ':' || d.is_active) as divisions,
           GROUP_CONCAT(DISTINCT fs.season_code || ':' || fs.season_name) as fms_seasons
    FROM seasonal_assignments sa
    LEFT JOIN divisions d ON sa.company_code = d.company_code
    LEFT JOIN fms_seasons fs ON sa.company_code = fs.company_code
    WHERE sa.style_season_code = ?
  `;

	const params: any[] = [styleSeasonCode];

	if (companyCode) {
		query += " AND sa.company_code = ?";
		params.push(companyCode);
	}

	if (isActive !== undefined) {
		query += " AND d.is_active = ?";
		params.push(isActive ? 1 : 0);
	}

	query += " GROUP BY sa.company_code";

	const rows = db.prepare(query).all(params);

	const assignments: SeasonalAssignment[] = rows.map(row => ({
		companyCode: row.company_code,
		name: row.name,
		brand: row.brand,
		brandName: row.brand_name,
		styleSeasonCode: row.style_season_code,
		channels: JSON.parse(row.channels),
		divisions: row.divisions ? row.divisions.split(',').map((div: string) => {
			const [code, name, isActive] = div.split(':');
			return { code, name, isActive: isActive === '1' };
		}) : [],
		fms: {
			season: row.fms_seasons ? row.fms_seasons.split(',').map((season: string) => {
				const [code, name] = season.split(':');
				return { code, name };
			}) : [],
			year: row.fms_year
		},
		salesOrganizationCodes: JSON.parse(row.sales_organization_codes),
		createdOn: row.created_on,
		modifiedOn: row.modified_on
	}));

	console.log("DB: Assignments from fetchDataFromDatabase function being returned", assignments);
	return { assignments };
}