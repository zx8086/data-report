const couchbase = require('couchbase');

async function queryExample() {
	const cluster = await couchbase.connect(Bun.env.COUCHBASE_URL, {
		username: Bun.env.COUCHBASE_USERNAME,
		password: Bun.env.COUCHBASE_PASSWORD,
	});

	const query = 'EXECUTE FUNCTION `default`.`media_assets`.get_looks_summary("TH", "C54", "01")';

	try {
		let result = await cluster.query(query);
		console.log(JSON.stringify(result.rows, null, 2));
	} catch (error) {
		console.error('Error:', error);
	}
}

queryExample()
	.then(r => {
		// Process the result r
	})
	.catch(error => {
		console.error('An error occurred:', error);
		// Handle error or exit gracefully
	})
	.finally(() => {
		console.log('Exiting program');
		process.exit();
	});