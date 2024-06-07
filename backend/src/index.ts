import { Elysia } from 'elysia'
import { yoga } from '@elysiajs/graphql-yoga'
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

const app = new Elysia()
	.use(
		yoga({
			typeDefs:typeDefs,
			resolvers: resolvers
		}))
	.listen(4000)
console.log("GraphQL server running on port:4000");