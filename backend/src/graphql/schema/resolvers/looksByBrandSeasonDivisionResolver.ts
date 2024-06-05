// looksByBrandSeasonDivisionResolver.ts

import {getCluster} from "../../../lib/clusterProvider";

interface QueryParameters {
	brand: string;
	season: string;
	division: string;
}

const looksByBrandSeasonDivisionResolver = {
	Query: {
		looksByBrandSeasonDivision: async (_: unknown, args: QueryParameters): Promise<any> => {
			const {brand, season, division} = args;

			// Get connection
			const connection = await getCluster();

			// Specify your SQL++ query with inlined parameters
			const queryString = `
    SELECT li.divisionCode,
        li.lookType,
        META(li).id AS 'documentKey',
        li.assetUrl,
        li.title,
        li.trend,
        li.relatedStyles
    FROM default.media_assets.look_items li
    WHERE li.brand = "${brand}"
        AND li.styleSeasonCodeAfs = "${season}"
        AND li.divisionCode = "${division}"
        AND li.lookType IN [1, 2, 3, 4, 5, 9, 11]
`;

			console.log(queryString);
			// Execute the query and store the result
			const queryResult = await connection.cluster.query(queryString);

			// Log the result
			console.log(queryResult);

			// Return the result
			return queryResult;
		},
	},
};

export default looksByBrandSeasonDivisionResolver;