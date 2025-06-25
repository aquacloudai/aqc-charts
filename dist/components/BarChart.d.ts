import React from 'react';
import type { BaseChartProps, ChartRef, EChartsOption, BarSeriesOption } from '@/types';
export interface BarChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: {
        readonly categories: string[];
        readonly series: Array<{
            readonly name: string;
            readonly data: number[];
            readonly color?: string;
        }>;
    };
    readonly horizontal?: boolean;
    readonly stack?: boolean;
    readonly showValues?: boolean;
    readonly barWidth?: string | number;
    readonly barMaxWidth?: string | number;
    readonly option?: Partial<EChartsOption>;
    readonly series?: BarSeriesOption[];
}
export declare const BarChart: React.ForwardRefExoticComponent<BarChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=BarChart.d.ts.map