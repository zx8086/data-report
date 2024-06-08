import { Elysia } from 'elysia'
import { yoga } from '@elysiajs/graphql-yoga'
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { useResponseCache } from '@graphql-yoga/plugin-response-cache'

import { execute, parse, specifiedRules, subscribe, validate } from 'graphql'
import { envelop, useEngine } from '@envelop/core'
import { usePrometheus } from '@envelop/prometheus'

const getEnveloped = envelop({
	plugins: [
		useEngine({ parse, validate, specifiedRules, execute, subscribe }),
		// ... other plugins ...
		usePrometheus({
			endpoint: '/metrics',
			requestCount: true,
			requestSummary: true,
			parse: true,
			validate: true,
			contextBuilding: true,
			execute: true,
			errors: true,
			resolvers: true,
			// resolversWhitelist: ['Mutation.*', 'Query.user'], // reports metrics als for these resolvers, leave `undefined` to report all fields
			deprecatedFields: true,
		})
	]
})

const app = new Elysia()
	.use(
		yoga({
			typeDefs,
			resolvers,
			logging: 'debug',
			batching: {
				limit: 10
			},
			plugins: [
				useResponseCache({
					session: () => null,
					ttl: 600_000, // ten minutes
				})
			]
		})).listen(4000);
console.log("GraphQL server running on port:4000");