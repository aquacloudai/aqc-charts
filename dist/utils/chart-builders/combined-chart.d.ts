import type { CombinedChartProps, DataPoint, AxisConfig } from '@/types';
export interface BuildCombinedChartOptionParams {
    readonly data: readonly DataPoint[];
    readonly xField: string;
    readonly series: CombinedChartProps['series'];
    readonly theme?: string | undefined;
    readonly colorPalette?: readonly string[] | undefined;
    readonly backgroundColor?: string | undefined;
    readonly title?: string | undefined;
    readonly subtitle?: string | undefined;
    readonly titlePosition?: 'left' | 'center' | 'right' | undefined;
    readonly xAxis?: AxisConfig | undefined;
    readonly yAxis?: readonly AxisConfig[] | undefined;
    readonly legend?: any | undefined;
    readonly tooltip?: any | undefined;
    readonly zoom?: boolean | undefined;
    readonly pan?: boolean | undefined;
    readonly brush?: boolean | undefined;
    readonly animate?: boolean | undefined;
    readonly animationDuration?: number | undefined;
    readonly customOption?: any | undefined;
}
export declare function buildCombinedChartOption(params: BuildCombinedChartOptionParams): any;
//# sourceMappingURL=combined-chart.d.ts.map