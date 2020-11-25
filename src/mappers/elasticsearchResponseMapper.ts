import 'reflect-metadata';
import {
    injectable
} from 'inversify';
import logger from '../utils/logger';
import {
    ClusterHealthStatusResponse
} from '../models/response/clusterHealthStatusResponse';

import {
    ClusterStatus
} from '../models/enums/clusterStatus';
import {
    ClusterCpuLevel
} from '../models/enums/clusterCpuLevel';
import { ClusterNodes } from '../models/response/clusterCoreMetricResponse';
import { ClusterVolumeUsageResponse } from '../models/response/clusterVolumeUsageResponse';
import { ConfigurationService } from '../services/configurationService';

@injectable()
export class ElasticsearchResponseMapper {
    public mapToClusterHealthResponseAlertMessage(clusterName: string, response: ClusterHealthStatusResponse | null): string | null {
        try {
            if (response && (response.status === ClusterStatus.Green || response.status === ClusterStatus.Yellow)) {
                const status = response.status as ClusterStatus;
                return this.createElasticsearchClusterHealthMessage(clusterName, status, response.unassigned_shards);
            }
        } catch (error) {
            logger.error(`Exception occurred in ElasticsearchResponseMapper - mapToClusterHealthResponse : ${error.stack || error}`);
        }

        return null;
    }

    public mapToClusterCoreMetricAlertMessage(clusterName: string, response: ClusterNodes): string | null {
        try {
            const { jvm, name, os, indices } = response;
            let errorMessage: string = '';

            if (os && os.cpu) {
                errorMessage = this.createElasticsearchClusterCpuLevelMessage(os.cpu.percent, name, clusterName, errorMessage);
            }

            if (jvm && jvm.mem && jvm.mem.heap_used_percent >= ConfigurationService.applicationConfiguration.metricThreshold.maxJvmPercentage) {
                errorMessage += `${name} jvm percentage is reporting critical which is ${jvm.mem.heap_used_percent} - Cluster : ${clusterName}\n`;
            }

            if (indices && indices.indexing && indices.indexing.is_throttled) {
                errorMessage += `${name} is throttled. Some documents can be missing from returned results in elasticsearch cluster ${clusterName}\n`;
            }

            return errorMessage;

        } catch (error) {
            logger.error(`Exception occurred in ElasticsearchResponseMapper - mapToClusterCoreMetricAlertMessage : ${error.stack || error}`);
        }

        return null;
    }

    public mapToClusterVolumeAlertMessage(clusterName: string, response: ClusterVolumeUsageResponse[]): string | null {
        try {
            let errorMessage: string = '';

            for (const nodeVolume of response) {

                if (nodeVolume['disk.percent'] >= ConfigurationService.applicationConfiguration.metricThreshold.maxVolumePercentage) {
                        errorMessage += `${nodeVolume.node} volume percentage is reporting critical which is ${nodeVolume['disk.percent']} - Cluster : ${clusterName}\n`;
                    }
                }

            return errorMessage;

        } catch (error) {
            logger.error(`Exception occurred in ElasticsearchResponseMapper - mapToClusterVolumeAlertMessage : ${error.stack || error}`);
        }

        return null;
    }

    private createElasticsearchClusterHealthMessage(clusterName: string, status: ClusterStatus, unassignShardCount: number = 0): string {
        return status === ClusterStatus.Yellow ?
        `${clusterName} has ${unassignShardCount} unassigned shard(s). Please control ${clusterName} at once` :
        `${clusterName} health status is green which is healthy`;
    }

    private createElasticsearchClusterCpuLevelMessage(percent: number, name: string, clusterName: string, errorMessage: string): string {
        const { maxCpuPercentage, minCpuPercentage } = ConfigurationService.applicationConfiguration.metricThreshold;

        if (percent >= minCpuPercentage && percent <= maxCpuPercentage) {
            errorMessage += `${name} cpu percentage is reporting ${ClusterCpuLevel.Warning} which is ${percent} - Cluster : ${clusterName}\n`;
        }

        else if (percent > maxCpuPercentage) {
            errorMessage += `${name} cpu percentage is reporting ${ClusterCpuLevel.Critical} which is ${percent} - Cluster : ${clusterName}\n`;
        }

        return errorMessage;
    }
}