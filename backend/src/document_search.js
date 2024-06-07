const couchbase = require('couchbase');

async function queryCollection(cluster, scopeName, collectionName, documentKey) {
	const query = `SELECT META().id, * FROM \`default\`.\`${scopeName}\`.\`${collectionName}\` USE KEYS '${documentKey}'`;

	console.log("Query:",query)

	const result = await cluster.query(query);
	if (result.rows.length > 0) {
		console.log(`Found document in ${scopeName}.${collectionName}:`, result.rows);
	}
}

async function main() {
	const cluster = await couchbase.connect(Bun.env.COUCHBASE_URL, {
		username: Bun.env.COUCHBASE_USERNAME,
		password: Bun.env.COUCHBASE_PASSWORD,
	});
	const bucket = cluster.bucket('default');

	// Add searchable key here....
	const documentKey = 'LOOK_CK_C51_70_2_7e0c7d63-4765-46be-9ae0-2342d7c0aeea';

	const scopes = {
		'_default': ['_default', 'data_merge_check'],
		'order': ['archived-order-items', 'archived-orders'],
		'customer': ['assignments', 'sales-organizations', 'customers'],
		'styles': ['prepacks', 'distribution_curves', 'variant', 'article', 'product2g'],
		'media_assets': ['look_items'],
		'brands_divisions': ['brands_divisions'],
		'seasons': ['delivery_dates_import', 'delivery_dates', 'dates_import', 'dates']
	};

	for (const [scopeName, collections] of Object.entries(scopes)) {
		for (const collectionName of collections) {
			await queryCollection(cluster, scopeName, collectionName, documentKey);
		}
	}
}

main().catch((err) => {
	console.error('Error:', err);
}).finally(() => {
	console.log('Exiting program');
	process.exit();
});