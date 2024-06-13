const couchbase = require('couchbase');
const couchbaseConfig = {
	url: Bun.env.COUCHBASE_URL,
	username: Bun.env.COUCHBASE_USERNAME,
	password: Bun.env.COUCHBASE_PASSWORD
};

const logMessages = {
	documentKey: 'Document Key',
	documentSearch: 'Document Search',
	querySearch: 'Query'
};

async function getCouchbaseConnection(config) {
	return couchbase.connect(config.url, {
		username: config.username,
		password: config.password
	});
}

async function queryCollection(cluster, bucketName, scopeName, collectionName, documentKey) {
	const timerLabel = `<- Time taken to search in - ${bucketName}.${scopeName}.${collectionName}`;

	const query = `SELECT META().id, * FROM \`${bucketName}\`.\`${scopeName}\`.\`${collectionName}\` USE KEYS '${documentKey}'`;

	console.log(logMessages.querySearch, query);
	console.time(timerLabel);

	const result = await cluster.query(query);

	console.timeEnd(timerLabel);

	if (result.rows.length > 0) {
		console.log(`Found document in ${bucketName}.${scopeName}.${collectionName}:`, result);
	}

	return result;
}

async function documentSearch(cluster, documentKeys, scopesCollections) {
	console.time(logMessages.documentSearch);

	for (const documentKey of documentKeys) {
		console.log(`${logMessages.documentKey}: ${documentKey}`);
		for (const [bucketName, scopes] of Object.entries(scopesCollections)) {
			for (const [scopeName, collections] of Object.entries(scopes)) {
				for (const collectionName of collections) {
					await queryCollection(cluster, bucketName, scopeName, collectionName, documentKey);
				}
			}
		}
	}

	console.timeEnd(logMessages.documentSearch);
}

(async function() {
	const cluster = await getCouchbaseConnection(couchbaseConfig);
	const documentKeyArg = process.argv[2] || defaultDocumentKey;
	let documentKeys = documentKeyArg.includes(',') ? documentKeyArg.split(',').map(x => x.trim()) : [documentKeyArg];

	const bucketScopesCollections = {
		'default': {
			'seasons': ['dates', 'dates_import', 'delivery_dates_import', 'delivery_dates'],
			'brands_divisions': ['brands_divisions'],
			'media_assets': ['look_items'],
			'styles': ['article', 'variant', 'prepacks', 'distribution_curves', 'product2g'],
			'customer': ['assignments', 'sales-organizations', 'customers'],
			'_default': ['_default', 'data_merge_check']
		},
		'prices': {
			'_default': ['_default']
		}
	};

	console.log(`${logMessages.documentKey}: ${documentKeys.join(', ')}`);
	await documentSearch(cluster, documentKeys, bucketScopesCollections);
	process.exit(0);
})();