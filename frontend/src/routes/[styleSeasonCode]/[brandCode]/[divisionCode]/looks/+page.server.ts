// +page.server.ts
import { ApolloClient, gql, InMemoryCache, createHttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';
import type { Load } from '@sveltejs/kit';
import { ApolloError } from 'apollo-client';

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