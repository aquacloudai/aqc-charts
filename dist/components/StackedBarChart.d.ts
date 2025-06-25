import React from 'react';
import type { BaseChartProps, ChartRef, StackedBarData } from '@/types';
export interface StackedBarChartProps extends Omit<BaseChartProps, 'series' | 'xAxis' | 'yAxis'> {
    readonly data: StackedBarData;
    readonly horizontal?: boolean;
    readonly showPercentage?: boolean;
    readonly showValues?: boolean;
    readonly barWidth?: string | number;
    readonly barMaxWidth?: string | number;
    readonly stackName?: string;
    readonly grid?: {
        readonly left?: number | string;
        readonly right?: number | string;
        readonly top?: number | string;
        readonly bottom?: number | string;
    };
    readonly legendSelectable?: boolean;
}
export declare const StackedBarChart: React.ForwardRefExoticComponent<StackedBarChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=StackedBarChart.d.ts.map