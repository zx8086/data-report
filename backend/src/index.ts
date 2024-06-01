import {Elysia} from 'elysia';

import {yoga} from '@elysiajs/graphql-yoga';
import typeDefs from './graphql/schema/typeDefs';
import resolvers from './graphql/schema/resolvers';

const app = new Elysia().use(yoga({logging: 'debug', typeDefs, resolvers})).listen(4000);
