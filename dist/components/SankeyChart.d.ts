import React from 'react';
import type { BaseChartProps, ChartRef, EChartsOption } from '@/types';
export interface SankeyNode {
    readonly name: string;
    readonly value?: number;
    readonly depth?: number;
    readonly itemStyle?: unknown;
    readonly label?: unknown;
    readonly emphasis?: unknown;
}
export interface SankeyLink {
    readonly source: string | number;
    readonly target: string | number;
    readonly value: number;
    readonly lineStyle?: unknown;
    readonly emphasis?: unknown;
}
export interface SankeyChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: {
        readonly nodes: readonly SankeyNode[];
        readonly links: readonly SankeyLink[];
    };
    readonly layout?: 'none' | 'circular';
    readonly orient?: 'horizontal' | 'vertical';
    readonly nodeAlign?: 'justify' | 'left' | 'right';
    readonly nodeGap?: number;
    readonly nodeWidth?: number;
    readonly iterations?: number;
    readonly option?: Partial<EChartsOption>;
}
export declare const SankeyChart: React.ForwardRefExoticComponent<SankeyChartProps & React.RefAttributes<ChartRef>>;
//# sourceMappingURL=SankeyChart.d.ts.map