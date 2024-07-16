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

interface SearchDocumentsResponse {
	searchDocuments: {
		bucket: string;
		scope: string;
		collection: string;
		data: any;
		timeTaken: number;
	}[];
}

export const actions: Actions = {
	searchDocuments: async ({ request }) => {
		const data = await request.formData();
		const collections = JSON.parse(data.get('collections') as string);
		const keys = JSON.parse(data.get('keys') as string);

		if (collections.length === 0 || keys.length === 0) {
			return {
				type: 'error',
				error: "Missing required parameters"
			};
		}

		const query = gql`
        query searchDocuments($collections: [BucketScopeCollection!]!, $keys: [String!]!) {
            searchDocuments(collections: $collections, keys: $keys) {
                bucket
                scope
                collection
                data
                timeTaken
            }
        }
		`;

		try {
			const response = await client.query<SearchDocumentsResponse>({
				query,
				variables: { collections, keys }
			});

			return {
				type: 'success',
				data: response.data.searchDocuments
			};
		} catch (error) {
			console.error("Error searching documents:", error);
			return {
				type: 'error',
				error: error instanceof Error ? error.message : "An unknown error occurred"
			};
		}
	}
};