<script>
	import "../app.css";
	import config from '../config'
	import posthog from 'posthog-js'
	posthog.init(config.postHog.API_KEY, { api_host: config.postHog.API_HOST })
	posthog.capture('$pageview')
</script>
<div class="flex flex-row justify-between h-full">
	<aside class="w-1/5 bg-slate-200">
		Left Sidebar
	</aside>

	<main class="w-3/5">
		<slot />
	</main>

	<aside class="w-1/5 bg-green-200">
		Right Sidebar
	</aside>
</div>
