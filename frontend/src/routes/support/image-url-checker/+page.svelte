<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { translateCode } from '$lib/utils/translations';

	export let form: ActionData;

	const baseUrl = 'https://s7g10.scene7.com/is/image/TommyHilfigerEU';
	const delayMs = 2000;
	const concurrency = 50;
	const maxRetries = 3;
	const timeout = 10000;

	let selectedDivisions: string[] = [];
	let selectedSeason = '';
	let urlSuffixes: string[] = [];
	let failedUrls: { url: string, divisionCode: string }[] = [];
	let processing = false;
	let progress = 0;
	let errorMessage = '';

	const seasons = Object.entries({ "C51": "Spring 2025", "C52": "Summer 2025" });

	// Define divisions as an array of objects for sorted display
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

	// Calculate totalUrls based on urlSuffixes length
	$: totalUrls = urlSuffixes.length;

	function toggleDivision(divisionCode: string) {
		selectedDivisions = selectedDivisions.includes(divisionCode)
			? selectedDivisions.filter(d => d !== divisionCode)
			: [...selectedDivisions, divisionCode];
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		processing = true;
		failedUrls = [];
		progress = 0;
		errorMessage = '';
		urlSuffixes = [];

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
					const parsedOuterData = JSON.parse(result.data);

					console.log("Parsed Outer Data", parsedOuterData)
					debugger

					if (Array.isArray(parsedOuterData) && parsedOuterData.length === 3 && parsedOuterData[1] === 'success') {
						const parsedInnerData = JSON.parse(parsedOuterData[2]);

						if (Array.isArray(parsedInnerData) && parsedInnerData.length > 0 && parsedInnerData[0].urls) {
							urlSuffixes = parsedInnerData[0].urls;

							if (urlSuffixes.length > 0) {
								await checkUrls();
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
					errorMessage = "Error parsing server response.";
				}
			} else {
				errorMessage = "Received unexpected response from server.";
			}
		} catch (error) {
			errorMessage = "An error occurred while communicating with the server.";
		}

		processing = false;
	}

	async function checkUrls() {
		if (!Array.isArray(urlSuffixes) || urlSuffixes.length === 0) {
			return;
		}

		for (let i = 0; i < urlSuffixes.length; i += concurrency) {
			const batch = urlSuffixes.slice(i, i + concurrency);
			const promises = batch.map(suffix => checkUrlWithRetry(`${baseUrl}${suffix}`, selectedDivisions[0]));
			const results = await Promise.all(promises);

			results.forEach((result, index) => {
				const fullUrl = `${baseUrl}${batch[index]}`;
				if (!result.isReachable) {
					failedUrls = [...failedUrls, { url: fullUrl, divisionCode: selectedDivisions[0] }];
				}
			});

			progress = Math.round((i + concurrency) / urlSuffixes.length * 100);
			await new Promise(resolve => setTimeout(resolve, delayMs));
		}
	}

	async function checkUrlWithRetry(url: string, divisionCode: string, retries = 0): Promise<{ isReachable: boolean, status: string }> {
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

			if (!response.ok) {
				return { isReachable: false, status: `Error: ${response.status} - ${response.statusText}` };
			}

			return { isReachable: true, status: 'Image likely exists' };
		} catch (error) {
			clearTimeout(timeoutId);
			if (error.name === 'AbortError') {
				return { isReachable: false, status: 'Request timed out' };
			}
			return { isReachable: false, status: `Error: ${error.message}` };
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

{#if processing}
	<p class="mt-4">Progress: {progress}% ({failedUrls.length} failed out of {totalUrls})</p>
{/if}

{#if !processing && urlSuffixes.length === 0}
	<p class="mt-4">No URLs found to check. Please try different selection criteria.</p>
{/if}

<h3 class="mt-4">Failed URLs ({failedUrls.length}):</h3>
<ul class="mt-2">
	{#each failedUrls as item}
		<li class="mb-2">
			<a href={item.url} target="_blank" class="text-blue-500">{item.url}</a> (Division: {translateCode(item.divisionCode, 'division')})
		</li>
	{/each}
</ul>