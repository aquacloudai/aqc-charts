import React from 'react';
import type { BaseChartProps, ChartRef, ChartSeries, LineStyleConfig } from '@/types';
export interface LineChartProps extends Omit<BaseChartProps, 'series'> {
    readonly data: readonly ChartSeries[];
    readonly smooth?: boolean;
    readonly area?: boolean;
    readonly stack?: boolean;
    readonly symbol?: boolean;
    readonly symbolSize?: number;
    readonly connectNulls?: boolean;
    readonly defaultLineStyle?: LineStyleConfig;
    readonly defaultSymbol?: 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow' | 'none';
}
export declare const LineChart: React.ForwardRefExoticComponent<LineChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=LineChart.d.ts.map