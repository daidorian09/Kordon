import { ClusterStatus } from '../enums/clusterStatus';

export interface ClusterHealthStatusResponse {
    status: ClusterStatus;
    unassigned_shards: number;
}