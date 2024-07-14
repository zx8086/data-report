<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { key } from '$lib/context/tracker';
	import { onMount, getContext } from 'svelte';
	import { translateCode } from '$lib/utils/translations.js';
	import { page } from '$app/stores';

	const { getTracker } = getContext(key);

	let styleSeasonCode : string;
	let brandCode : string;
	let divisionCode : string;

	$: {
		if ($page) {
			const pathParts = $page.url.pathname.split('/');
			styleSeasonCode = pathParts[1];
			brandCode = pathParts[2];
			divisionCode = pathParts[3];
		}
	}

	onMount(() => {
		try {
			const tracker = getTracker();
			if (tracker) {
				try {
					const translatedDivision = translateCode(brandCode, 'division');
					tracker.event('Page_View', {
						page: `Brands - ${brandCode}`,
						category: 'Navigation',
						action: 'View'
					});
				} catch (translationError) {
					console.error('Error translating brand code:', translationError);
					tracker.event('Page_View', {
						page: 'Brands',
						category: 'Navigation',
						action: 'View',
						error: 'Translation failed'
					});
				}
			} else {
				console.warn('Tracker not available');
			}
		} catch (error) {
			console.error('Error in onMount:', error);
		}
	});


</script>
Charts -> Divisional