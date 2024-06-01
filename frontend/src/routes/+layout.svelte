<script>
	import "../app.css";
	import config from '../configFrontend'
	import posthog from 'posthog-js'
	posthog.init(config.postHog.API_KEY, { api_host: config.postHog.API_HOST })
	posthog.capture('$pageview')
</script>

<slot />