import React from 'react';
import type { BaseChartProps, ChartRef, LegendComponentOption, TooltipOption, XAXisOption, YAXisOption } from '@/types';
export interface GanttTask {
    readonly id: string;
    readonly name: string;
    readonly category: string;
    readonly startTime: Date | string | number;
    readonly endTime: Date | string | number;
    readonly color?: string;
    readonly vip?: boolean;
}
export interface GanttCategory {
    readonly name: string;
    readonly label?: string;
}
export interface GanttChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: {
        readonly tasks: readonly GanttTask[];
        readonly categories: readonly GanttCategory[];
    };
    readonly heightRatio?: number;
    readonly showDataZoom?: boolean;
    readonly draggable?: boolean;
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
        readonly show?: boolean;
        readonly backgroundColor?: string;
        readonly borderWidth?: number;
        readonly [key: string]: unknown;
    };
    readonly onTaskDrag?: (task: GanttTask, newStartTime: Date, newEndTime: Date) => void;
}
export declare const GanttChart: React.ForwardRefExoticComponent<GanttChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=GanttChart.d.ts.map