// graphql/schema.ts
import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './schema/typeDefs';
import resolvers from './schema/resolvers/index';

export const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});
