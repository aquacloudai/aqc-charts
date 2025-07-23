import { describe, expect, it } from 'vitest';
import {
    extractPoints,
    performKMeansClustering,
    clusterPointsToScatterData
} from '../legacy/regression';
import type { ScatterDataPoint, ClusterPoint } from '@/types';

describe('extractPoints', () => {
    it('extracts points from scatter data correctly', () => {
        const scatterData: ScatterDataPoint[] = [
            { value: [1, 2] },
            { value: [3, 4] },
            { value: [5, 6, 10] } // Third value should be ignored
        ];
        
        const points = extractPoints(scatterData);
        
        expect(points).toEqual([
            [1, 2],
            [3, 4],
            [5, 6]
        ]);
    });

    it('throws error for invalid data format', () => {
        const invalidData: ScatterDataPoint[] = [
            { value: [1] as any } // Invalid format
        ];
        
        expect(() => extractPoints(invalidData)).toThrow(
            'Invalid scatter data point format'
        );
    });
});

describe('performKMeansClustering', () => {
    it('performs k-means clustering correctly', () => {
        const points: ClusterPoint[] = [
            { x: 1, y: 1, name: 'Point 1' },
            { x: 2, y: 2, name: 'Point 2' },
            { x: 8, y: 8, name: 'Point 3' },
            { x: 9, y: 9, name: 'Point 4' }
        ];
        
        const result = performKMeansClustering(points, 2);
        
        expect(result.clusters).toBe(2);
        expect(result.centroids).toHaveLength(2);
        expect(result.points).toHaveLength(4);
        
        // Check that points have been assigned clusters
        result.points.forEach(point => {
            expect(point.cluster).toBeDefined();
            expect(point.cluster).toBeGreaterThanOrEqual(0);
            expect(point.cluster).toBeLessThan(2);
        });
    });

    it('throws error when k exceeds number of points', () => {
        const points: ClusterPoint[] = [
            { x: 1, y: 1 },
            { x: 2, y: 2 }
        ];
        
        expect(() => performKMeansClustering(points, 3)).toThrow(
            'Number of clusters cannot exceed number of points'
        );
    });
});

describe('clusterPointsToScatterData', () => {
    it('converts cluster points to scatter data format', () => {
        const clusterResult = {
            points: [
                { x: 1, y: 2, cluster: 0, name: 'Point 1' },
                { x: 3, y: 4, cluster: 1, name: 'Point 2' }
            ],
            centroids: [[1.5, 2.5], [3.5, 4.5]] as [number, number][],
            clusters: 2
        };
        
        const scatterData = clusterPointsToScatterData(clusterResult);
        
        expect(scatterData).toHaveLength(2);
        expect(scatterData[0]).toEqual({
            value: [1, 2],
            name: 'Point 1',
            itemStyle: {
                color: '#ff6b6b'
            }
        });
        expect(scatterData[1]).toEqual({
            value: [3, 4],
            name: 'Point 2',
            itemStyle: {
                color: '#4ecdc4'
            }
        });
    });

    it('uses custom colors when provided', () => {
        const clusterResult = {
            points: [
                { x: 1, y: 2, cluster: 0 }
            ],
            centroids: [[1, 2]] as [number, number][],
            clusters: 1
        };
        
        const customColors = ['#custom'];
        const scatterData = clusterPointsToScatterData(clusterResult, customColors);
        
        expect(scatterData[0].itemStyle).toEqual({
            color: '#custom'
        });
    });
});