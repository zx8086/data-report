// configFrontend.ts
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
  API_HOST: string
}
export interface ConfigFrontend {
  couchbase: CouchbaseConfig;
  elysiaJs: ElysiaConfig;
  postHog: PostHogConfig;
}

function getOrThrow(envVariable: string | undefined, name: string): string {
  if (!envVariable) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return envVariable;
}

const couchbaseConfig: CouchbaseConfig = {
  URL: getOrThrow((Bun.env as Record<string, string>)['COUCHBASE_URL'], 'COUCHBASE_URL'),
  USERNAME: getOrThrow((Bun.env as Record<string, string>)['COUCHBASE_USERNAME'], 'COUCHBASE_USERNAME'),
  PASSWORD: getOrThrow((Bun.env as Record<string, string>)['COUCHBASE_PASSWORD'], 'COUCHBASE_PASSWORD'),
  BUCKET: getOrThrow((Bun.env as Record<string, string>)['COUCHBASE_BUCKET'], 'COUCHBASE_BUCKET'),
  SCOPE: getOrThrow((Bun.env as Record<string, string>)['COUCHBASE_SCOPE'], 'COUCHBASE_SCOPE'),
  COLLECTION: getOrThrow((Bun.env as Record<string, string>)['COUCHBASE_COLLECTION'], 'COUCHBASE_COLLECTION'),
};

const postHogConfig: PostHogConfig = {
  API_KEY: getOrThrow(Bun.env.POSTHOG_API_KEY, 'POSTHOG_API_KEY'),
  API_HOST: getOrThrow(Bun.env.POSTHOG_API_HOST, 'POSTHOG_API_HOST') || 'https://eu.i.posthog.com',
};

const elysiaConfig: ElysiaConfig = {
  PORT: getOrThrow(Bun.env.PORT, 'PORT') || '4000',
  BASE_URL: getOrThrow(Bun.env.BASE_URL, 'BASE_URL') || 'http://localhost',
};

const config: ConfigFrontend = {
  couchbase: couchbaseConfig,
  elysiaJs: elysiaConfig,
  postHog: postHogConfig,
};

export default config;