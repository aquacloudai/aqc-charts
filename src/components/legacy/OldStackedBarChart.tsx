import React, { forwardRef, useMemo } from 'react';
import type { 
    BaseChartProps, 
    ChartRef, 
    StackedBarData, 
    StackedBarDataSeries, 
    BarSeriesOption,
    LegendComponentOption,
    TooltipOption,
    XAXisOption,
    YAXisOption
} from '@/types';
import { BaseChart } from '../BaseChart';

export interface OldStackedBarChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: StackedBarData;
    readonly horizontal?: boolean;
    readonly showPercentage?: boolean;
    readonly showValues?: boolean;
    readonly barWidth?: string | number;
    readonly barMaxWidth?: string | number;
    readonly stackName?: string;
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

export const OldStackedBarChart = forwardRef<ChartRef, OldStackedBarChartProps>(({
    data,
    horizontal = false,
    showPercentage = false,
    showValues = false,
    barWidth = '60%',
    barMaxWidth,
    stackName = 'total',
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

        const { series: rawSeries } = data;
        
        // Calculate totals for each category if showing percentages
        const totalData: number[] = [];
        if (showPercentage) {
            for (let i = 0; i < data.categories.length; i++) {
                let sum = 0;
                for (const seriesItem of rawSeries) {
                    sum += seriesItem.data[i] || 0;
                }
                totalData.push(sum);
            }
        }

        return rawSeries.map((seriesItem: StackedBarDataSeries) => {
            const processedData = showPercentage
                ? seriesItem.data.map((value, index) => {
                    const total = totalData[index];
                    return (total === undefined || total <= 0) ? 0 : value / total;
                  })
                : seriesItem.data;

            return {
                name: seriesItem.name,
                type: 'bar' as const,
                stack: stackName,
                barWidth,
                ...(barMaxWidth && { barMaxWidth }),
                data: [...processedData] as any,
                ...(seriesItem.color && { itemStyle: { color: seriesItem.color } }),
                ...(showValues && {
                    label: {
                        show: true,
                        position: (horizontal ? 'right' : 'top') as any,
                        ...(showPercentage && {
                            formatter: (params: any) => `${Math.round(params.value * 1000) / 10}%`
                        }),
                    }
                }),
            };
        }) as BarSeriesOption[];
    }, [data, showPercentage, stackName, barWidth, barMaxWidth, showValues, horizontal, customSeries]);

    const chartOption = useMemo(() => ({
        tooltip: {
            trigger: 'axis' as const,
            axisPointer: {
                type: 'shadow' as const,
            },
            ...(showPercentage && {
                formatter: (params: any) => {
                    if (!Array.isArray(params)) return '';
                    
                    let result = `${params[0].name}<br/>`;
                    for (const param of params) {
                        const percentage = Math.round(param.value * 1000) / 10;
                        result += `${param.marker}${param.seriesName}: ${percentage}%<br/>`;
                    }
                    return result;
                }
            }),
            ...tooltip,
        },

        legend: showLegend && data?.series && data.series.length > 1
            ? {
                data: data.series.map(s => s.name),
                top: 20,
                selectedMode: 'multiple' as const,
                ...legend,
            } as LegendComponentOption
            : undefined,

        grid: {
            left: 100,
            right: 100,
            top: showLegend && data?.series && data.series.length > 1 ? 60 : 40,
            bottom: 50,
            containLabel: true,
            ...grid,
        },

        xAxis: horizontal ? {
            type: 'value' as const,
            ...(showPercentage && {
                axisLabel: {
                    formatter: (value: number) => `${Math.round(value * 100)}%`,
                }
            }),
            ...xAxis,
        } : {
            type: 'category' as const,
            data: data.categories,
            ...xAxis,
        },

        yAxis: horizontal ? {
            type: 'category' as const,
            data: data.categories,
            ...yAxis,
        } : {
            type: 'value' as const,
            ...(showPercentage && {
                axisLabel: {
                    formatter: (value: number) => `${Math.round(value * 100)}%`,
                }
            }),
            ...yAxis,
        },

        series,
    }), [data, horizontal, showPercentage, showLegend, tooltip, legend, grid, xAxis, yAxis, series]);

    return (
        <BaseChart
            ref={ref}
            option={chartOption as any}
            {...props}
        />
    );
});

OldStackedBarChart.displayName = 'OldStackedBarChart';