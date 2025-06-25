import React from 'react';
import type { BaseChartProps, ChartRef, CalendarHeatmapDataPoint, CalendarConfig, VisualMapConfig } from '@/types';
export interface CalendarHeatmapChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: readonly CalendarHeatmapDataPoint[];
    readonly year: string | number;
    readonly calendar?: CalendarConfig;
    readonly visualMap?: VisualMapConfig;
    readonly tooltipFormatter?: (params: {
        name: string;
        value: readonly [string, number];
    }) => string;
}
export declare const CalendarHeatmapChart: React.ForwardRefExoticComponent<CalendarHeatmapChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=CalendarHeatmapChart.d.ts.map