import React, { forwardRef, useMemo } from 'react';
import type { BaseChartProps, ChartRef, ChartDataPoint, PieSeriesOption } from '@/types';
import { BaseChart } from './BaseChart';

export interface PieChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: readonly ChartDataPoint[];
    readonly radius?: string | number | readonly [string | number, string | number];
    readonly center?: readonly [string | number, string | number];
    readonly roseType?: boolean | 'radius' | 'area';
    readonly showLabels?: boolean;
    readonly showLegend?: boolean;
    readonly legendOptions?: import('echarts').EChartsOption['legend']; 
    readonly series?: PieSeriesOption[];
}


export const PieChart = forwardRef<ChartRef, PieChartProps>(({
    data,
    radius = ['40%', '70%'],
    center = ['50%', '50%'],
    roseType = false,
    showLabels = true,
    showLegend = true,
    legendOptions, // 👈 here
    series: customSeries,
    ...props
}, ref) => {

    const series = useMemo(() => {
        if (customSeries) {
            return customSeries;
        }

        return [{
            type: 'pie' as const,
            data: [...data] as any,
            radius,
            center: [...center] as any,
            ...(roseType && { roseType: roseType === true ? 'radius' : roseType }),
            label: {
                show: showLabels,
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 14,
                    fontWeight: 'bold',
                },
            },
        }] as PieSeriesOption[];
    }, [data, radius, center, roseType, showLabels, customSeries]);

    const chartOption = useMemo(() => ({
    tooltip: {
        trigger: 'item' as const,
        formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: showLegend
        ? {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: data.map((item) => item.name),
            ...legendOptions,
        }
        : undefined,
    series,
    }), [series, showLegend, legendOptions, data]);

    return (
        <BaseChart
            ref={ref}
            option={chartOption as any}
            {...props}
        />
    );
});

PieChart.displayName = 'PieChart';
