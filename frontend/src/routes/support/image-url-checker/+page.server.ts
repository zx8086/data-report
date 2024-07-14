// src/routes/support/image-url-checker/+page.server.ts
import { ApolloClient, gql, InMemoryCache, createHttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';
import type { PageServerLoad, Actions } from './$types';

const YOUR_GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

const link = createHttpLink({
	uri: YOUR_GRAPHQL_ENDPOINT,
	fetch,
});

const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});

export const load: PageServerLoad = async ({ params }) => {
	// You can add any initial load logic here if needed
	return {};
};

export const actions: Actions = {
	fetchUrlSuffixes: async ({ request }) => {
		const data = await request.formData();
		const divisions = (data.get('divisions') as string).split(',');
		const season = data.get('season') as string;

		const query = gql`
        query getImageUrlCheck($divisions: [String!]!, $season: String!) {
            getImageUrlCheck(divisions: $divisions, season: $season) {
                divisionCode
                urls
            }
        }
		`;

		try {
			const response = await client.query({
				query,
				variables: { divisions, season }
			});

			const urlSuffixes = response.data.getImageUrlCheck.flatMap(item => item.urls);

			return {
				success: true,
				urlSuffixes
			};
		} catch (error) {
			console.error("Error fetching URL suffixes:", error);
			return {
				success: false,
				error: "Failed to fetch URL suffixes"
			};
		}
	}
};