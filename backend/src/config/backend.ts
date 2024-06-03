// backend.ts
import type { CouchbaseConfig, ElysiaConfig, PostHogConfig, BackendConfig, ElasticConfig, OpenTelemetryConfig } from './types.ts';
import Backend from './backend';
// import * as bun from 'bun';

function getOrThrow(envVariable: string | undefined, name: string): string  {
  if (!envVariable) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return envVariable;
}

const couchbaseConfig: CouchbaseConfig = {
  URL: getOrThrow((process.env as Record<string, string>)['COUCHBASE_URL'], 'COUCHBASE_URL'),
  USERNAME: getOrThrow((process.env as Record<string, string>)['COUCHBASE_USERNAME'], 'COUCHBASE_USERNAME'),
  PASSWORD: getOrThrow((process.env as Record<string, string>)['COUCHBASE_PASSWORD'], 'COUCHBASE_PASSWORD'),
  BUCKET: getOrThrow((process.env as Record<string, string>)['COUCHBASE_BUCKET'], 'COUCHBASE_BUCKET'),
  SCOPE: getOrThrow((process.env as Record<string, string>)['COUCHBASE_SCOPE'], 'COUCHBASE_SCOPE'),
  COLLECTION: getOrThrow((process.env as Record<string, string>)['COUCHBASE_COLLECTION'], 'COUCHBASE_COLLECTION'),
};

const postHogConfig: PostHogConfig = {
  API_KEY: getOrThrow(process.env.POSTHOG_API_KEY, 'POSTHOG_API_KEY'),
  API_HOST: getOrThrow(process.env.POSTHOG_API_HOST, 'POSTHOG_API_HOST') || 'https://eu.i.posthog.com',
};

const elasticConfig: ElasticConfig = {
  ELASTIC_URL: getOrThrow(process.env.ELASTIC_URL, 'ELASTIC_URL'),
};

const elysiaConfig: ElysiaConfig = {
  PORT: getOrThrow(process.env.PORT, 'PORT') || '4000',
  BASE_URL: getOrThrow(process.env.BASE_URL, 'BASE_URL') || 'http://localhost',
};

const telemetryConfig: OpenTelemetryConfig = {
  SERVICE_NAME: getOrThrow((Bun.env as Record<string, string>)['SERVICE_NAME'], 'SERVICE_NAME'),
  SERVICE_VERSION: getOrThrow((Bun.env as Record<string, string>)['SERVICE_VERSION'], 'SERVICE_VERSION'),
  DEPLOYMENT_ENVIRONMENT: getOrThrow((Bun.env as Record<string, string>)['DEPLOYMENT_ENVIRONMENT'], 'DEPLOYMENT_ENVIRONMENT'),
  OTLP_TRACES_ENDPOINT: getOrThrow((Bun.env as Record<string, string>)['OTLP_TRACES_ENDPOINT'], 'OTLP_TRACES_ENDPOINT'),
  OTLP_METRICS_ENDPOINT: getOrThrow((Bun.env as Record<string, string>)['OTLP_METRICS_ENDPOINT'], 'OTLP_METRICS_ENDPOINT'),
  OTLP_LOGS_ENDPOINT: getOrThrow((Bun.env as Record<string, string>)['OTLP_LOGS_ENDPOINT'], 'OTLP_LOGS_ENDPOINT')
};

const config: BackendConfig = {
  couchbase: couchbaseConfig,
  elysiaJs: elysiaConfig,
  postHog: postHogConfig,
  elastic: elasticConfig,
  openTelemetry: telemetryConfig,
};

export default config;