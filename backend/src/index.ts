import {Elysia} from 'elysia';
import {yoga} from '@elysiajs/graphql-yoga';

const typeDefs = `
    type Query {
        hi: String
    }
`;

const resolvers = {
    Query: {
        hi: () => 'Hello from Elysia'
    }
};

const app = new Elysia().use(yoga({typeDefs, resolvers})).listen(4000);