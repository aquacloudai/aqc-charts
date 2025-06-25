import React, { forwardRef, useMemo } from 'react';
import type { BaseChartProps, ChartRef, ChartSeries } from '@/types';
import { BaseChart } from './BaseChart';

export interface LineChartProps extends Omit<BaseChartProps, 'series'> {
    readonly data: readonly ChartSeries[];
    readonly smooth?: boolean;
    readonly area?: boolean;
    readonly stack?: boolean;
    readonly symbol?: boolean;
    readonly symbolSize?: number;
    readonly connectNulls?: boolean;
}

export const LineChart = forwardRef<ChartRef, LineChartProps>(({
    data,
    smooth = false,
    area = false,
    stack = false,
    symbol = true,
    symbolSize = 4,
    connectNulls = false,
    xAxis,
    ...props
}, ref) => {
    const series = useMemo(() =>
        data.map((item) => ({
            ...item,
            type: 'line' as const,
            smooth,
            showSymbol: symbol,
            symbolSize,
            connectNulls,
            stack: stack ? (item.stack ?? 'total') : undefined,
            areaStyle: area ? (item.areaStyle ?? {}) : undefined,
        })),
        [data, smooth, area, stack, symbol, symbolSize, connectNulls],
    );

    const defaultXAxis = useMemo(() => ({
        type: 'category' as const,
        boundaryGap: false,
        ...xAxis,
    }), [xAxis]);

    return (
        <BaseChart
            ref={ref}
            series={series}
            xAxis={defaultXAxis}
            {...props}
        />
    );
});

LineChart.displayName = 'LineChart';