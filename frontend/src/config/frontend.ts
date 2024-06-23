// frontend.ts
import type { PostHogConfig, FrontendConfig, ElasticConfig } from './types.ts';

function getOrThrow(envVariable: string | undefined, name: string): string  {
  if (!envVariable) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return envVariable;
}

const postHogConfig: PostHogConfig = {
  API_KEY: getOrThrow(Bun.env.POSTHOG_API_KEY, 'POSTHOG_API_KEY'),
  API_HOST: getOrThrow(Bun.env.POSTHOG_API_HOST, 'POSTHOG_API_HOST') || 'https://eu.i.posthog.com',
};

const elasticConfig: ElasticConfig = {
  ELASTIC_URL: getOrThrow(Bun.env.ELASTIC_URL, 'ELASTIC_URL'),
};

const config: FrontendConfig = {
  postHog: postHogConfig,
  elastic: elasticConfig,
};

export default config;