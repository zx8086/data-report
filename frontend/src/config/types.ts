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

export interface FrontendConfig {
	postHog: PostHogConfig;
	elastic: ElasticConfig;
}