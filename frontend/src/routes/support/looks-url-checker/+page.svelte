<!--+page.svelte for image-url-checker-->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { seasonTranslations, divisionTranslations, translateCode } from '$lib/utils/translations';
	import { writable } from 'svelte/store';

	export let form: ActionData;

	import { key } from '$lib/context/tracker';
	import { onMount, getContext } from 'svelte';
	const { getTracker } = getContext(key);

	const delayMs = 2000;
	const concurrency = 50;
	const maxRetries = 3;
	const timeout = 10000;

	let selectedDivisions: string[] = [];
	let selectedSeason = '';
	let urlSuffixes: string[] = [];
	let failedUrls: { url: string, divisionCode: string, status: string, retries: number }[] = [];
	let processing = false;
	let progress = 0;
	let errorMessage = '';
	let divisionProgress: { [key: string]: { total: number, processed: number } } = {};

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

	const seasons = Object.entries(seasonTranslations);

	const divisions = Object.entries(divisionTranslations).map(([code, name]) => ({ code, name }));

	$: totalUrls = urlSuffixes.length;

	function toggleDivision(divisionCode: string) {
		selectedDivisions = selectedDivisions.includes(divisionCode)
			? selectedDivisions.filter(d => d !== divisionCode)
			: [...selectedDivisions, divisionCode];
	}

	let processComplete = false;

	function addLog(message: string, status: 'success' | 'error' | 'info' = 'info') {
		logStore.update(logs => {
			logs.push({message, status});
			return logs.slice(-5000);  // Keep only the last 5000 logs
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
								await checkUrls(parsedData);
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

	async function checkUrls(data: { divisionCode: string, urls: string[] }[]) {
		failedUrls = [];
		progress = 0;
		divisionProgress = {};

		for (const division of data) {
			const { divisionCode, urls } = division;
			divisionProgress[divisionCode] = { total: urls.length, processed: 0 };
			addLog(`Processing division: ${divisionCode}`, 'info');

			for (let i = 0; i < urls.length; i += concurrency) {
				const batch = urls.slice(i, i + concurrency);
				const promises = batch.map(url => checkUrlWithRetry(url, divisionCode));
				const results = await Promise.all(promises);

				results.forEach((result, index) => {
					const fullUrl = batch[index];
					if (!result.isReachable) {
						failedUrls = [...failedUrls, { url: fullUrl, divisionCode, status: result.status, retries: 0 }];
					}
				});

				divisionProgress[divisionCode].processed += batch.length;
				updateTotalProgress();
				await new Promise(resolve => setTimeout(resolve, delayMs));
			}
		}
	}

	function updateTotalProgress() {
		const totalProcessed = Object.values(divisionProgress).reduce((sum, div) => sum + div.processed, 0);
		const totalUrls = Object.values(divisionProgress).reduce((sum, div) => sum + div.total, 0);
		progress = Math.round((totalProcessed / totalUrls) * 100);
	}

	async function checkUrlWithRetry(url: string, divisionCode: string, retries = 0): Promise<{ isReachable: boolean, status: string }> {
		try {
			addLog(`Checking URL (attempt ${retries + 1}): ${url} (Division: ${divisionCode})`, 'info');
			const result = await checkUrl(url);
			addLog(`Result for ${url}: ${result.isReachable ? 'Reachable' : 'Not Reachable'} (${result.status})`, result.isReachable ? 'success' : 'error');
			return result;
		} catch (error) {
			if (retries < maxRetries - 1) {
				addLog(`Retrying ${url} (attempt ${retries + 2})`, 'info');
				await new Promise(resolve => setTimeout(resolve, 1000));
				return checkUrlWithRetry(url, divisionCode, retries + 1);
			} else {
				addLog(`Max retries reached for ${url}`, 'error');
				return { isReachable: false, status: `Max retries reached: ${error.message}` };
			}
		}
	}

	async function checkUrl(url: string): Promise<{ isReachable: boolean, status: string }> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(url, {
				method: 'HEAD',
				mode: 'cors',
				headers: {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
				},
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			const contentType = response.headers.get('Content-Type');
			let contentTypeStatus = '';

			if (contentType) {
				if (contentType.includes('image')) {
					contentTypeStatus = 'Image';
				} else if (contentType.includes('video')) {
					contentTypeStatus = 'Video';
				} else if (contentType.includes('application/octet-stream')) {
					contentTypeStatus = 'GIF';  // Often GIFs are served as octet-stream
				} else {
					contentTypeStatus = 'Other';
				}
			}

			switch (response.status) {
				case 200:
					return { isReachable: true, status: `${contentTypeStatus} exists` };
				case 404:
					return { isReachable: false, status: `${contentTypeStatus} not found` };
				case 403:
					return { isReachable: false, status: 'Access forbidden' };
				case 500:
					return { isReachable: false, status: 'Server error' };
				default:
					return { isReachable: false, status: `Error: ${response.status} - ${response.statusText}` };
			}
		} catch (error) {
			clearTimeout(timeoutId);
			if (error.name === 'AbortError') {
				return { isReachable: false, status: 'Request timed out' };
			}
			return { isReachable: false, status: `Error: ${error.message}` };
		}
	}

	async function retryFailedUrls() {
		const urlsToRetry = failedUrls.filter(item => item.retries < maxRetries);
		for (const item of urlsToRetry) {
			const result = await checkUrl(item.url);
			if (result.isReachable) {
				failedUrls = failedUrls.filter(u => u.url !== item.url);
			} else {
				item.retries++;
				item.status = result.status;
			}
		}
	}

	function exportFailedUrls() {
		const csvContent = "data:text/csv;charset=utf-8,"
			+ "URL,Division,Status\n"
			+ failedUrls.map(item => `${item.url},${translateCode(item.divisionCode, 'division')},${item.status}`).join("\n");

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "failed_looks_urls.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
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
			{#each divisions.sort((a, b) => parseInt(a.code) - parseInt(b.code)) as division}
				<label class="flex items-center mb-2">
					<input type="checkbox" name="divisions" value={division.code} on:change={() => toggleDivision(division.code)} checked={selectedDivisions.includes(division.code)} class="mr-2">
					{division.name}
				</label>
			{/each}
		</div>
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
			{divisionTranslations[divisionCode] || divisionCode}:
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

<h3 class="mt-4">Failed URLs ({failedUrls.length}):</h3>
<ul class="mt-2">
	{#each failedUrls as item}
		<li class="mb-2">
			<a href={item.url} target="_blank" class="text-blue-500">{item.url}</a>
			(Division: {divisionTranslations[item.divisionCode] || item.divisionCode}, Status: {item.status})
		</li>
	{/each}
</ul>

<button on:click={retryFailedUrls} disabled={!failedUrls.length || processing} class="mt-4 py-2 px-4 bg-green-500 text-white rounded-md cursor-pointer">
	Retry Failed URLs
</button>

<button on:click={exportFailedUrls} disabled={!failedUrls.length} class="mt-4 ml-4 py-2 px-4 bg-yellow-500 text-white rounded-md cursor-pointer">
	Export Failed URLs
</button>