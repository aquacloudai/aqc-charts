import type { RefObject } from 'react';
import type { EChartsType } from 'echarts/core';
interface UseChartInstanceProps {
    containerRef: RefObject<HTMLDivElement | null>;
    onChartReady?: ((chart: EChartsType) => void) | undefined;
}
interface UseChartInstanceReturn {
    chartInstance: EChartsType | null;
    isInitialized: boolean;
    error: Error | null;
    initChart: () => void;
    disposeChart: () => void;
}
export declare function useChartInstance({ containerRef, onChartReady, }: UseChartInstanceProps): UseChartInstanceReturn;
export {};
//# sourceMappingURL=useChartInstance.d.ts.map