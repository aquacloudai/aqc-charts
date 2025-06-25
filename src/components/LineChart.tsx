import React, { forwardRef, useMemo } from 'react';
import type { BaseChartProps, ChartRef, EChartsOption, LineSeriesOption } from '@/types';
import { BaseChart } from './BaseChart';
import { createLineChartOption, mergeOptions } from '@/utils/chartHelpers';

export interface LineChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: {
        readonly categories: string[];
        readonly series: Array<{
            readonly name: string;
            readonly data: number[];
            readonly color?: string;
            readonly smooth?: boolean;
            readonly area?: boolean;
            readonly stack?: string;
            readonly symbol?: string;
            readonly symbolSize?: number;
            readonly connectNulls?: boolean;
        }>;
    };
    readonly smooth?: boolean;
    readonly area?: boolean;
    readonly stack?: boolean;
    readonly symbol?: boolean;
    readonly symbolSize?: number;
    readonly connectNulls?: boolean;
    readonly option?: Partial<EChartsOption>;
    readonly series?: LineSeriesOption[]; // Allow direct ECharts series override
}

export const LineChart = forwardRef<ChartRef, LineChartProps>(({
    data,
    smooth = false,
    area = false,
    stack = false,
    symbol = true,
    symbolSize = 4,
    connectNulls = false,
    title,
    option: customOption,
    series: customSeries,
    ...props
}, ref) => {
    const chartOption = useMemo(() => {
        // If custom series provided, use those directly
        if (customSeries) {
            return {
                xAxis: { type: 'category' as const, data: data?.categories || [] },
                yAxis: { type: 'value' as const },
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
        const baseOption = createLineChartOption({
            categories: data.categories,
            series: data.series.map(s => ({
                name: s.name,
                data: s.data,
                ...(s.color && { color: s.color }),
                // Preserve any additional properties from the series data
                ...Object.fromEntries(
                    Object.entries(s).filter(([key]) => !['name', 'data', 'color'].includes(key))
                ),
            })),
            ...(title && { title }),
        });

        // Apply line-specific configurations
        if (baseOption.series && Array.isArray(baseOption.series)) {
            baseOption.series = baseOption.series.map((series: any, index) => {
                const result: any = {
                    ...series,
                    smooth: data.series[index]?.smooth ?? smooth,
                    showSymbol: symbol,
                    symbolSize: data.series[index]?.symbolSize ?? symbolSize,
                    connectNulls: data.series[index]?.connectNulls ?? connectNulls,
                };
                
                if (data.series[index]?.symbol) {
                    result.symbol = data.series[index].symbol;
                }
                
                if (stack && data.series[index]?.stack) {
                    result.stack = data.series[index].stack;
                } else if (stack) {
                    result.stack = 'total';
                }
                
                if (area) {
                    result.areaStyle = {};
                }
                
                return result;
            });
        }

        // Merge with custom option if provided
        return customOption ? mergeOptions(baseOption, customOption) : baseOption;
    }, [data, smooth, area, stack, symbol, symbolSize, connectNulls, title, customOption, customSeries]);

    return (
        <BaseChart
            ref={ref}
            option={chartOption}
            {...props}
        />
    );
});

LineChart.displayName = 'LineChart';