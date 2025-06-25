import React from 'react';
import type { BaseChartProps, ChartRef, ChartDataPoint } from '@/types';
export interface PieChartProps extends Omit<BaseChartProps, 'series' | 'xAxis' | 'yAxis'> {
    readonly data: readonly ChartDataPoint[];
    readonly radius?: string | number | readonly [string | number, string | number];
    readonly center?: readonly [string | number, string | number];
    readonly roseType?: boolean | 'radius' | 'area';
    readonly showLabels?: boolean;
    readonly showLegend?: boolean;
}
export declare const PieChart: React.ForwardRefExoticComponent<PieChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=PieChart.d.ts.map