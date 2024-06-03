// frontend.ts
import type { CouchbaseConfig, ElysiaConfig, PostHogConfig, FrontendConfig } from './types.ts';
import * as bun from 'bun';

function getOrThrow(envVariable: string | undefined, name: string): string {
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

const elysiaConfig: ElysiaConfig = {
  PORT: getOrThrow(process.env.PORT, 'PORT') || '4000',
  BASE_URL: getOrThrow(process.env.BASE_URL, 'BASE_URL') || 'http://localhost',
};

const config: FrontendConfig = {
  couchbase: couchbaseConfig,
  elysiaJs: elysiaConfig,
  postHog: postHogConfig,
};

export default config;