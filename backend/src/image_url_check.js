const baseUrl = 'https://s7g10.scene7.com/is/image/TommyHilfigerEU';
const delayMs = 2000; // Increased delay between batches
const concurrency = 50; // Number of concurrent requests
const maxRetries = 3; // Maximum number of retries for each URL
const timeout = 10000; // 10 second timeout for each request

async function checkUrls() {
	try {
		const jsonFile = Bun.file("url_suffixes.json");

		if (!(await jsonFile.exists())) {
			throw new Error("url_suffixes.json does not exist");
		}

		const jsonContent = await jsonFile.text();
		const data = JSON.parse(jsonContent);

		const failedUrls = [];

		for (const division of data) {
			console.log(`Processing division: ${division.divisionCode}`);
			const urlSuffixes = division.urls;

			for (let i = 0; i < urlSuffixes.length; i += concurrency) {
				const batch = urlSuffixes.slice(i, i + concurrency);
				const promises = batch.map(suffix => checkUrlWithRetry(`${baseUrl}${suffix}`, division.divisionCode));
				const results = await Promise.all(promises);

				results.forEach((result, index) => {
					const fullUrl = `${baseUrl}${batch[index]}`;
					console.log(`${fullUrl} - ${result.isReachable ? 'Reachable' : 'Not Reachable'} (${result.status})`);
					if (!result.isReachable) {
						failedUrls.push({ url: fullUrl, divisionCode: division.divisionCode });
					}
				});

				await Bun.sleep(delayMs);
			}
		}

		return failedUrls;
	} catch (error) {
		console.error('Error:', error.message);
		return [];
	}
}

async function checkUrlWithRetry(url, divisionCode, retries = 0) {
	try {
		console.log(`Checking URL (attempt ${retries + 1}): ${url} (Division: ${divisionCode})`);
		const result = await checkUrl(url);
		console.log(`Result for ${url}: ${JSON.stringify(result)}`);
		return result;
	} catch (error) {
		if (retries < maxRetries - 1) {
			console.log(`Retrying ${url} (attempt ${retries + 2})`);
			await Bun.sleep(1000); // Wait 1 second before retrying
			return checkUrlWithRetry(url, divisionCode, retries + 1);
		} else {
			console.log(`Max retries reached for ${url}`);
			return { isReachable: false, status: `Max retries reached: ${error.message}` };
		}
	}
}

async function checkUrl(url) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
				'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
				'cache-control': 'max-age=0',
				'pragma': 'akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-check-cacheable, akamai-x-get-cache-key, akamai-x-get-extracted-values, akamai-x-get-ssl-client-session-id, akamai-x-get-true-cache-key, akamai-x-serial-no, akamai-x-get-request-id,akamai-x-get-nonces,akamai-x-get-client-ip,akamai-x-feo-trace',
				'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'document',
				'sec-fetch-mode': 'navigate',
				'sec-fetch-site': 'cross-site',
				'sec-fetch-user': '?1',
				'upgrade-insecure-requests': '1',
				'Referer': 'https://claude.ai/',
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
			},
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		const contentType = response.headers.get('Content-Type');
		const text = await response.text();

		if (!response.ok) {
			return { isReachable: false, status: `${response.status} - ${text.trim()}` };
		}

		if (!contentType || !contentType.startsWith('image/')) {
			return { isReachable: false, status: `Not an image - ${text.trim()}` };
		}

		if (text.includes('Unable to find image')) {
			return { isReachable: false, status: `Image not found - ${text.trim()}` };
		}

		return { isReachable: true, status: response.status };
	} catch (error) {
		clearTimeout(timeoutId);
		if (error.name === 'AbortError') {
			return { isReachable: false, status: 'Request timed out' };
		}
		throw error;
	}
}

async function main() {
	console.log("Starting URL check process...");
	const startTime = Date.now();
	const failedUrls = await checkUrls();
	const endTime = Date.now();

	const outputFile = Bun.file("failed_urls.txt");
	const failedUrlsContent = failedUrls.map(item => `${item.url} (Division: ${item.divisionCode})`).join('\n');
	await Bun.write(outputFile, failedUrlsContent);

	console.log("\nFailed URLs:");
	failedUrls.forEach(item => console.log(`${item.url} (Division: ${item.divisionCode})`));
	console.log(`\nTotal failed URLs: ${failedUrls.length}`);
	console.log(`Failed URLs have been written to failed_urls.txt`);
	console.log(`Total execution time: ${(endTime - startTime) / 1000} seconds`);
}

main();