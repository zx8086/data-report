// +page.server.ts
import { ApolloClient, gql, InMemoryCache, createHttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';
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

export const load: Load = async ({ params }) => {
	const { styleSeasonCode: season, brandCode, divisionCode: division } = params;

	const brand = brandCode ? (brandCodeToBrand[brandCode] || brandCode) : undefined;

	const query = gql`
      query looks($brand: String!, $division: String!, $season: String!) {
          looks(brand: $brand, division: $division, season: $season) {
              assetUrl
              title
							trend
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
		const response = await client.query<LooksResponse>({ query, variables }); // Typed response
		// console.log("Fetched from Endpoint:", response.data); // Log response

		if (response.data.looks.length > 0) {

			return response.data

		} else {
			throw new Error('No looks found for the given parameters.');
		}
	} catch (error) {
		console.error("Error fetching looks:", error); // Log specific error
		return {
			status: 404,
			error: new Error('Not found'),
		};
	}
};
