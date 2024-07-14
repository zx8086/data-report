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
	let failedUrls: {url: string, divisionCode: string}[] = [];
	let processing = false;
	let progress = 0;
	let errorMessage = '';

	const seasons = Object.entries({ "C51": "Spring 2025", "C52": "Summer 2025" });
	const divisions = Object.entries({
		"01": "TH Menswear", "02": "Tommy Jeans", "03": "TH Licensees", "04": "TH Kids",
		"05": "TH Womenswear", "07": "TH Close to Body", "09": "TH Footwear", "10": "TH Accessories",
		"61": "CK Menswear", "62": "CK Jeans", "64": "CKJ Kids", "65": "CK Womenswear",
		"67": "CK Underwear", "68": "CK Sport", "69": "CK Footwear", "70": "CK Accessories",
		"77": "CK Swimwear", "97": "Nike Underwear"
	});

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

<form on:submit|preventDefault={handleSubmit} class="url-checker-form">
	<div class="form-grid">
		<div class="season-column">
			<h3>Season</h3>
			{#each seasons as [code, name]}
				<label class="radio-label">
					<input type="radio" name="season" value={code} bind:group={selectedSeason}>
					{name}
				</label>
			{/each}
		</div>
		<div class="division-column">
			<h3>Divisions</h3>
			{#each divisions as [code, name]}
				<label class="checkbox-label">
					<input type="checkbox" name="divisions" value={code} on:change={() => toggleDivision(code)} checked={Array.isArray(selectedDivisions) && selectedDivisions.includes(code)}>
					{name}
				</label>
			{/each}
		</div>
	</div>
	<button type="submit" disabled={processing || !selectedSeason || selectedDivisions.length === 0}>
		{processing ? 'Processing...' : 'Check URLs'}
		{#if processing}
			<span class="spinner"></span>
		{/if}
	</button>
</form>

{#if errorMessage}
	<p class="error">{errorMessage}</p>
{/if}

{#if processing}
	<p>Progress: {progress}% ({failedUrls.length} failed out of {totalUrls})</p>
{/if}

{#if !processing && urlSuffixes.length === 0}
	<p>No URLs found to check. Please try different selection criteria.</p>
{/if}

<h3>Failed URLs ({failedUrls.length}):</h3>
<ul>
	{#each failedUrls as item}
		<li>{item.url} (Division: {translateCode(item.divisionCode, 'division')})</li>
	{/each}
</ul>

<style>
    .url-checker-form {
        max-width: 800px;
        margin: 0 auto;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }

    .season-column, .division-column {
        display: flex;
        flex-direction: column;
    }

    h3 {
        margin-bottom: 10px;
    }

    .radio-label, .checkbox-label {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
    }

    input[type="radio"], input[type="checkbox"] {
        margin-right: 10px;
    }

    button {
        width: 100%;
        padding: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
    }

    .spinner {
        margin-left: 10px;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .error {
        color: red;
        margin-top: 10px;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        margin-bottom: 5px;
    }
</style>
