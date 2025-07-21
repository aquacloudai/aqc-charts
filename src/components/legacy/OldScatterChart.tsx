import React, { forwardRef, useMemo } from 'react';
import type { BaseChartProps, ChartRef, EChartsOption, ScatterSeriesOption, ScatterChartData } from '@/types';
import { BaseChart } from '../BaseChart';

export interface OldScatterChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: ScatterChartData;
    readonly symbolSize?: number | readonly number[] | ((value: readonly number[], params: unknown) => number);
    readonly symbol?: string;
    readonly large?: boolean;
    readonly largeThreshold?: number;
    readonly progressive?: number;
    readonly progressiveThreshold?: number;
    // Advanced features (use option prop for complex configurations)
    readonly enableAdvancedFeatures?: boolean;
    readonly option?: Partial<EChartsOption>;
    readonly series?: ScatterSeriesOption[];
}

export const OldScatterChart = forwardRef<ChartRef, OldScatterChartProps>(({
    data,
    symbolSize = 10,
    symbol = 'circle',
    large = false,
    largeThreshold = 2000,
    progressive = 400,
    progressiveThreshold = 3000,
    enableAdvancedFeatures = false,
    title,
    option: customOption,
    series: customSeries,
    ...props
}, ref) => {
    const chartOption = useMemo(() => {
        // If custom series provided, use those directly
        if (customSeries) {
            return {
                xAxis: { 
                    type: 'value' as const,
                    scale: true,
                    ...data.xAxis
                },
                yAxis: { 
                    type: 'value' as const,
                    scale: true,
                    ...data.yAxis
                },
                series: customSeries,
                tooltip: {
                    trigger: 'item',
                    formatter: (params: any) => {
                        const value = params.value;
                        const name = params.seriesName;
                        const dataName = params.name || '';
                        
                        if (Array.isArray(value)) {
                            if (value.length === 3) {
                                return `${name}<br/>${dataName}<br/>X: ${value[0]}<br/>Y: ${value[1]}<br/>Size: ${value[2]}`;
                            }
                            return `${name}<br/>${dataName}<br/>X: ${value[0]}<br/>Y: ${value[1]}`;
                        }
                        return `${name}<br/>${dataName}<br/>Value: ${value}`;
                    }
                },
                ...(title && { title: { text: title, left: 'center' } }),
                ...(customOption && customOption),
            } as EChartsOption;
        }
        
        // Ensure data.series exists and is an array
        if (!data?.series || !Array.isArray(data.series)) {
            return { series: [] };
        }
        
        // Create scatter chart option
        const baseOption: EChartsOption = {
            xAxis: {
                type: 'value',
                scale: true,
                ...data.xAxis
            },
            yAxis: {
                type: 'value',
                scale: true,
                ...data.yAxis
            },
            series: data.series.map(series => ({
                ...series,
                type: 'scatter' as const,
                symbolSize: series.symbolSize ?? symbolSize,
                symbol: series.symbol ?? symbol,
                large: series.large ?? large,
                largeThreshold: series.largeThreshold ?? largeThreshold,
                progressive: series.progressive ?? progressive,
                progressiveThreshold: series.progressiveThreshold ?? progressiveThreshold,
            })),
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    const value = params.value;
                    const name = params.seriesName;
                    const dataName = params.name || '';
                    
                    if (Array.isArray(value)) {
                        if (value.length === 3) {
                            return `${name}<br/>${dataName}<br/>X: ${value[0]}<br/>Y: ${value[1]}<br/>Size: ${value[2]}`;
                        }
                        return `${name}<br/>${dataName}<br/>X: ${value[0]}<br/>Y: ${value[1]}`;
                    }
                    return `${name}<br/>${dataName}<br/>Value: ${value}`;
                }
            },
            ...(title && { title: { text: title, left: 'center' } }),
        };

        // Merge with custom option if provided
        return customOption ? { ...baseOption, ...customOption } : baseOption;
    }, [data, symbolSize, symbol, large, largeThreshold, progressive, progressiveThreshold, enableAdvancedFeatures, title, customOption, customSeries]);

    return (
        <BaseChart
            ref={ref}
            option={chartOption}
            {...props}
        />
    );
});

OldScatterChart.displayName = 'OldScatterChart';