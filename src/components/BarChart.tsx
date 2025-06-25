import React, { forwardRef, useMemo } from 'react';
import type { BaseChartProps, ChartRef, EChartsOption, BarSeriesOption } from '@/types';
import { BaseChart } from './BaseChart';
import { createBarChartOption, mergeOptions } from '@/utils/chartHelpers';

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
    readonly option?: Partial<EChartsOption>;
    readonly series?: BarSeriesOption[]; // Allow direct ECharts series override
}

export const BarChart = forwardRef<ChartRef, BarChartProps>(({
    data,
    horizontal = false,
    stack = false,
    showValues = false,
    barWidth,
    barMaxWidth,
    title,
    option: customOption,
    series: customSeries,
    ...props
}, ref) => {
    const chartOption = useMemo(() => {
        // If custom series provided, use those directly
        if (customSeries) {
            return {
                xAxis: horizontal ? { type: 'value' as const } : { type: 'category' as const, data: data?.categories || [] },
                yAxis: horizontal ? { type: 'category' as const, data: data?.categories || [] } : { type: 'value' as const },
                series: customSeries,
                ...(title && { title: { text: title, left: 'center' } }),
                ...(customOption && customOption),
            } as EChartsOption;
        }
        
        // Ensure data.series exists and is an array
        if (!data?.series || !Array.isArray(data.series)) {
            return { series: [] };
        }
        
        // Create base option using helper
        const baseOption = createBarChartOption({
            categories: data.categories,
            series: data.series.map(s => ({
                name: s.name,
                data: s.data,
                ...(s.color && { color: s.color }),
            })),
            ...(title && { title }),
        });

        // Apply bar-specific configurations
        if (baseOption.series && Array.isArray(baseOption.series)) {
            baseOption.series = baseOption.series.map((series: any) => {
                const result: any = {
                    ...series,
                    stack: stack ? 'total' : undefined,
                    ...(barWidth && { barWidth }),
                    ...(barMaxWidth && { barMaxWidth }),
                };
                
                if (showValues) {
                    result.label = {
                        show: true,
                        position: horizontal ? 'right' : 'top',
                    };
                }
                
                return result;
            });
        }

        // Handle horizontal bars
        if (horizontal) {
            baseOption.xAxis = { type: 'value' };
            baseOption.yAxis = { type: 'category', data: data.categories };
        }

        // Merge with custom option if provided
        return customOption ? mergeOptions(baseOption, customOption) : baseOption;
    }, [data, horizontal, stack, showValues, barWidth, barMaxWidth, title, customOption, customSeries]);

    return (
        <BaseChart
            ref={ref}
            option={chartOption}
            {...props}
        />
    );
});

BarChart.displayName = 'BarChart';