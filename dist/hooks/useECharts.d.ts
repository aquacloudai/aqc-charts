import type { RefObject } from 'react';
import type { EChartsType } from 'echarts/core';
import type { ChartRef } from '@/types';
type EventHandler = (params: any, chart: EChartsType) => void;
export interface UseEChartsProps {
    option: unknown;
    theme?: string | Record<string, unknown> | undefined;
    loading?: boolean;
    notMerge?: boolean;
    lazyUpdate?: boolean;
    onChartReady?: ((chart: EChartsType) => void) | undefined;
    events?: Record<string, EventHandler> | undefined;
    debounceResize?: number;
}
export interface UseEChartsReturn extends ChartRef {
    containerRef: RefObject<HTMLDivElement | null>;
    loading: boolean;
    error: Error | null;
}
export declare function useECharts({ option, theme, loading: externalLoading, notMerge, lazyUpdate, onChartReady, events, debounceResize, }: UseEChartsProps): UseEChartsReturn;
export {};
//# sourceMappingURL=useECharts.d.ts.map