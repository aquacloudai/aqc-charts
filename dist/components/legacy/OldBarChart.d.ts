import React from 'react';
import type { BaseChartProps, ChartRef, BarSeriesOption, LegendComponentOption, TooltipOption, XAXisOption, YAXisOption } from '@/types';
export interface OldBarChartProps extends Omit<BaseChartProps, 'option'> {
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
    readonly showLegend?: boolean;
    readonly legend?: LegendComponentOption;
    readonly tooltip?: TooltipOption;
    readonly xAxis?: XAXisOption;
    readonly yAxis?: YAXisOption;
    readonly grid?: {
        readonly left?: string | number;
        readonly right?: string | number;
        readonly top?: string | number;
        readonly bottom?: string | number;
        readonly containLabel?: boolean;
        readonly [key: string]: unknown;
    };
    readonly series?: BarSeriesOption[];
}
export declare const OldBarChart: React.ForwardRefExoticComponent<OldBarChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=OldBarChart.d.ts.map