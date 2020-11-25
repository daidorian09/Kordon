import {
    ApplicationConfiguration,
    MetricThreshold,
    Slack,
    TimerThreshold
} from 'src/models/applicationConfiguration';
import {
    Cluster
} from 'src/models/cluster';
import { v1 } from 'uuid';
import { CouchbaseConfiguration } from './couchbase/couchbaseConfiguration';

const CLUSTERS: Cluster[] = [{
    name: 'Cluster',
    node: 'http://Your.Cluster.Ip',
    isActive: true
}];

const TIMER_THRESHOLD: TimerThreshold = {
    clusterHealthCheckTimeInMs: 300000, // 5 mins
    clusterCoreCheckTimeInMs: 300000, // 5 mins
    clusterVolumeCheckTimeInMs: 600000 // 10mins
};

const METRIC_THRESHOLD: MetricThreshold = {
    minCpuPercentage: 75,
    maxCpuPercentage: 90,
    maxJvmPercentage: 80,
    maxVolumePercentage: 80
};

const SLACK: Slack = {
    webHook: 'slack-web-hook',
    channel: 'your-channel',
    emoji: ':alert',
    username: 'your-alert-name'
};

export const APPLICATION_CONFIGURATION: ApplicationConfiguration = {
    clusters: CLUSTERS,
    timerThreshold: TIMER_THRESHOLD,
    slack: SLACK,
    metricThreshold: METRIC_THRESHOLD
};

export const SLACK_HEADER = Object.freeze({
    'Content-Type': 'application/json',
    'x-correlationId': v1(),
    'X-Requested-By': 'X-Requested-By',
    'x-agentName': 'Kordon'
});

export const COUCHBASE: CouchbaseConfiguration = Object.freeze({
    username   : 'username',
    password   : 'password',
    host       :  'couchbase://host',
    bucket     : 'bucket',
    documentId : 'document'
});