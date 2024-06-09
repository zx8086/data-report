import { Elysia } from 'elysia'
import config from './config';
import { yoga } from '@elysiajs/graphql-yoga'
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { useResponseCache } from '@graphql-yoga/plugin-response-cache'
import { execute, parse, specifiedRules, subscribe, validate } from 'graphql'
import { useEngine } from '@envelop/core'
import { usePrometheus } from '@envelop/prometheus'

const SERVER_PORT = config.elysiaJs.PORT;
const YOGA_RESPONSE_CACHE_TTL = config.yoga.RESPONSE_CACHE_TTL;

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
	batching: {
		limit: 10
	},
	plugins: [
		useResponseCache({
			session: () => null,
			ttl: YOGA_RESPONSE_CACHE_TTL,
		})
	]
});

const app = new Elysia()
	.use(yoga(createYogaOptions()))
	.listen(SERVER_PORT);

console.log(`GraphQL server running on port:${SERVER_PORT}`);