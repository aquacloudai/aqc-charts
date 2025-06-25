import React, { forwardRef, useMemo } from 'react';
import type { BaseChartProps, ChartRef, StackedBarData, StackedBarDataSeries, BarSeriesOption } from '@/types';
import { BaseChart } from './BaseChart';

export interface StackedBarChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: StackedBarData;
    readonly horizontal?: boolean;
    readonly showPercentage?: boolean;
    readonly showValues?: boolean;
    readonly barWidth?: string | number;
    readonly barMaxWidth?: string | number;
    readonly stackName?: string;
    readonly grid?: {
        readonly left?: number | string;
        readonly right?: number | string;
        readonly top?: number | string;
        readonly bottom?: number | string;
    };
    readonly legendSelectable?: boolean;
    readonly series?: BarSeriesOption[]; // Allow direct series override
}

export const StackedBarChart = forwardRef<ChartRef, StackedBarChartProps>(({
    data,
    horizontal = false,
    showPercentage = false,
    showValues = false,
    barWidth = '60%',
    barMaxWidth,
    stackName = 'total',
    grid,
    legendSelectable = true,
    title,
    ...props
}, ref) => {
    const chartOption = useMemo(() => {
        const { categories, series: rawSeries } = data;

        // Calculate totals for each category if showing percentages
        const totalData: number[] = [];
        if (showPercentage) {
            for (let i = 0; i < categories.length; i++) {
                let sum = 0;
                for (const seriesItem of rawSeries) {
                    sum += seriesItem.data[i] || 0;
                }
                totalData.push(sum);
            }
        }

        // Transform series data
        const series = rawSeries.map((seriesItem: StackedBarDataSeries) => {
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
        });

        const titleConfig = typeof title === 'string'
            ? { text: title }
            : title;

        return {
            ...(titleConfig && {
                title: {
                    left: 'center',
                    ...titleConfig,
                }
            }),

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
            },

            legend: {
                selectedMode: (legendSelectable ? 'multiple' : false) as any,
                top: titleConfig ? 40 : 20,
            },

            grid: {
                left: 100,
                right: 100,
                top: titleConfig ? 80 : 60,
                bottom: 50,
                ...grid,
            },

            xAxis: horizontal ? {
                type: 'value' as const,
                ...(showPercentage && {
                    axisLabel: {
                        formatter: (value: number) => `${Math.round(value * 100)}%`,
                    }
                }),
            } : {
                type: 'category' as const,
                data: categories,
            },

            yAxis: horizontal ? {
                type: 'category' as const,
                data: categories,
            } : {
                type: 'value' as const,
                ...(showPercentage && {
                    axisLabel: {
                        formatter: (value: number) => `${Math.round(value * 100)}%`,
                    }
                }),
            },

            series,
        };
    }, [data, horizontal, showPercentage, showValues, barWidth, barMaxWidth, stackName, grid, legendSelectable, title]);

    return (
        <BaseChart
            ref={ref}
            option={chartOption}
            {...props}
        />
    );
});

StackedBarChart.displayName = 'StackedBarChart';