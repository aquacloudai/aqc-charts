import type { EChartsType } from 'echarts/core';
/**
 * ECharts event params for legend and series clicks
 */
export interface LegendClickParams {
    name: string;
    seriesName?: string;
    [key: string]: unknown;
}
export interface UseLegendDoubleClickProps {
    chartInstance: EChartsType | null;
    onLegendDoubleClick?: ((legendName: string, chart: EChartsType) => void) | undefined;
    onSeriesDoubleClick?: ((seriesName: string, chart: EChartsType) => void) | undefined;
    delay?: number;
    enableAutoSelection?: boolean;
}
export declare function useLegendDoubleClick({ chartInstance, onLegendDoubleClick, onSeriesDoubleClick, delay, enableAutoSelection, }: UseLegendDoubleClickProps): {
    handleLegendClick: (params: LegendClickParams, event?: MouseEvent) => void;
    handleSeriesClick: (params: LegendClickParams, event?: MouseEvent) => void;
    cleanup: () => void;
};
//# sourceMappingURL=useLegendDoubleClick.d.ts.map