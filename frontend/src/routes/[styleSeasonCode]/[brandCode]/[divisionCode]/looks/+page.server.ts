// +page.server.ts
import { ApolloClient, ApolloError, gql, InMemoryCache, createHttpLink } from '@apollo/client/core';
import type { SelectedItemType, ImageDetails, LookDetails } from '$lib/types';

import fetch from 'cross-fetch';
import type { PageServerLoad, Actions } from './$types';
import type { Load } from '@sveltejs/kit';

interface Look {
	assetUrl: string;
	divisionCode: string;
	documentKey: string;
	isDeleted: boolean;
	lookType: number;
	relatedStyles: string[];
	title: string;
	trend: string[];
}

interface LooksResponse {
	looks: Look[];
}

const brandCodeToBrand: any = {
	THEU: 'TH',
	CKEU: 'CK',
	NIKE: 'NIKE',
};

const YOUR_GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

const link = createHttpLink({
	uri: YOUR_GRAPHQL_ENDPOINT,
	fetch,
});

const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});

export const load: Load = async ({ params }) => {
	const { styleSeasonCode: season, brandCode, divisionCode: division } = params;

	const brand = brandCode ? (brandCodeToBrand[brandCode] || brandCode) : undefined;

	const query = gql`
      query looks($brand: String!, $division: String!, $season: String!) {
          looks(brand: $brand, division: $division, season: $season) {
							documentKey
              assetUrl
              title
							trend
							lookType
          }
      }
	`;
	const variables = { brand, season, division };

	const link = createHttpLink({
		uri: YOUR_GRAPHQL_ENDPOINT,
		fetch,
	});

	const client = new ApolloClient({
		link,
		cache: new InMemoryCache(),
	});

	try {
		const response = await client.query<LooksResponse>({ query, variables });

		if (response.data.looks.length > 0) {
				// console.log("Data Being Fetched", response.data);
			return { looks: response.data.looks};
		} else {
			return {
				status: 404,
				error: 'No looks found for the given parameters.',
			};
		}
	} catch (error) {
		console.error("Error fetching looks:", error);
		if (error instanceof ApolloError) {
			console.error("GraphQL Errors:", error.graphQLErrors);
			console.error("Network Error:", error.networkError);
		}
		return {
			status: 500,
			error: 'Error fetching looks.',
		};
	}
};

export const actions: Actions = {
	getLookDetails: async ({ request }) => {
		try {
			const data = await request.formData();
			const lookDocKey = data.get('lookDocKey') as string;

			if (!lookDocKey) {
				return { success: false, error: "Missing lookDocKey" };
			}

			const lookDetailsQuery = gql`
          query LookDetails($lookDocKey: String!) {
              lookDetails(lookDocKey: $lookDocKey) {
                  assetUrl
                  brand
                  channels
                  createdOn
                  createdOnSourceSystem
                  deliveryName
                  description
                  divisionCode
                  documentUpdatedBy
                  gender
                  isDeleted
                  lookId
                  lookType
                  modifiedOn
                  modifiedOnSourceSystem
                  nuxeoId
                  position
                  processedOn
                  relatedStyles
                  sourceSystem
                  styleSeasonCodeAfs
                  tag
                  title
                  trend
              }
          }
			`;

			const response = await client.query({ query: lookDetailsQuery, variables: { lookDocKey } });
			const lookData = response.data.lookDetails;

			if (lookData) {
				const { __typename, ...cleanedLookData } = lookData;

				console.log("cleanedLookData...:", cleanedLookData);
				return cleanedLookData
			} else {
				return { success: false, error: "No look details found for the given parameters." };
			}
		} catch (error) {
			console.error("Error in getLookDetails action:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error fetching look details"
			};
		}
	}
};