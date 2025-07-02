import React, { forwardRef, useMemo } from 'react';
import type { BaseChartProps, ChartRef, ChartDataPoint, PieSeriesOption, LegendComponentOption } from '@/types';
import { BaseChart } from '../BaseChart';

export interface OldPieChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: readonly ChartDataPoint[];
    readonly radius?: string | number | readonly [string | number, string | number];
    readonly center?: readonly [string | number, string | number];
    readonly roseType?: boolean | 'radius' | 'area';
    readonly showLabels?: boolean;
    readonly showLegend?: boolean;
    readonly legend?: LegendComponentOption;
    readonly series?: PieSeriesOption[];
}


export const OldPieChart = forwardRef<ChartRef, OldPieChartProps>(({
    data,
    radius = ['40%', '70%'],
    center = ['50%', '50%'],
    roseType = false,
    showLabels = true,
    showLegend = true,
    legend,
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
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            show: showLegend,
            data: data.map((item) => item.name),
            ...legend,
        } as LegendComponentOption,
        series,
    }), [series, showLegend, legend, data]);

    return (
        <BaseChart
            ref={ref}
            option={chartOption as any}
            {...props}
        />
    );
});

OldPieChart.displayName = 'OldPieChart';
