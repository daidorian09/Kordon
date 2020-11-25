import 'reflect-metadata';
import {
    inject,
    injectable
} from 'inversify';
import logger from '../utils/logger';
import {
    ElasticsearchRepository
} from '../repository/elasticsearchRepository';
import {
    TYPES
} from '../ioc/types';
import {
    ElasticsearchResponseMapper
} from '../mappers/elasticsearchResponseMapper';
import {
    ClusterHealthStatusResponse
} from '../models/response/clusterHealthStatusResponse';
import {
    ClusterCoreMetricResponse
} from '../models/response/clusterCoreMetricResponse';
import {
    ClusterVolumeUsageResponse
} from '../models/response/clusterVolumeUsageResponse';
import {
    SlackService
} from './slackService';
import {
    ConfigurationService
} from './configurationService';

@injectable()
export class MetricService {

    private elasticsearchRepository: ElasticsearchRepository;
    private elasticsearchResponseMapper: ElasticsearchResponseMapper;
    private slackService: SlackService;

    constructor(
        @inject(TYPES.ElasticsearchRepository) elasticsearchRepository: ElasticsearchRepository,
        @inject(TYPES.ElasticsearchResponseMapper) elasticsearchResponseMapper: ElasticsearchResponseMapper,
        @inject(TYPES.SlackService) slackService: SlackService
    ) {
        this.elasticsearchRepository = elasticsearchRepository;
        this.elasticsearchResponseMapper = elasticsearchResponseMapper;
        this.slackService = slackService;
    }

    public async init(): Promise<void> {
        try {
            await this.checkClusterHealthStatus();
            await this.checkClusterCoreMetrics();
            await this.checkClusterVolumeUsage();
        } catch (error) {
            logger.error(`Error occurred in MetricService - init : ${error.stack || error}`);
        }
    }

    private async checkClusterHealthStatus(): Promise<NodeJS.Timeout> {
        return setInterval(async () => {
            for (const cluster of ConfigurationService.applicationConfiguration.clusters) {
                logger.info(`Cluster : ${cluster.name} - Node : ${cluster.node} - Cluster Health Status`);

                const response: ClusterHealthStatusResponse | null = await this.elasticsearchRepository.get<ClusterHealthStatusResponse | null>(`${cluster.node}/_cluster/health?pretty`);
                const alertMessage: string | null = this.elasticsearchResponseMapper.mapToClusterHealthResponseAlertMessage(cluster.name, response);

                if (alertMessage) {
                    await this.slackService.sendNotification(alertMessage);
                }

            }
        }, ConfigurationService.applicationConfiguration.timerThreshold.clusterHealthCheckTimeInMs);
    }

    private async checkClusterCoreMetrics(): Promise<NodeJS.Timeout> {
        return setInterval(async () => {
            for (const cluster of ConfigurationService.applicationConfiguration.clusters) {
                logger.info(`Cluster : ${cluster.name} - Node : ${cluster.node} - Core Metrics`);
                const response: ClusterCoreMetricResponse | null = await this.elasticsearchRepository.get<ClusterCoreMetricResponse | null>(`${cluster.node}/_nodes/stats/indices,os,process,jvm?pretty`);

                if (response && response.nodes) {
                    for (const [, node] of Object.entries(response.nodes)) {
                        const alertMessage: string | null = this.elasticsearchResponseMapper.mapToClusterCoreMetricAlertMessage(cluster.name, node);

                        if (alertMessage) {
                            await this.slackService.sendNotification(alertMessage);
                        }
                    }
                }
            }
        }, ConfigurationService.applicationConfiguration.timerThreshold.clusterCoreCheckTimeInMs);
    }

    private async checkClusterVolumeUsage(): Promise<NodeJS.Timeout> {
        return setInterval(async () => {
                for (const cluster of ConfigurationService.applicationConfiguration.clusters) {
                    logger.info(`Cluster : ${cluster.name} - Node : ${cluster.node} - Volume Usage`);
                    const response: ClusterVolumeUsageResponse[] | null = await this.elasticsearchRepository.get<ClusterVolumeUsageResponse[] | null>(`${cluster.node}/_cat/allocation?v&pretty`);
                    if (Array.isArray(response) && response.length > 0) {

                        const alertMessage: string | null = this.elasticsearchResponseMapper.mapToClusterVolumeAlertMessage(cluster.name, response);

                        if (alertMessage) {
                             await this.slackService.sendNotification(alertMessage);
                        }
                    }
                }
        }, ConfigurationService.applicationConfiguration.timerThreshold.clusterVolumeCheckTimeInMs);
    }

    public async clear() {
        logger.info('MetricService - clear is called');
        clearInterval(await this.checkClusterHealthStatus());
        clearInterval(await this.checkClusterCoreMetrics());
        clearInterval(await this.checkClusterVolumeUsage());
    }
}
