// looksByBrandSeasonDivision.ts

import {getCluster} from "../../../lib/clusterProvider";
// import { QueryResult } from 'couchbase';

interface QueryParameters {
	brand: string;
	season: string;
	division: string;
}

const looksByBrandSeasonDivision = {
	Query: {
		looksByBrandSeasonDivision: async (_: unknown, args: QueryParameters): Promise<any> => {
			const {brand, season, division} = args;

			// Get connection
			// const connection = await getCluster();

			// Specify your SQL++ query with inlined parameters
			const queryString = `
    SELECT li.divisionCode,
        li.lookType,
        META().id AS documentKey,
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
			// const queryResult = await connection.cluster.query(queryString);

			// Log the result
			// console.log(queryResult);

			// Return the result

			let queryResult: any;
			queryResult = [{
				'divisionCode': '97',
				'lookType': 1,
				'documentKey': 'LOOK_NIKE_C51_97_1_073f1900-5eea-4e98-8ac6-9c3b3779eb9b',
				'relatedStyles': [],
				'title': 'KE1228_001_EliteCottonStretch_Jeremy_Doku_2.jpg',
				'assetUrl': 'https://s7g10.scene7.com/is/image/TommyHilfigerEU/KE1228_001_EliteCottonStretch_Jeremy_Doku_2_C5197'
			},
				{
					'divisionCode': '97',
					'lookType': 1,
					'documentKey': 'LOOK_NIKE_C51_97_1_0a88ad3e-4028-46a7-9941-9e1e490d5cfb',
					'relatedStyles': [
						'OPTION_97_C51_0000KE1160BIO'
					],
					'title': 'KE1160_BIO_EssentialMicoLE_model_01.jpg',
					'assetUrl': 'https://s7g10.scene7.com/is/image/TommyHilfigerEU/KE1160_BIO_EssentialMicoLE_model_01_C5197'
				}];
			return queryResult;
		},
	},
};

export default looksByBrandSeasonDivision;