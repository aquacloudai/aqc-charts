import React from 'react';
import type { BaseChartProps, ChartRef, EChartsOption, ClusterChartData } from '@/types';
export interface ClusterChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: ClusterChartData;
    readonly clusterCount?: number;
    readonly outputClusterIndexDimension?: number;
    readonly colors?: readonly string[];
    readonly symbolSize?: number;
    readonly itemStyle?: {
        readonly borderColor?: string;
        readonly borderWidth?: number;
        readonly [key: string]: unknown;
    };
    readonly visualMapPosition?: 'left' | 'right' | 'top' | 'bottom';
    readonly gridLeft?: number | string;
    readonly option?: Partial<EChartsOption>;
}
export declare const ClusterChart: React.ForwardRefExoticComponent<ClusterChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=ClusterChart.d.ts.map