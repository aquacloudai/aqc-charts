import React, { forwardRef, useMemo } from 'react';
import type { BaseChartProps, ChartRef, CalendarHeatmapDataPoint, CalendarConfig, VisualMapConfig } from '@/types';
import { BaseChart } from './BaseChart';

export interface CalendarHeatmapChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: readonly CalendarHeatmapDataPoint[];
    readonly year: string | number;
    readonly calendar?: CalendarConfig;
    readonly visualMap?: VisualMapConfig;
    readonly tooltipFormatter?: (params: { name: string; value: readonly [string, number] }) => string;
}

export const CalendarHeatmapChart = forwardRef<ChartRef, CalendarHeatmapChartProps>(({
    data,
    year,
    calendar = {},
    visualMap = {},
    tooltipFormatter,
    title,
    ...props
}, ref) => {
    const chartOption = useMemo(() => {
        // Convert data to ECharts format: [date, value]
        const seriesData = data.map(item => [item.date, item.value] as const);

        // Calculate min/max values for visual map
        const values = data.map(item => item.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);

        const titleConfig = typeof title === 'string'
            ? { text: title }
            : title;

        return {
            ...(titleConfig && {
                title: {
                    top: 30,
                    left: 'center',
                    ...titleConfig,
                }
            }),

            tooltip: {
                formatter: tooltipFormatter ? (params: { name: string; value: readonly [string, number] }) => {
                    return tooltipFormatter(params);
                } : (params: { name: string; value: readonly [string, number] }) => {
                    const [date, value] = params.value;
                    return `${date}<br/>Value: ${value}`;
                },
            },

            visualMap: {
                min: minValue,
                max: maxValue,
                type: 'piecewise',
                orient: 'horizontal',
                left: 'center',
                top: titleConfig ? 65 : 35,
                inRange: {
                    color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
                },
                ...visualMap,
            },

            calendar: {
                top: titleConfig ? 120 : 90,
                left: 30,
                right: 30,
                cellSize: ['auto', 13] as any,
                range: year.toString(),
                itemStyle: {
                    borderWidth: 0.5,
                    borderColor: '#fff',
                },
                yearLabel: { show: false },
                dayLabel: {
                    firstDay: 1, // Monday first
                    nameMap: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                },
                monthLabel: {
                    nameMap: 'en',
                },
                ...calendar,
            },

            series: {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: seriesData,
            },
        };
    }, [data, year, calendar, visualMap, tooltipFormatter, title]);

    return (
        <BaseChart
            ref={ref}
            option={chartOption as any}
            {...props}
        />
    );
});

CalendarHeatmapChart.displayName = 'CalendarHeatmapChart';