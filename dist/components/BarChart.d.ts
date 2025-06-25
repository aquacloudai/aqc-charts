import React from 'react';
import type { BaseChartProps, ChartRef, ChartSeries } from '@/types';
export interface BarChartProps extends Omit<BaseChartProps, 'series'> {
    readonly data: readonly ChartSeries[];
    readonly horizontal?: boolean;
    readonly stack?: boolean;
    readonly showValues?: boolean;
    readonly barWidth?: string | number;
    readonly barMaxWidth?: string | number;
}
export declare const BarChart: React.ForwardRefExoticComponent<BarChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=BarChart.d.ts.map