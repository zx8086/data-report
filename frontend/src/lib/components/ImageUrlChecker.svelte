<!-- src/components/ImageUrlChecker.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { getCluster } from '$lib/clusterProvider';

	const baseUrl = 'https://s7g10.scene7.com/is/image/TommyHilfigerEU';
	const delayMs = 2000;
	const concurrency = 50;
	const maxRetries = 3;
	const timeout = 10000;

	let divisions: string[] = ['04'];
	let season: string = 'C51';
	let urlSuffixes: string[] = [];
	let failedUrls: {url: string, divisionCode: string}[] = [];
	let processing: boolean = false;
	let progress: number = 0;

	async function fetchUrlSuffixes() {
		try {
			const cluster = await getCluster();
			const query = `EXECUTE FUNCTION getImageUrlCheck($divisions, $season)`;
			const result = await cluster.cluster.query(query, {
				parameters: { divisions, season }
			});
			urlSuffixes = result.rows[0].urls;
		} catch (error) {
			console.error('Error fetching URL suffixes:', error);
		}
	}

	async function checkUrls() {
		processing = true;
		failedUrls = [];
		progress = 0;

		for (let i = 0; i < urlSuffixes.length; i += concurrency) {
			const batch = urlSuffixes.slice(i, i + concurrency);
			const promises = batch.map(suffix => checkUrlWithRetry(`${baseUrl}${suffix}`, divisions[0]));
			const results = await Promise.all(promises);

			results.forEach((result, index) => {
				const fullUrl = `${baseUrl}${batch[index]}`;
				if (!result.isReachable) {
					failedUrls = [...failedUrls, { url: fullUrl, divisionCode: divisions[0] }];
				}
			});

			progress = Math.round((i + concurrency) / urlSuffixes.length * 100);
			await new Promise(resolve => setTimeout(resolve, delayMs));
		}

		processing = false;
	}

	async function checkUrlWithRetry(url: string, divisionCode: string, retries = 0): Promise<{isReachable: boolean, status: string}> {
		try {
			const result = await checkUrl(url);
			return result;
		} catch (error) {
			if (retries < maxRetries - 1) {
				await new Promise(resolve => setTimeout(resolve, 1000));
				return checkUrlWithRetry(url, divisionCode, retries + 1);
			} else {
				return { isReachable: false, status: `Max retries reached: ${error.message}` };
			}
		}
	}

	async function checkUrl(url: string): Promise<{isReachable: boolean, status: string}> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					// ... (include all headers from your original script)
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

			return { isReachable: true, status: response.status.toString() };
		} catch (error) {
			clearTimeout(timeoutId);
			if (error.name === 'AbortError') {
				return { isReachable: false, status: 'Request timed out' };
			}
			throw error;
		}
	}

	onMount(fetchUrlSuffixes);
</script>

<div>
	<h2>Image URL Checker</h2>
	<div>
		<label for="season">Season:</label>
		<input id="season" type="text" bind:value={season} />
	</div>
	<div>
		<label for="divisions">Divisions (comma-separated):</label>
		<input id="divisions" type="text" bind:value={divisions} />
	</div>
	<button on:click={fetchUrlSuffixes} disabled={processing}>Fetch URL Suffixes</button>
	<button on:click={checkUrls} disabled={processing || urlSuffixes.length === 0}>
		{processing ? 'Processing...' : 'Check URLs'}
	</button>

	{#if processing}
		<p>Progress: {progress}%</p>
	{/if}

	<h3>Failed URLs ({failedUrls.length}):</h3>
	<ul>
		{#each failedUrls as item}
			<li>{item.url} (Division: {item.divisionCode})</li>
		{/each}
	</ul>
</div>