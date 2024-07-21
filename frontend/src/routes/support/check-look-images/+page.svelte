<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { translateCode } from '$lib/utils/translations';
	import { writable } from 'svelte/store';
	import { onMount, getContext } from 'svelte';
	import { key } from '$lib/context/tracker';

	export let form: ActionData;

	const { getTracker } = getContext(key);

	const delayMs = 2000;
	const concurrency = 50;
	const maxRetries = 3;
	const timeout = 10000;

	let selectedDivisions: string[] = [];
	let selectedSeason = '';
	let urlSuffixes: string[] = [];
	let failedUrls: { url: string, divisionCode: string, status: string, statusCode: number, contentType: string, retries: number }[] = [];
	let processing = false;
	let progress = 0;
	let errorMessage = '';
	let divisionProgress: { [key: string]: { total: number, processed: number } } = {};
	let abortController: AbortController | null = null;

	const logStore = writable<{message: string, status: 'success' | 'error' | 'info'}[]>([]);
	let logBox: HTMLDivElement;

	onMount(() => {
		try {
			const tracker = getTracker();
			if (tracker) {
				try {
					tracker.event('Page_View', {
						page: 'Looks Url Checker',
						category: 'Navigation',
						action: 'View'
					});
				} catch (e) {
					tracker.event('Page_View', {
						page: 'Looks Url Checker',
						category: 'Navigation',
						action: 'View',
						error: `Translation failed - ${e}`
					});
				}
			} else {
				console.warn('Tracker not available');
			}
		} catch (error) {
			console.error('Error in onMount:', error);
		}

		logStore.subscribe(() => {
			if (logBox) {
				logBox.scrollTop = logBox.scrollHeight;
			}
		});
	});

	const seasons = Object.entries({ "C51": "Spring 2025", "C52": "Summer 2025" });
	const divisions = [
		{ code: "01", name: "TH Menswear" },
		{ code: "02", name: "Tommy Jeans" },
		{ code: "03", name: "TH Licensees" },
		{ code: "04", name: "TH Kids" },
		{ code: "05", name: "TH Womenswear" },
		{ code: "07", name: "TH Close to Body" },
		{ code: "09", name: "TH Footwear" },
		{ code: "10", name: "TH Accessories" },
		{ code: "61", name: "CK Menswear" },
		{ code: "62", name: "CK Jeans" },
		{ code: "64", name: "CKJ Kids" },
		{ code: "65", name: "CK Womenswear" },
		{ code: "67", name: "CK Underwear" },
		{ code: "68", name: "CK Sport" },
		{ code: "69", name: "CK Footwear" },
		{ code: "70", name: "CK Accessories" },
		{ code: "77", name: "CK Swimwear" },
		{ code: "97", name: "Nike Underwear" }
	];

	$: totalUrls = urlSuffixes.length;
	$: failedUrlsCount = failedUrls.length;

	function selectAllDivisions() {
		selectedDivisions = divisions.map(d => d.code);
	}

	function deselectAllDivisions() {
		selectedDivisions = [];
	}

	function toggleDivision(divisionCode: string) {
		selectedDivisions = selectedDivisions.includes(divisionCode)
			? selectedDivisions.filter(d => d !== divisionCode)
			: [...selectedDivisions, divisionCode];
	}

	let processComplete = false;

	function addLog(message: string, status: 'success' | 'error' | 'info' = 'info') {
		const timestamp = new Date().toISOString();
		logStore.update(logs => {
			logs.push({message: `[${timestamp}] ${message}`, status});
			return logs.slice(-5000);
		});
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		processing = true;
		processComplete = false;
		failedUrls = [];
		progress = 0;
		errorMessage = '';
		urlSuffixes = [];
		divisionProgress = {};
		logStore.set([]);

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		try {
			const response = await fetch('?/checkUrls', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result && result.type === 'success' && result.data) {
				try {
					const outerData = JSON.parse(result.data);
					if (Array.isArray(outerData) && outerData.length === 3 && outerData[1] === 'success') {
						const innerData = JSON.parse(outerData[2]);
						if (Array.isArray(innerData) && innerData.length > 0) {
							const parsedData = innerData.map(item => ({
								divisionCode: item.divisionCode,
								urls: item.urls
							}));

							urlSuffixes = parsedData.flatMap(item => item.urls);

							if (urlSuffixes.length > 0) {
								abortController = new AbortController();
								await checkUrls(parsedData, abortController.signal);
							} else {
								errorMessage = "No URLs found to check. Please try different selection criteria.";
							}
						} else {
							errorMessage = "Received unexpected data structure from server.";
						}
					} else {
						errorMessage = "Received unexpected data structure from server.";
					}
				} catch (parseError) {
					console.error("Parse error:", parseError);
					errorMessage = "Error parsing server response.";
				}
			} else {
				errorMessage = "Received unexpected response from server.";
			}
		} catch (error) {
			console.error("Fetch error:", error);
			errorMessage = "An error occurred while communicating with the server.";
		}

		processing = false;
		processComplete = true;
	}

	async function checkUrls(data: { divisionCode: string, urls: string[] }[], signal: AbortSignal) {
		failedUrls = [];
		progress = 0;
		divisionProgress = {};

		// Sort data by division code numerically
		const sortedData = data.sort((a, b) => parseInt(a.divisionCode) - parseInt(b.divisionCode));

		try {
			for (const division of sortedData) {
				if (signal.aborted) {
					throw new Error('Operation cancelled');
				}

				const { divisionCode, urls } = division;
				divisionProgress[divisionCode] = { total: urls.length, processed: 0 };
				addLog(`Processing division: ${divisionCode} (${urls.length} URLs)`, 'info');

				for (let i = 0; i < urls.length; i += concurrency) {
					if (signal.aborted) {
						throw new Error('Operation cancelled');
					}

					const batch = urls.slice(i, i + concurrency);
					const promises = batch.map(url => checkUrlWithRetry(url, divisionCode, signal));
					const results = await Promise.all(promises);

					let batchFailures = 0;
					results.forEach((result, index) => {
						const fullUrl = batch[index];
						if (!result.isReachable) {
							failedUrls = [...failedUrls, {
								url: fullUrl,
								divisionCode,
								status: result.status,
								statusCode: result.statusCode,
								contentType: result.contentType,
								retries: 0
							}];
							batchFailures++;
							console.log(`Added failed URL: ${fullUrl}, Division: ${divisionCode}, Status: ${result.status}`);
						}
					});
					console.log(`Batch completed. Current failedUrls count: ${failedUrls.length}`);

					divisionProgress[divisionCode].processed += batch.length;
					updateTotalProgress();
					addLog(`Batch processed: ${batch.length} URLs, ${batchFailures} failures`, 'info');
					await new Promise(resolve => setTimeout(resolve, delayMs));
				}
				addLog(`Division ${divisionCode} completed. Total failures: ${failedUrls.filter(u => u.divisionCode === divisionCode).length}`, 'info');
			}
		} catch (error) {
			if (error.message === 'Operation cancelled') {
				addLog('URL checking cancelled by user', 'info');
			} else {
				throw error;
			}
		}

		addLog(`All divisions processed. Total failures: ${failedUrls.length}`, 'info');
		console.log(`All divisions processed. Final failedUrls count: ${failedUrls.length}`);
	}

	function updateTotalProgress() {
		const totalProcessed = Object.values(divisionProgress).reduce((sum, div) => sum + div.processed, 0);
		const totalUrls = Object.values(divisionProgress).reduce((sum, div) => sum + div.total, 0);
		progress = Math.round((totalProcessed / totalUrls) * 100);
	}

	async function checkUrlWithRetry(url: string, divisionCode: string, signal: AbortSignal, retries = 0): Promise<{ isReachable: boolean, status: string, statusCode: number, contentType: string }> {
		try {
			addLog(`Checking URL (attempt ${retries + 1}): ${url} (Division: ${divisionCode})`, 'info');
			const result = await checkUrl(url, signal);
			const logStatus = result.isReachable ? 'success' : 'error';
			addLog(`Result for ${url}: ${result.status} (Status Code: ${result.statusCode}, Content-Type: ${result.contentType})`, logStatus);
			return result;
		} catch (error) {
			if (signal.aborted) {
				throw new Error('Operation cancelled');
			}
			if (retries < maxRetries - 1) {
				addLog(`Retrying ${url} (attempt ${retries + 2})`, 'info');
				await new Promise(resolve => setTimeout(resolve, 1000));
				return checkUrlWithRetry(url, divisionCode, signal, retries + 1);
			} else {
				const status = `Max retries reached: ${error.message}`;
				addLog(`${status} for ${url}`, 'error');
				return { isReachable: false, status, statusCode: 0, contentType: 'Unknown' };
			}
		}
	}

	async function checkUrl(url: string, signal: AbortSignal): Promise<{ isReachable: boolean, status: string, statusCode: number, contentType: string }> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(url, {
				method: 'HEAD',
				mode: 'cors',
				headers: {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
				},
				signal: signal
			});

			clearTimeout(timeoutId);

			const contentType = response.headers.get('Content-Type') || 'Unknown';
			let contentTypeStatus = contentType.includes('image') ? 'Image' :
				contentType.includes('video') ? 'Video' :
					contentType.includes('application/octet-stream') ? 'GIF' : 'Other';

			const isReachable = response.status === 200;
			const status = isReachable ? `${contentTypeStatus} exists` : `Error: ${response.status} - ${response.statusText}`;

			return { isReachable, status, statusCode: response.status, contentType };
		} catch (error) {
			clearTimeout(timeoutId);
			if (error.name === 'AbortError') {
				return { isReachable: false, status: 'Request timed out', statusCode: 0, contentType: 'Unknown' };
			}
			return { isReachable: false, status: `Error: ${error.message}`, statusCode: 0, contentType: 'Unknown' };
		}
	}

	async function retryFailedUrls() {
		const urlsToRetry = failedUrls.filter(item => item.retries < maxRetries);
		for (const item of urlsToRetry) {
			const result = await checkUrl(item.url, new AbortController().signal);
			if (result.isReachable) {
				failedUrls = failedUrls.filter(u => u.url !== item.url);
			} else {
				item.retries++;
				item.status = result.status;
				item.statusCode = result.statusCode;
				item.contentType = result.contentType;
			}
		}
	}

	function exportFailedUrls() {
		const csvContent = "data:text/csv;charset=utf-8,"
			+ "URL,Division,Status,Status Code,Content-Type\n"
			+ failedUrls.map(item => `${item.url},${translateCode(item.divisionCode, 'division')},${item.status},${item.statusCode},${item.contentType}`).join("\n");

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "failed_looks_urls.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function cancelCheck() {
		if (abortController) {
			abortController.abort();
			processing = false;
			addLog('URL checking cancelled', 'info');
		}
	}

	$: errorSummary = summarizeErrors(failedUrls);

	function summarizeErrors(urls: typeof failedUrls) {
		const summary = urls.reduce((acc, item) => {
			const key = `${item.statusCode} - ${getErrorType(item.statusCode)}`;
			if (!acc[key]) {
				acc[key] = {
					count: 0,
					divisions: {},
					statusMessage: item.status,
					contentType: item.contentType
				};
			}
			acc[key].count++;
			const division = translateCode(item.divisionCode, 'division');
			acc[key].divisions[division] = (acc[key].divisions[division] || 0) + 1;
			return acc;
		}, {});

		console.log("Raw error summary:", summary);
		console.log("Total failed URLs:", failedUrls.length);
		console.log("Unique divisions in failedUrls:", new Set(urls.map(u => u.divisionCode)));

		return Object.entries(summary)
			.sort(([, a], [, b]) => b.count - a.count)
			.map(([key, { count, divisions, statusMessage, contentType }]) => ({
				key,
				count,
				divisions,
				statusMessage,
				contentType
			}));
	}

	function getErrorType(statusCode: number): string {
		switch (statusCode) {
			case 400: return 'Bad Request';
			case 401: return 'Unauthorized';
			case 403: return 'Forbidden';
			case 404: return 'Not Found';
			case 408: return 'Request Timeout';
			case 500: return 'Internal Server Error';
			case 502: return 'Bad Gateway';
			case 503: return 'Service Unavailable';
			case 504: return 'Gateway Timeout';
			case 0: return 'Network Error or Timeout';
			default: return 'Unknown Error';
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="max-w-3xl mx-auto">
	<div class="grid grid-cols-2 gap-4 mb-4">
		<div class="flex flex-col">
			<h3>Season</h3>
			{#each seasons as [code, name]}
				<label class="flex items-center mb-2">
					<input type="radio" name="season" value={code} bind:group={selectedSeason} class="mr-2">
					{name}
				</label>
			{/each}
		</div>
		<div class="flex flex-col">
			<h3>Divisions</h3>
			<div class="mb-2">
				<button type="button" on:click={selectAllDivisions} class="mr-2 px-2 py-1 bg-blue-500 text-white rounded">Select All</button>
				<button type="button" on:click={deselectAllDivisions} class="px-2 py-1 bg-blue-500 text-white rounded">Deselect All</button>
			</div>
			{#each divisions.sort((a, b) => parseInt(a.code) - parseInt(b.code)) as division}
				<label class="flex items-center mb-2">
					<input type="checkbox" name="divisions" value={division.code} on:change={() => toggleDivision(division.code)} checked={selectedDivisions.includes(division.code)} class="mr-2">
					{division.name}
				</label>
			{/each}
	</div>
	<button type="submit" disabled={processing || !selectedSeason || selectedDivisions.length === 0} class="w-full py-2 px-4 bg-blue-500 text-white rounded-md cursor-pointer">
		{processing ? 'Processing...' : 'Check URLs'}
		{#if processing}
			<span class="spinner inline-block ml-2 border-2 border-white border-opacity-25 rounded-full animate-spin h-4 w-4"></span>
		{/if}
	</button>
</form>

{#if errorMessage}
	<p class="text-red-600 mt-4">{errorMessage}</p>
{/if}

{#if processing || processComplete}
	<p class="mt-4">Overall Progress: {progress}% ({failedUrls.length} failed out of {totalUrls})</p>
	{#each Object.entries(divisionProgress) as [divisionCode, { total, processed }]}
		<p>
			{translateCode(divisionCode, 'division')}:
			{Math.round((processed / total) * 100)}%
			({processed} / {total})
		</p>
	{/each}

	<div class="mt-4 border border-gray-300 rounded-md p-4 h-64 overflow-y-auto" bind:this={logBox}>
		{#each $logStore as log}
			<p class="text-sm" class:text-green-500={log.status === 'success'} class:text-red-500={log.status === 'error'}>
				{log.message}
			</p>
		{/each}
	</div>
{/if}

{#if !processing && urlSuffixes.length === 0 && !processComplete}
	<p class="mt-4">No URLs found to check. Please try different selection criteria.</p>
{/if}

<h3 class="mt-4">Error Summary:</h3>
{#if failedUrlsCount > 0}
	<ul class="mt-2">
		{#each errorSummary as { key, count, divisions, statusMessage, contentType }}
			<li class="mb-4">
				<strong>{key}</strong> ({count} occurrences)
				<br>
				Status: {statusMessage}
				<br>
				Content Type: {contentType}
				<br>
				Affected Divisions:
				<ul class="ml-4">
					{#each Object.entries(divisions) as [division, divisionCount]}
						<li>{division}: {divisionCount}</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
	<p>Total failed URLs: {failedUrlsCount}</p>
{:else}
	<p>No errors to summarize.</p>
{/if}

<h3 class="mt-4">Failed URLs ({failedUrls.length}):</h3>
<ul class="mt-2">
	{#each failedUrls as item}
		<li class="mb-2">
			<a href={item.url} target="_blank" class="text-blue-500">{item.url}</a>
			(Division: {translateCode(item.divisionCode, 'division')}, Status Code: {item.statusCode})
		</li>
	{/each}
</ul>

<div class="mb-10">
	<button on:click={retryFailedUrls} disabled={!failedUrls.length || processing} class="mt-4 py-2 px-4 bg-green-500 text-white rounded-md cursor-pointer">
		Retry Failed URLs
	</button>

	<button on:click={exportFailedUrls} disabled={!failedUrls.length} class="mt-4 ml-4 py-2 px-4 bg-yellow-500 text-white rounded-md cursor-pointer">
		Export Failed URLs
	</button>

	<button on:click={cancelCheck} disabled={!processing} class="mt-4 ml-4 py-2 px-4 bg-red-500 text-white rounded-md cursor-pointer">
		Cancel Check
	</button>
</div>
