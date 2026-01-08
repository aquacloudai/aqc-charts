/**
 * ECharts utility module
 * Provides direct access to ECharts from the peer dependency
 */
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts/core';
/**
 * Initialize an ECharts instance on a container element
 * Note: ecStat transforms are registered at module load time (above)
 */
export declare function initChart(container: HTMLElement, opts?: {
    renderer?: 'canvas' | 'svg';
    useDirtyRect?: boolean;
    devicePixelRatio?: number;
    width?: number | string;
    height?: number | string;
}): EChartsType;
/**
 * Dispose an ECharts instance
 */
export declare function disposeChart(chart: EChartsType): void;
/**
 * Get the ECharts module for advanced usage
 * This provides access to registerTheme, registerMap, etc.
 */
export declare function getEChartsModule(): typeof echarts;
/**
 * Register a map for geo/map charts
 */
export declare function registerMap(mapName: string, geoJson: object, specialAreas?: Record<string, {
    left: number;
    top: number;
    width: number;
}>): void;
/**
 * Check if a map is registered
 */
export declare function getMap(mapName: string): ReturnType<typeof echarts.getMap>;
export { echarts };
//# sourceMappingURL=echarts.d.ts.map