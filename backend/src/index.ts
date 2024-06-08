import { Elysia } from 'elysia'
import { yoga } from '@elysiajs/graphql-yoga'
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { useResponseCache } from '@graphql-yoga/plugin-response-cache'
import { execute, parse, specifiedRules, subscribe, validate } from 'graphql'
import { envelop, useEngine } from '@envelop/core'
import { usePrometheus } from '@envelop/prometheus'

const SERVER_PORT = 4000;
const PLUGIN_RESPONSE_CACHE_TTL = 600000; // ten minutes

const createEnvelopPlugins = () => [
	useEngine({ parse, validate, specifiedRules, execute, subscribe }),
	usePrometheus({
		requestCount: true,
		requestSummary: true,
		parse: true,
		validate: true,
		contextBuilding: true,
		execute: true,
		errors: true,
		resolvers: true,
		deprecatedFields: true,
	})
];

const createYogaOptions = () => ({
	typeDefs,
	resolvers,
	logging: 'debug',
	batching: {
		limit: 10
	},
	plugins: [
		useResponseCache({
			session: () => null,
			ttl: PLUGIN_RESPONSE_CACHE_TTL,
		})
	]
});

const app = new Elysia()
	.use(yoga(createYogaOptions()))
	.listen(SERVER_PORT);

console.log(`GraphQL server running on port:${SERVER_PORT}`);