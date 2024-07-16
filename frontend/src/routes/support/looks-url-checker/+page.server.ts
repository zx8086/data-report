// +page.server.ts
import { ApolloClient, gql, InMemoryCache, createHttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';
import type { Actions } from './$types';

const YOUR_GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

const link = createHttpLink({
	uri: YOUR_GRAPHQL_ENDPOINT,
	fetch,
});

const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});

interface LooksUrlCheckResponse {
	getLooksUrlCheck: {
		divisionCode: string;
		urls: string[];
	}[];
}

type GraphQLError = {
	message: string;
	locations?: { line: number; column: number }[];
	path?: string[];
	extensions?: Record<string, any>;
};

type ServerResponse = {
	type: 'success' | 'error';
	data?: string;
	error?: string;
	graphQLErrors?: GraphQLError[];
};

export const actions: Actions = {
	checkUrls: async ({ request }): Promise<ServerResponse> => {
		console.log('checkUrls action called');
		const data = await request.formData();
		const divisions = data.getAll('divisions') as string[];
		const season = data.get('season') as string;

		console.log('Received divisions:', divisions);
		console.log('Received season:', season);

		if (divisions.length === 0 || !season) {
			return {
				type: 'error',
				error: "Missing required parameters"
			};
		}

		const query = gql`
        query getLooksUrlCheck($divisions: [String!]!, $season: String!) {
            getLooksUrlCheck(divisions: $divisions, season: $season) {
                divisionCode
                urls
            }
        }
		`;

		try {
			const response = await client.query<LooksUrlCheckResponse>({
				query,
				variables: { divisions, season }
			});

			console.log("GraphQL response:", JSON.stringify(response.data, null, 2));

			if (!response.data.getLooksUrlCheck || response.data.getLooksUrlCheck.length === 0) {
				throw new Error("No data returned from GraphQL query");
			}
			console.log("GraphQL response:", JSON.stringify(response.data.getLooksUrlCheck, null, 2));

			debugger

			return {
				type: 'success',
				data: JSON.stringify(response.data.getLooksUrlCheck)
			};
		} catch (error) {
			console.error("Error fetching URL suffixes:", error);
			return {
				type: 'error',
				error: error instanceof Error ? error.message : "An unknown error occurred",
				graphQLErrors: ((error as any).graphQLErrors as GraphQLError[]) || undefined
			};
		}
	}
};