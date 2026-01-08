/**
 * ECharts utility module
 * Provides direct access to ECharts from the peer dependency
 */

import * as echarts from 'echarts';
import * as ecStat from 'echarts-stat';
import type { EChartsType } from 'echarts/core';

// Type for ecStat transform objects
interface EcStatTransform {
  type: string;
  [key: string]: unknown;
}

interface EcStatModule {
  transform?: {
    clustering?: EcStatTransform;
    regression?: EcStatTransform;
    histogram?: EcStatTransform;
  };
}

// Register ecStat transforms at module load time
// This ensures transforms are available before any chart tries to use them
const ecStatTyped = ecStat as unknown as EcStatModule;

if (ecStatTyped.transform) {
  if (ecStatTyped.transform.clustering) {
    echarts.registerTransform(ecStatTyped.transform.clustering as unknown as Parameters<typeof echarts.registerTransform>[0]);
  }
  if (ecStatTyped.transform.regression) {
    echarts.registerTransform(ecStatTyped.transform.regression as unknown as Parameters<typeof echarts.registerTransform>[0]);
  }
  if (ecStatTyped.transform.histogram) {
    echarts.registerTransform(ecStatTyped.transform.histogram as unknown as Parameters<typeof echarts.registerTransform>[0]);
  }
}

/**
 * Initialize an ECharts instance on a container element
 * Note: ecStat transforms are registered at module load time (above)
 */
export function initChart(
  container: HTMLElement,
  opts?: {
    renderer?: 'canvas' | 'svg';
    useDirtyRect?: boolean;
    devicePixelRatio?: number;
    width?: number | string;
    height?: number | string;
  }
): EChartsType {
  // Build init options, only including defined values for exactOptionalPropertyTypes
  // biome-ignore lint/suspicious/noExplicitAny: ECharts init options require dynamic construction
  const initOpts: Record<string, any> = {
    renderer: opts?.renderer ?? 'canvas',
    useDirtyRect: opts?.useDirtyRect ?? true,
  };

  if (opts?.devicePixelRatio !== undefined) {
    initOpts.devicePixelRatio = opts.devicePixelRatio;
  }
  if (opts?.width !== undefined) {
    initOpts.width = opts.width;
  }
  if (opts?.height !== undefined) {
    initOpts.height = opts.height;
  }

  // Create the chart instance
  const chart = echarts.init(container, undefined, initOpts);

  return chart as unknown as EChartsType;
}

/**
 * Dispose an ECharts instance
 */
export function disposeChart(chart: EChartsType): void {
  if (chart && !chart.isDisposed?.()) {
    chart.dispose();
  }
}

/**
 * Get the ECharts module for advanced usage
 * This provides access to registerTheme, registerMap, etc.
 */
export function getEChartsModule(): typeof echarts {
  return echarts;
}

/**
 * Register a map for geo/map charts
 */
export function registerMap(
  mapName: string,
  geoJson: object,
  specialAreas?: Record<string, { left: number; top: number; width: number }>
): void {
  echarts.registerMap(mapName, geoJson as Parameters<typeof echarts.registerMap>[1], specialAreas);
}

/**
 * Check if a map is registered
 */
export function getMap(mapName: string): ReturnType<typeof echarts.getMap> {
  return echarts.getMap(mapName);
}

// Re-export echarts for direct access if needed
export { echarts };
