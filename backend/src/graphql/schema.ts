import { makeExecutableSchema } from '@graphql-tools/schema';
import { createSchema } from 'graphql-yoga'

import typeDefs from './typeDefs';
import resolvers from './resolvers/index';

export const schema = createSchema ({
	typeDefs,
	resolvers,
});
