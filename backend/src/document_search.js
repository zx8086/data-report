const couchbase = require('couchbase');

async function main() {
	// Initialize the Couchbase connection
	const cluster = await couchbase.connect(Bun.env.COUCHBASE_URL, {
		username: Bun.env.COUCHBASE_USERNAME,
		password: Bun.env.COUCHBASE_PASSWORD,
	});

	const bucket = cluster.bucket('default');
	const documentKey = 'OPTION_65_C51_LV047B358GCEF';

	// List of scopes and collections
	const scopes = {
		'scope1': ['collection1', 'collection2'],
		'scope2': ['collection3', 'collection4']
	};

	// Iterate over each scope and collection
	for (const [scopeName, collections] of Object.entries(scopes)) {
		for (const collectionName of collections) {
			const query = `SELECT META().id, * FROM \`${scopeName}\`.\`${collectionName}\` USE KEYS '${documentKey}'`;
			try {
				const result = await cluster.query(query);
				if (result.rows.length > 0) {
					console.log(`Found document in ${scopeName}.${collectionName}:`, result.rows);
				}
			} catch (error) {
				console.error(`Error querying ${scopeName}.${collectionName}:`, error);
			}
		}
	}
}

main().catch((err) => {
	console.error('Error:', err);
});
