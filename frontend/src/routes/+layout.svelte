<script>
	import "../app.css";
	import posthog from 'posthog-js'
	posthog.init('phc_qmqwPLsWmycDSEzZqEYoYVj4fVl8JuEO8wjaxTfezTh', { api_host: "https://eu.i.posthog.com" })
	posthog.capture('$pageview')
</script>

<slot />