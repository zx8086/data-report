// index.ts
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { createYoga } from 'graphql-yoga';
import { schema } from './graphql/schema';

const yoga = createYoga({ schema });

const app = new Elysia();

app.use(cors());

app.use((context) => {
	if (context.request.url.startsWith('/graphql')) {
		return yoga.handleRequest(context.request);
	}
	return context.next();
});

app.listen(4000, () => {
	console.info('Server is running on http://localhost:4000/graphql');
});
