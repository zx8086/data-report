// types.ts

export interface CouchbaseConfig {
	URL: string;
	USERNAME: string;
	PASSWORD: string;
	BUCKET: string;
	SCOPE: string;
	COLLECTION: string;
}

export interface ElysiaConfig {
	PORT: string;
	BASE_URL: string
}

export interface PostHogConfig {
	API_KEY: string;
	API_HOST: string;
}

export interface ElasticConfig {
	ELASTIC_URL: string;
}

export interface OpenTelemetryConfig {
	SERVICE_NAME: string;
	SERVICE_VERSION: string
	DEPLOYMENT_ENVIRONMENT: string
	OTLP_TRACES_ENDPOINT: string
	OTLP_METRICS_ENDPOINT: string
	OTLP_LOGS_ENDPOINT: string
}

export interface BackendConfig {
	couchbase: CouchbaseConfig;
	elysiaJs: ElysiaConfig;
	postHog: PostHogConfig;
	elastic: ElasticConfig;
	openTelemetry: OpenTelemetryConfig;
}