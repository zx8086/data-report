const couchbase = require('couchbase');

async function queryCollection(cluster, scopeName, collectionName, documentKey) {
	const query = `SELECT META().id, * FROM \`default\`.\`${scopeName}\`.\`${collectionName}\` USE KEYS '${documentKey}'`;

	console.log("Query:",query)
	console.time("queryCollection");
	const result = await cluster.query(query);
	console.timeEnd("queryCollection");
	if (result.rows.length > 0) {
		console.log(`Found document in ${scopeName}.${collectionName}:`, result.rows);
	}
}

async function main() {
	console.time("main")
	const cluster = await couchbase.connect(Bun.env.COUCHBASE_URL, {
		username: Bun.env.COUCHBASE_USERNAME,
		password: Bun.env.COUCHBASE_PASSWORD,
	});
	const bucket = cluster.bucket('default');

	// Add searchable key here....
	const documentKey = Bun.env.COUCHBASE_SEARCH_DOCUMENT;
	console.log(`Document key: ${documentKey}`);

	const scopes = {
		'order': ['archived-order-items', 'archived-orders'],
		'seasons': ['dates', 'dates_import', 'delivery_dates_import', 'delivery_dates'],
		'brands_divisions': ['brands_divisions'],
		'media_assets': ['look_items'],
		'styles': ['article', 'variant', 'prepacks', 'distribution_curves', 'product2g'],
		'customer': ['assignments', 'sales-organizations', 'customers'],
		'_default': ['_default', 'data_merge_check']
	};

	for (const [scopeName, collections] of Object.entries(scopes)) {
		for (const collectionName of collections) {
			await queryCollection(cluster, scopeName, collectionName, documentKey);
		}
	}
	console.timeEnd("main");

}

main().catch((err) => {
	console.error('Error:', err);
}).finally(() => {
	console.log('Exiting program');
	process.exit();
});