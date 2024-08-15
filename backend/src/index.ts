import { Elysia } from 'elysia'
import config from './config';
import { yoga } from '@elysiajs/graphql-yoga'
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { useResponseCache } from '@graphql-yoga/plugin-response-cache'
import { execute, parse, specifiedRules, subscribe, validate } from 'graphql'
import { useEngine } from '@envelop/core'
import { usePrometheus } from '@envelop/prometheus'

import winston from 'winston';
import { ecsFormat } from '@elastic/ecs-winston-format';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
	level: 'info',
	format: ecsFormat({ convertReqRes: true }),
	transports: [
		new winston.transports.Console(),
		new OpenTelemetryTransportV3(),
		new DailyRotateFile({
			filename: './src/logs/Data-Report-ElysiaJS-Backend-%DATE%.log',
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d'
		})
	]
});

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
		}),
		{
			onExecute: ({ args }) => {
				logger.info('GraphQL Execute', {
					operation: args.operationName,
					variables: args.variableValues
				});
			},
			onSubscribe: ({ args }) => {
				logger.info('GraphQL Subscribe', {
					operation: args.operationName,
					variables: args.variableValues
				});
			},
			onError: ({ error }) => {
				logger.error('GraphQL Error', { error: error.message, stack: error.stack });
			}
		}
	]
});

const healthCheck = new Elysia()
	.get('/health', () => "HEALTHY")

const app = new Elysia()
	.onStart(() => logger.info("The server has started!"))
	.use(healthCheck)
	.use(yoga(createYogaOptions()))
	.onRequest((context) => {
		logger.info('Incoming request', {
			method: context.request.method,
			url: context.request.url
		});
	})
	.onResponse((context) => {
		logger.info('Outgoing response', {
			method: context.request.method,
			url: context.request.url,
			status: context.set.status
		});
	})
	.listen(SERVER_PORT);

logger.info(`GraphQL server running on port:${SERVER_PORT}`);