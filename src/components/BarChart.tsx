import React, { forwardRef, useMemo } from 'react';
import type { 
    BaseChartProps, 
    ChartRef, 
    BarSeriesOption, 
    LegendComponentOption,
    TooltipOption,
    XAXisOption,
    YAXisOption
} from '@/types';
import { BaseChart } from './BaseChart';

export interface BarChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: {
        readonly categories: string[];
        readonly series: Array<{
            readonly name: string;
            readonly data: number[];
            readonly color?: string;
        }>;
    };
    readonly horizontal?: boolean;
    readonly stack?: boolean;
    readonly showValues?: boolean;
    readonly barWidth?: string | number;
    readonly barMaxWidth?: string | number;
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

export const BarChart = forwardRef<ChartRef, BarChartProps>(({
    data,
    horizontal = false,
    stack = false,
    showValues = false,
    barWidth,
    barMaxWidth,
    showLegend = true,
    legend,
    tooltip,
    xAxis,
    yAxis,
    grid,
    series: customSeries,
    ...props
}, ref) => {
    const series = useMemo(() => {
        if (customSeries) {
            return customSeries;
        }

        if (!data?.series || !Array.isArray(data.series)) {
            return [];
        }

        return data.series.map(s => ({
            name: s.name,
            type: 'bar' as const,
            data: s.data,
            stack: stack ? 'total' : undefined,
            ...(barWidth && { barWidth }),
            ...(barMaxWidth && { barMaxWidth }),
            ...(s.color && { itemStyle: { color: s.color } }),
            ...(showValues && {
                label: {
                    show: true,
                    position: horizontal ? 'right' : 'top',
                },
            }),
        })) as BarSeriesOption[];
    }, [data?.series, stack, barWidth, barMaxWidth, showValues, horizontal, customSeries]);

    const chartOption = useMemo(() => ({
        tooltip: {
            trigger: 'axis' as const,
            axisPointer: {
                type: 'shadow',
            },
            ...tooltip,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: showLegend && data?.series && data.series.length > 1 ? 60 : 40,
            containLabel: true,
            ...grid,
        },
        xAxis: horizontal 
            ? { type: 'value' as const, ...xAxis }
            : { type: 'category' as const, data: data?.categories || [], ...xAxis },
        yAxis: horizontal 
            ? { type: 'category' as const, data: data?.categories || [], ...yAxis }
            : { type: 'value' as const, ...yAxis },
        legend: showLegend && data?.series && data.series.length > 1
            ? {
                data: data.series.map(s => s.name),
                top: 20,
                ...legend,
            } as LegendComponentOption
            : undefined,
        series,
    }), [data?.categories, data?.series, horizontal, showLegend, tooltip, grid, xAxis, yAxis, legend, series]);

    return (
        <BaseChart
            ref={ref}
            option={chartOption as any}
            {...props}
        />
    );
});

BarChart.displayName = 'BarChart';