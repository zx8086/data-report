// +page.server.ts
import { ApolloClient, gql, InMemoryCache, createHttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';
import type { Load } from '@sveltejs/kit';

export interface LooksSummary {
	hasDeliveryName: number;
	hasDescription: number;
	hasGender: number;
	hasRelatedStyles: number;
	hasTag: number;
	relatedStyles: number;
	hasTitle: number;
	hasTrend: number;
	totalLooks: number;
}

interface LooksSummaryResponse {
	looksSummary: LooksSummary[];
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
      query looksSummary($brand: String!, $division: String!, $season: String!) {
          looksSummary(brand: $brand, division: $division, season: $season) {
              hasDeliveryName
              hasDescription
              hasGender
              hasRelatedStyles
              hasTag
              hasTitle
              hasTrend
              totalLooks
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
		const response = await client.query<LooksSummaryResponse>({ query, variables });
		console.log("Fetched from Endpoint:", response.data);

		if (response.data.looksSummary.length > 0) {
			return { props: response.data.looksSummary[0] };
		} else {
			return {
				status: 404, // Indicate "Not Found"
				error: "No looks found for the given parameters."
			};
		}
	} catch (error) {
		console.error("Error fetching looks:", error);
		return {
			status: 500,
			error: "Error fetching looks data."
		};
	}
};