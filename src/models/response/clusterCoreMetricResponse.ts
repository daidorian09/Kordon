export interface ClusterCoreMetricResponse {
    nodes: ClusterNodes;
}

export interface ClusterNodes {
    name: string;
    os: ClusterOperatingSystem;
    jvm: ClusterJvm;
    indices: ClusterIndices;
}

interface ClusterOperatingSystem {
    cpu: ClusterCpu;
}

interface ClusterCpu {
    percent: number;
}

interface ClusterJvm {
    mem: ClusterJvmMemory;
}

interface ClusterJvmMemory {
    heap_used_percent: number;
}

interface ClusterIndices {
    indexing: ClusterIndexing;
}

interface ClusterIndexing {
    is_throttled: boolean;
}