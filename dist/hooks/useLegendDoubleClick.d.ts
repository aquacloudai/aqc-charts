import type { EChartsType } from 'echarts/core';
export interface UseLegendDoubleClickProps {
    chartInstance: EChartsType | null;
    onLegendDoubleClick?: ((legendName: string, chart: EChartsType) => void) | undefined;
    onSeriesDoubleClick?: ((seriesName: string, chart: EChartsType) => void) | undefined;
    delay?: number;
    enableAutoSelection?: boolean;
}
export declare function useLegendDoubleClick({ chartInstance, onLegendDoubleClick, onSeriesDoubleClick, delay, enableAutoSelection, }: UseLegendDoubleClickProps): {
    handleLegendClick: (params: any, event?: MouseEvent) => void;
    handleSeriesClick: (params: any, event?: MouseEvent) => void;
    cleanup: () => void;
};
//# sourceMappingURL=useLegendDoubleClick.d.ts.map