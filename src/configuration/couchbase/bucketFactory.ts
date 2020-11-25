import * as couchbase from 'couchbase';
import { Bucket } from 'couchbase';
import { COUCHBASE } from '../application';

export class BucketFactory {
  // tslint:disable-next-line: no-empty
  private BucketFactory() {}

  private static instance: Bucket;

  public static getInstance(): Bucket {
    if (!BucketFactory.instance) {
      const cluster = new couchbase.Cluster(COUCHBASE.host);
      cluster.authenticate(COUCHBASE.username, COUCHBASE.password);
      BucketFactory.instance = cluster.openBucket(COUCHBASE.bucket);
    }
    return BucketFactory.instance;
  }
}