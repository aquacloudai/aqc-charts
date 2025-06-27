import React from 'react';
import type { BaseChartProps, ChartRef, EChartsOption, RegressionChartData, RegressionMethod } from '@/types';
export interface RegressionChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: RegressionChartData;
    readonly method?: RegressionMethod;
    readonly formulaOn?: 'start' | 'end' | boolean;
    readonly scatterName?: string;
    readonly lineName?: string;
    readonly scatterColor?: string;
    readonly lineColor?: string;
    readonly symbolSize?: number;
    readonly showFormula?: boolean;
    readonly formulaFontSize?: number;
    readonly formulaPosition?: {
        dx?: number;
        dy?: number;
    };
    readonly splitLineStyle?: 'solid' | 'dashed' | 'dotted';
    readonly legendPosition?: 'top' | 'bottom' | 'left' | 'right';
    readonly option?: Partial<EChartsOption>;
}
export declare const RegressionChart: React.ForwardRefExoticComponent<RegressionChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=RegressionChart.d.ts.map