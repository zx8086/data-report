// documentSearch.ts

import { getCluster } from "../../lib/clusterProvider";

const documentSearch = {
	Query: {
		searchDocuments: async (_: unknown, args: { collections: { bucket: string, scope: string, collection: string }[], keys: string[] }): Promise<any[]> => {
			try {
				const { collections, keys } = args;
				const cluster = await getCluster();
				const results = [];

				for (const key of keys) {
					for (const { bucket, scope, collection } of collections) {
						const query = `SELECT META().id, * FROM \`${bucket}\`.\`${scope}\`.\`${collection}\` USE KEYS $key`;
						const queryOptions = {
							parameters: { key },
						};

						console.log("Query", query);
						console.log("queryOptions", queryOptions);

						const start = Date.now();
						const result = await cluster.cluster.query(query, queryOptions);
						const timeTaken = Date.now() - start;

						results.push({
							bucket,
							scope,
							collection,
							data: result.rows[0] || null,
							timeTaken
						});

						console.log(`Time taken to search in ${bucket}.${scope}.${collection}: ${timeTaken}ms`);
					}
				}

				return results;
			} catch (error) {
				console.error('Error:', error);
				throw error;
			}
		},
	},
};

export default documentSearch;