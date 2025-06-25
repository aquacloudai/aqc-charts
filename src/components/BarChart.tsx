import React, { forwardRef, useMemo } from 'react';
import type { BaseChartProps, ChartRef, ChartSeries } from '@/types';
import { BaseChart } from './BaseChart';

export interface BarChartProps extends Omit<BaseChartProps, 'series'> {
    readonly data: readonly ChartSeries[];
    readonly horizontal?: boolean;
    readonly stack?: boolean;
    readonly showValues?: boolean;
    readonly barWidth?: string | number;
    readonly barMaxWidth?: string | number;
}

export const BarChart = forwardRef<ChartRef, BarChartProps>(({
    data,
    horizontal = false,
    stack = false,
    showValues = false,
    barWidth,
    barMaxWidth,
    xAxis,
    yAxis,
    ...props
}, ref) => {
    const series = useMemo(() =>
        data.map((item) => ({
            ...item,
            type: 'bar' as const,
            stack: stack ? (item.stack ?? 'total') : undefined,
            barWidth,
            barMaxWidth,
            label: showValues ? {
                show: true,
                position: horizontal ? 'right' : 'top',
                ...item.label,
            } : item.label,
        })),
        [data, stack, showValues, horizontal, barWidth, barMaxWidth],
    );

    const defaultXAxis = useMemo(() =>
        horizontal ? { type: 'value' as const, ...xAxis } : { type: 'category' as const, ...xAxis },
        [horizontal, xAxis],
    );

    const defaultYAxis = useMemo(() =>
        horizontal ? { type: 'category' as const, ...yAxis } : { type: 'value' as const, ...yAxis },
        [horizontal, yAxis],
    );

    return (
        <BaseChart
            ref={ref}
            series={series}
            xAxis={defaultXAxis}
            yAxis={defaultYAxis}
            {...props}
        />
    );
});

BarChart.displayName = 'BarChart';