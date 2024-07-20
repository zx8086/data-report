import { browser } from '$app/environment';

export const path = browser ? null : await import('path-browserify');
export const grpc = browser ? null : await import('@grpc/grpc-js');
export const protoLoader = browser ? null : await import('@grpc/proto-loader');