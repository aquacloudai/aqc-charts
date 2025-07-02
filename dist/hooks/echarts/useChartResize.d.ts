import type { RefObject } from 'react';
import type { EChartsType } from 'echarts/core';
interface UseChartResizeProps {
    chartInstance: EChartsType | null;
    containerRef: RefObject<HTMLDivElement | null>;
    debounceMs?: number;
}
export declare function useChartResize({ chartInstance, containerRef, debounceMs, }: UseChartResizeProps): {
    resize: () => void;
};
export {};
//# sourceMappingURL=useChartResize.d.ts.map