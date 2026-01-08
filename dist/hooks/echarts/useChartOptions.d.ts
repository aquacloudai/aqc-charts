import type { EChartsType } from 'echarts/core';
import type { EChartsOption } from 'echarts/types/dist/shared';
interface UseChartOptionsProps {
    chartInstance: EChartsType | null;
    option: EChartsOption | unknown;
    theme?: string | Record<string, unknown> | undefined;
    notMerge?: boolean;
    lazyUpdate?: boolean;
}
export declare function useChartOptions({ chartInstance, option, theme, notMerge, lazyUpdate, }: UseChartOptionsProps): void;
export {};
//# sourceMappingURL=useChartOptions.d.ts.map