import 'reflect-metadata';
import {
    injectable
} from 'inversify';
import {
    Bucket,
    CouchbaseError,
    errors
} from 'couchbase';
import * as objectPath from 'object-path';
import {
    Document
} from '../configuration/couchbase/document';
import {
    BucketFactory
} from '../configuration/couchbase/bucketFactory';

@injectable()
export class CouchbaseRepository {
    private readonly connectionErrors = [
        errors.serverBusy,
        errors.cLibOutOfMemory,
        errors.networkError,
        errors.timedOut,
        errors.outOfMemory,
        errors.temporaryError
    ];

    public async get<T>(key: string): Promise<Document<T>> {
        return new Promise((resolve, reject) => {
            BucketFactory.getInstance().get(key, this.getPromisifyFromReplica(key, resolve, reject));
        });
    }

    private getPromisifyFromReplica<T>(key: string, resolve: (value ?: Document<T> ) => void, reject: (reason: any) => void): Bucket.OpCallback {
        return (error: CouchbaseError | null, result: any) => {
            if (error && error.code) {
                try {
                    return (this.readFromReplica(error.code)) ?
                    BucketFactory.getInstance().getReplica(key, this.getPromisify(resolve, reject)) :
                    reject(error);
                } catch (error) {
                    reject(error);
                }
            }
            return resolve(new Document<T> (objectPath.get<T> (result, 'value', {} as T)));
        };
    }

    private readFromReplica(error: errors): boolean {
        return this.connectionErrors.includes(error);
    }

    private getPromisify<T>(resolve: (value ?: Document<T> ) => void, reject: (reason: any) => void): Bucket.OpCallback {
        return (error: CouchbaseError | null, result: any) => {
            if (!!error) {
                return reject(error);
            }
            return resolve(new Document<T> (objectPath.get<T> (result, 'value', {} as T)));
        };
    }
}