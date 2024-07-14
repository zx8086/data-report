// src/lib/couchbaseConnector.ts
import config from '../config';
import { Cluster, Bucket, Scope, Collection, connect, QueryOptions, QueryResult, StreamableRowPromise, QueryMetaData} from 'couchbase';

// define this interface
interface QueryableCluster extends Cluster {
    query<TRow = any>(statement: string, options?: QueryOptions): StreamableRowPromise<QueryResult<TRow>, TRow, QueryMetaData>;
}

export interface capellaConn {
    cluster: QueryableCluster;
    bucket: Bucket;
    scope: Scope;
    collection: Collection;
    connect: typeof connect;
}

export async function clusterConn(): Promise<capellaConn> {
    console.log("Attempting to connect to Couchbase...");

    try {
        const clusterConnStr: string = config.couchbase.URL;
        const username: string = config.couchbase.USERNAME;
        const password: string = config.couchbase.PASSWORD;
        const bucketName: string = config.couchbase.BUCKET;
        const scopeName: string = config.couchbase.SCOPE;
        const collectionName: string = config.couchbase.COLLECTION;

        console.log(`Configuring connection with the following default connection details:
                    URL: ${clusterConnStr}, 
                    Username: ${username}, 
                    Bucket: ${bucketName}, 
                    Scope: ${scopeName}, 
                    Collection: ${collectionName}`);

        const cluster: QueryableCluster = await connect(clusterConnStr, {
            username: username,
            password: password
        });

        console.log("Cluster connection established.");

        const bucket: Bucket = cluster.bucket(bucketName);
        console.log(`Bucket ${bucketName} accessed.`);

        const scope :Scope = bucket.scope(scopeName);
        const collection: Collection = scope.collection(collectionName);
        console.log(`Collection ${collectionName} accessed under scope ${scopeName}.`);

        return { cluster, bucket, scope, collection, connect };
    } catch (error) {
        console.error("Couchbase connection failed:", error);
        throw error;
    }
}