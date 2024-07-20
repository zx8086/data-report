// src/lib/grpcClient.ts

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROTO_PATH = resolve(__dirname, '../proto/seasonal_assignments.proto');
console.log(PROTO_PATH);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const seasonalAssignments = protoDescriptor.seasonalassignments as any;

const client = new seasonalAssignments.SeasonalAssignments(
	'localhost:50051',
	grpc.credentials.createInsecure()
);

type GrpcMethod = keyof typeof client;

export function makeGrpcCall<T>(method: GrpcMethod, request: any): Promise<T> {
	return new Promise((resolve, reject) => {
		client[method](request, (err: Error | null, response: T) => {
			if (err) {
				reject(err);
			} else {
				resolve(response);
			}
		});
	});
}