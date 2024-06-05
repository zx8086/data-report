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
    SELECT META(li).id AS documentKey,
    		li.divisionCode,
        li.lookType,
        li.assetUrl,
        li.title,
        li.trend,
        li.relatedStyles,
        (ARRAY_LENGTH(li.relatedStyles) > 0) AS isCompleted
    FROM default.media_assets.look_items li
    WHERE li.brand = "${brand}"
        AND li.styleSeasonCodeAfs = "${season}"
        AND li.divisionCode = "${division}"
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