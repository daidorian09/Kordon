import {
    Cluster
} from './cluster';

export interface ApplicationConfiguration {
    clusters: Cluster[];
    slack: Slack;
    timerThreshold: TimerThreshold;
    metricThreshold: MetricThreshold;
}

export interface Slack {
    webHook: string;
    channel: string;
    username: string;
    emoji: string;
}

export interface TimerThreshold {
    clusterHealthCheckTimeInMs: number;
    clusterCoreCheckTimeInMs: number;
    clusterVolumeCheckTimeInMs: number;
}

export interface MetricThreshold {
    minCpuPercentage: number;
    maxCpuPercentage: number;
    maxJvmPercentage: number;
    maxVolumePercentage: number;
}