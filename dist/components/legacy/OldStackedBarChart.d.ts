import React from 'react';
import type { BaseChartProps, ChartRef, StackedBarData, BarSeriesOption, LegendComponentOption, TooltipOption, XAXisOption, YAXisOption } from '@/types';
export interface OldStackedBarChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: StackedBarData;
    readonly horizontal?: boolean;
    readonly showPercentage?: boolean;
    readonly showValues?: boolean;
    readonly barWidth?: string | number;
    readonly barMaxWidth?: string | number;
    readonly stackName?: string;
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
export declare const OldStackedBarChart: React.ForwardRefExoticComponent<OldStackedBarChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=OldStackedBarChart.d.ts.map