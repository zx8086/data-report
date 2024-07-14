<!-- src/routes/support/image-url-checker/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	const baseUrl = 'https://s7g10.scene7.com/is/image/TommyHilfigerEU';
	const delayMs = 2000;
	const concurrency = 50;
	const maxRetries = 3;
	const timeout = 10000;

	let divisions = '04';
	let season = 'C51';
	let urlSuffixes: string[] = [];
	let failedUrls: {url: string, divisionCode: string}[] = [];
	let processing = false;
	let progress = 0;

	$: totalUrls = urlSuffixes.length;

	$: if (form?.success && form.urlSuffixes) {
		urlSuffixes = form.urlSuffixes;
	}

	async function checkUrls() {
		processing = true;
		failedUrls = [];
		progress = 0;

		for (let i = 0; i < urlSuffixes.length; i += concurrency) {
			const batch = urlSuffixes.slice(i, i + concurrency);
			const promises = batch.map(suffix => checkUrlWithRetry(`${baseUrl}${suffix}`, divisions.split(',')[0]));
			const results = await Promise.all(promises);

			results.forEach((result, index) => {
				const fullUrl = `${baseUrl}${batch[index]}`;
				if (!result.isReachable) {
					failedUrls = [...failedUrls, { url: fullUrl, divisionCode: divisions.split(',')[0] }];
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
</script>

<h1>Image URL Checker</h1>

<form method="POST" action="?/fetchUrlSuffixes" use:enhance>
	<div>
		<label for="season">Season:</label>
		<input id="season" name="season" type="text" bind:value={season} />
	</div>
	<div>
		<label for="divisions">Divisions (comma-separated):</label>
		<input id="divisions" name="divisions" type="text" bind:value={divisions} />
	</div>
	<button type="submit">Fetch URL Suffixes</button>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<button on:click={checkUrls} disabled={processing || urlSuffixes.length === 0}>
	{processing ? 'Processing...' : 'Check URLs'}
</button>

{#if processing}
	<p>Progress: {progress}% ({failedUrls.length} failed out of {totalUrls})</p>
{/if}

<h3>Failed URLs ({failedUrls.length}):</h3>
<ul>
	{#each failedUrls as item}
		<li>{item.url} (Division: {item.divisionCode})</li>
	{/each}
</ul>