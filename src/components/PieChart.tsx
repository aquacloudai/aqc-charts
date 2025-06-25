import React, { forwardRef, useMemo } from 'react';
import type { BaseChartProps, ChartRef, ChartDataPoint } from '@/types';
import { BaseChart } from './BaseChart';

export interface PieChartProps extends Omit<BaseChartProps, 'series' | 'xAxis' | 'yAxis'> {
    readonly data: readonly ChartDataPoint[];
    readonly radius?: string | number | readonly [string | number, string | number];
    readonly center?: readonly [string | number, string | number];
    readonly roseType?: boolean | 'radius' | 'area';
    readonly showLabels?: boolean;
    readonly showLegend?: boolean;
}

export const PieChart = forwardRef<ChartRef, PieChartProps>(({
    data,
    radius = ['40%', '70%'],
    center = ['50%', '50%'],
    roseType = false,
    showLabels = true,
    showLegend = true,
    ...props
}, ref) => {
    const series = useMemo(() => [{
        type: 'pie' as const,
        data,
        radius,
        center,
        roseType: roseType === true ? 'radius' : roseType,
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
    }], [data, radius, center, roseType, showLabels]);

    const chartOption = useMemo(() => ({
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: showLegend ? {
            data: data.map((item) => item.name),
            top: 20,
        } : undefined,
        series,
    }), [series, showLegend, data]);

    return (
        <BaseChart
            ref={ref}
            option={chartOption}
            {...props}
        />
    );
});

PieChart.displayName = 'PieChart';
