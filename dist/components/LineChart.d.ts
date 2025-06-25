import React from 'react';
import type { BaseChartProps, ChartRef, EChartsOption, LineSeriesOption } from '@/types';
export interface LineChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: {
        readonly categories: string[];
        readonly series: Array<{
            readonly name: string;
            readonly data: number[];
            readonly color?: string;
            readonly smooth?: boolean;
            readonly area?: boolean;
            readonly stack?: string;
            readonly symbol?: string;
            readonly symbolSize?: number;
            readonly connectNulls?: boolean;
        }>;
    };
    readonly smooth?: boolean;
    readonly area?: boolean;
    readonly stack?: boolean;
    readonly symbol?: boolean;
    readonly symbolSize?: number;
    readonly connectNulls?: boolean;
    readonly option?: Partial<EChartsOption>;
    readonly series?: LineSeriesOption[];
}
export declare const LineChart: React.ForwardRefExoticComponent<LineChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=LineChart.d.ts.map