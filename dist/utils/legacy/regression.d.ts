import type { ClusterPoint, ClusterResult, ScatterDataPoint } from '@/types';
/**
 * Extract coordinate points from scatter data
 */
export declare function extractPoints(data: readonly ScatterDataPoint[]): readonly [number, number][];
/**
 * Simple K-means clustering implementation
 */
export declare function performKMeansClustering(points: readonly ClusterPoint[], k: number, maxIterations?: number): ClusterResult;
/**
 * Convert cluster points to scatter data format
 */
export declare function clusterPointsToScatterData(clusterResult: ClusterResult, colors?: readonly string[]): readonly ScatterDataPoint[];
//# sourceMappingURL=regression.d.ts.map