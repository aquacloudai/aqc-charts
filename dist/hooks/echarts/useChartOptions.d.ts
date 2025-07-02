import type { EChartsType } from 'echarts/core';
interface UseChartOptionsProps {
    chartInstance: EChartsType | null;
    option: unknown;
    theme?: string | object | undefined;
    notMerge?: boolean;
    lazyUpdate?: boolean;
}
export declare function useChartOptions({ chartInstance, option, theme, notMerge, lazyUpdate, }: UseChartOptionsProps): void;
export {};
//# sourceMappingURL=useChartOptions.d.ts.map