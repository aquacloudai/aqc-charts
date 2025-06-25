import React, { forwardRef, useMemo } from 'react';
import type { BaseChartProps, ChartRef, EChartsOption } from '@/types';
import { BaseChart } from './BaseChart';
import { createSankeyChartOption, mergeOptions } from '@/utils/chartHelpers';

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

export const SankeyChart = forwardRef<ChartRef, SankeyChartProps>(({
    data,
    layout = 'none',
    orient = 'horizontal',
    nodeAlign = 'justify',
    nodeGap = 8,
    nodeWidth = 20,
    iterations = 32,
    title,
    option: customOption,
    ...props
}, ref) => {
    const chartOption = useMemo(() => {
        // Ensure data exists and has required properties
        if (!data?.nodes || !data?.links || !Array.isArray(data.nodes) || !Array.isArray(data.links)) {
            return { series: [] };
        }

        // Create base option using helper
        const baseOption = createSankeyChartOption({
            nodes: data.nodes,
            links: data.links,
            layout,
            orient,
            nodeAlign,
            nodeGap,
            nodeWidth,
            iterations,
            ...(title && { title }),
        });

        // Merge with custom option if provided
        return customOption ? mergeOptions(baseOption, customOption) : baseOption;
    }, [data, layout, orient, nodeAlign, nodeGap, nodeWidth, iterations, title, customOption]);

    return (
        <BaseChart
            ref={ref}
            option={chartOption}
            {...props}
        />
    );
});

SankeyChart.displayName = 'SankeyChart';