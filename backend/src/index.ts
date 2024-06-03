import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors'
import { yoga } from '@elysiajs/graphql-yoga';
import typeDefs from './graphql/schema/typeDefs';
import resolvers from './graphql/schema/resolvers';
import { useResponseCache } from '@graphql-yoga/plugin-response-cache';

const app = new Elysia()
	.use(cors())
	.use(yoga({
		logging: 'debug',
		healthCheckEndpoint: '/live',
		typeDefs,
		resolvers,
		// plugins: [
		// 	useResponseCache({
		// 		// global cache
		// 		session: () => null,
		// 	}),
		// ],
	}),
).listen(4000);
