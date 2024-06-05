// looksTotalsByBrandSeasonDivisionResolver.ts

import { getCluster } from "../../../lib/clusterProvider";

interface QueryParameters {
	brand: string;
	season: string;
	division: string;
}

const looksByBrandSeasonDivisionResolver = {
	Query: {
		looksByBrandSeasonDivision: async (_: unknown, args: QueryParameters): Promise<any> => {
			try {
				const {brand, season, division} = args;

				// GetByIdsRequest
				const connection = await getCluster();

				const queryString = `
SELECT 
    COUNT(*) AS totalLooks,
    IFMISSING(SUM(CASE WHEN (li.relatedStyles IS NOT MISSING AND li.relatedStyles IS NOT NULL AND ARRAY_LENGTH(li.relatedStyles) > 0 ) THEN 1 ELSE 0 END), 0) AS hasRelatedStyles,
    IFMISSING(SUM(CASE WHEN (li.title IS NOT MISSING AND li.title IS NOT NULL AND li.title != '') THEN 1 ELSE 0 END), 0) AS hasTitle,
    IFMISSING(SUM(CASE WHEN (li.trend IS NOT MISSING AND li.trend IS NOT NULL AND li.trend != '') THEN 1 ELSE 0 END), 0) AS hasTrend,
    IFMISSING(SUM(CASE WHEN (li.deliveryName IS NOT MISSING AND li.deliveryName IS NOT NULL AND li.deliveryName != '') THEN 1 ELSE 0 END), 0) AS hasDeliveryName,
    IFMISSING(SUM(CASE WHEN (li.description IS NOT MISSING AND li.description IS NOT NULL AND li.description != '') THEN 1 ELSE 0 END), 0) AS hasDescription,
    IFMISSING(SUM(CASE WHEN (li.gender IS NOT MISSING AND li.gender IS NOT NULL AND li.gender != '') THEN 1 ELSE 0 END), 0) AS hasGender,
    IFMISSING(SUM(CASE WHEN (li.tag IS NOT MISSING AND li.tag IS NOT NULL AND li.tag != '') THEN 1 ELSE 0 END), 0) AS hasTag
FROM default.media_assets.look_items li
WHERE li.brand = $brand
    AND li.styleSeasonCodeAfs = $season
    AND li.divisionCode = $division
    AND li.lookType IN [1, 2, 3, 4, 5, 9, 11]
`;

				console.log(queryString);

// Create an options object to include the parameters
				let queryOptions = {
					parameters: [brand, season, division],
				};

// Execute the query and store the result
				const queryResult = await connection.cluster.query(queryString);

				// Log the result
				console.log(queryResult);

				// Return the result
				return queryResult.rows;
			} catch (error) {
				console.error('Error:', error);
				throw error;
			}
		},
	},
};

export default looksByBrandSeasonDivisionResolver;