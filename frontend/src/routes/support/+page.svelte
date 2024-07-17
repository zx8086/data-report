<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { goto } from '$app/navigation';
</script>

<div class="flex flex-col space-y-4 mb-4">
	<button
		class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-64"
		on:click={() => goto('/support/document-search')}
	>
		Document Search
	</button>
	<button
		class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-64"
		on:click={() => goto('/support/image-url-checker')}
	>
		Collection Check
	</button>
	<button
		class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-64"
		on:click={() => goto('/support/looks-url-checker')}
	>
		Looks Check
	</button>
</div>