import type { ClusterPoint, ClusterResult, ScatterDataPoint } from '@/types';

/**
 * Extract coordinate points from scatter data
 */
export function extractPoints(data: readonly ScatterDataPoint[]): readonly [number, number][] {
    return data.map(point => {
        const value = point.value;
        if (Array.isArray(value) && value.length >= 2) {
            return [value[0], value[1]] as [number, number];
        }
        throw new Error('Invalid scatter data point format');
    });
}

/**
 * Simple K-means clustering implementation
 */
export function performKMeansClustering(
    points: readonly ClusterPoint[],
    k: number,
    maxIterations: number = 100
): ClusterResult {
    if (points.length < k) {
        throw new Error('Number of clusters cannot exceed number of points');
    }

    // Initialize centroids randomly
    const centroids: [number, number][] = [];
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    for (let i = 0; i < k; i++) {
        centroids.push([
            minX + Math.random() * (maxX - minX),
            minY + Math.random() * (maxY - minY)
        ]);
    }

    let clusteredPoints = [...points];
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
        // Assign points to closest centroid
        clusteredPoints = clusteredPoints.map(point => {
            let minDistance = Infinity;
            let closestCluster = 0;

            for (let i = 0; i < k; i++) {
                const centroid = centroids[i];
                if (centroid) {
                    const distance = Math.sqrt(
                        (point.x - centroid[0]) ** 2 + (point.y - centroid[1]) ** 2
                    );
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestCluster = i;
                    }
                }
            }

            return { ...point, cluster: closestCluster };
        });

        // Update centroids
        const newCentroids: [number, number][] = [];
        for (let i = 0; i < k; i++) {
            const clusterPoints = clusteredPoints.filter(p => p.cluster === i);
            if (clusterPoints.length > 0) {
                const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
                const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
                newCentroids.push([avgX, avgY]);
            } else {
                // Keep old centroid if no points assigned
                const oldCentroid = centroids[i];
                if (oldCentroid) {
                    newCentroids.push(oldCentroid);
                } else {
                    // Fallback to a default centroid
                    newCentroids.push([0, 0]);
                }
            }
        }

        // Check for convergence
        let hasConverged = true;
        for (let i = 0; i < k; i++) {
            const oldCentroid = centroids[i];
            const newCentroid = newCentroids[i];
            if (oldCentroid && newCentroid) {
                const distance = Math.sqrt(
                    (oldCentroid[0] - newCentroid[0]) ** 2 +
                    (oldCentroid[1] - newCentroid[1]) ** 2
                );
                if (distance > 0.001) {
                    hasConverged = false;
                    break;
                }
            }
        }

        centroids.splice(0, centroids.length, ...newCentroids);

        if (hasConverged) {
            break;
        }
    }

    return {
        points: clusteredPoints,
        centroids,
        clusters: k
    };
}

/**
 * Convert cluster points to scatter data format
 */
export function clusterPointsToScatterData(
    clusterResult: ClusterResult,
    colors: readonly string[] = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f']
): readonly ScatterDataPoint[] {
    return clusterResult.points.map(point => ({
        value: [point.x, point.y] as [number, number],
        ...(point.name && { name: point.name }),
        itemStyle: {
            color: colors[point.cluster ?? 0] || colors[0]
        }
    }));
}

