import React from 'react';
import type { BaseChartProps, ChartRef, EChartsOption, ScatterSeriesOption, ScatterChartData } from '@/types';
export interface OldScatterChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: ScatterChartData;
    readonly symbolSize?: number | readonly number[] | ((value: readonly number[], params: unknown) => number);
    readonly symbol?: string;
    readonly large?: boolean;
    readonly largeThreshold?: number;
    readonly progressive?: number;
    readonly progressiveThreshold?: number;
    readonly enableAdvancedFeatures?: boolean;
    readonly option?: Partial<EChartsOption>;
    readonly series?: ScatterSeriesOption[];
}
export declare const OldScatterChart: React.ForwardRefExoticComponent<OldScatterChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=OldScatterChart.d.ts.map