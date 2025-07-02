import React from 'react';
import type { BaseChartProps, ChartRef, ChartDataPoint, PieSeriesOption, LegendComponentOption } from '@/types';
export interface OldPieChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: readonly ChartDataPoint[];
    readonly radius?: string | number | readonly [string | number, string | number];
    readonly center?: readonly [string | number, string | number];
    readonly roseType?: boolean | 'radius' | 'area';
    readonly showLabels?: boolean;
    readonly showLegend?: boolean;
    readonly legend?: LegendComponentOption;
    readonly series?: PieSeriesOption[];
}
export declare const OldPieChart: React.ForwardRefExoticComponent<OldPieChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=OldPieChart.d.ts.map