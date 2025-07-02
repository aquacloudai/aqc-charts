import React, { forwardRef, useMemo } from 'react';
import type { 
    BaseChartProps, 
    ChartRef, 
    LegendComponentOption,
    TooltipOption,
    XAXisOption,
    YAXisOption
} from '@/types';
import { BaseChart } from '../BaseChart';

export interface GanttTask {
    readonly id: string;
    readonly name: string;
    readonly category: string;
    readonly startTime: Date | string | number;
    readonly endTime: Date | string | number;
    readonly color?: string;
    readonly vip?: boolean;
}

export interface GanttCategory {
    readonly name: string;
    readonly label?: string;
}

export interface OldGanttChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: {
        readonly tasks: readonly GanttTask[];
        readonly categories: readonly GanttCategory[];
    };
    readonly heightRatio?: number;
    readonly showDataZoom?: boolean;
    readonly draggable?: boolean;
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
        readonly show?: boolean;
        readonly backgroundColor?: string;
        readonly borderWidth?: number;
        readonly [key: string]: unknown;
    };
    readonly onTaskDrag?: (task: GanttTask, newStartTime: Date, newEndTime: Date) => void;
}

export const OldGanttChart = forwardRef<ChartRef, OldGanttChartProps>(({
    data,
    heightRatio = 0.6,
    showDataZoom = true,
    draggable: _draggable = false,
    showLegend = false,
    legend,
    tooltip,
    xAxis,
    yAxis,
    grid,
    onTaskDrag: _onTaskDrag,
    ...props
}, ref) => {
    const processedData = useMemo(() => {
        if (!data?.tasks || !data?.categories) {
            return { tasks: [], categories: [] };
        }

        const categoryMap = new Map(data.categories.map((cat, index) => [cat.name, index]));
        
        const processedTasks = data.tasks.map(task => {
            const categoryIndex = categoryMap.get(task.category) ?? 0;
            return [
                categoryIndex,
                new Date(task.startTime).getTime(),
                new Date(task.endTime).getTime(),
                task.name,
                task.vip || false,
                task.id,
                task.color
            ];
        });

        const processedCategories = data.categories.map((cat, index) => [
            index,
            cat.name,
            cat.label || cat.name
        ]);

        return {
            tasks: processedTasks,
            categories: processedCategories
        };
    }, [data]);

    const renderGanttItem = useMemo(() => {
        return (params: any, api: any) => {
            const categoryIndex = api.value(0);
            const timeArrival = api.coord([api.value(1), categoryIndex]);
            const timeDeparture = api.coord([api.value(2), categoryIndex]);
            
            const barLength = timeDeparture[0] - timeArrival[0];
            const barHeight = api.size([0, 1])[1] * heightRatio;
            const x = timeArrival[0];
            const y = timeArrival[1] - barHeight;
            
            const taskName = api.value(3) + '';
            const isVip = api.value(4);
            const taskColor = api.value(6);
            
            // Calculate if text should be shown
            const textWidth = taskName.length * 6; // Approximate text width
            const showText = barLength > textWidth + 40 && x + barLength >= 180;
            
            const clipRect = (rect: any) => {
                const coordSys = params.coordSys;
                return {
                    x: Math.max(rect.x, coordSys.x),
                    y: Math.max(rect.y, coordSys.y),
                    width: Math.min(rect.width, coordSys.x + coordSys.width - Math.max(rect.x, coordSys.x)),
                    height: Math.min(rect.height, coordSys.y + coordSys.height - Math.max(rect.y, coordSys.y))
                };
            };

            const rectNormal = clipRect({
                x: x,
                y: y,
                width: barLength,
                height: barHeight
            });

            const rectVip = clipRect({
                x: x,
                y: y,
                width: barLength / 2,
                height: barHeight
            });

            const children = [
                {
                    type: 'rect',
                    shape: rectNormal,
                    style: {
                        fill: taskColor || api.style().fill,
                        stroke: api.style().stroke
                    }
                }
            ];

            if (isVip) {
                children.push({
                    type: 'rect',
                    shape: rectVip,
                    style: {
                        fill: '#ddb30b',
                        stroke: 'transparent'
                    }
                });
            }

            if (showText) {
                children.push({
                    type: 'rect',
                    shape: rectNormal,
                    style: {
                        fill: 'transparent',
                        stroke: 'transparent',
                        text: taskName,
                        textFill: '#fff',
                        textAlign: 'center',
                        textVerticalAlign: 'middle',
                        fontSize: 12
                    } as any
                });
            }

            return {
                type: 'group',
                children
            };
        };
    }, [heightRatio]);

    const renderAxisLabelItem = useMemo(() => {
        return (params: any, api: any) => {
            const y = api.coord([0, api.value(0)])[1];
            if (y < params.coordSys.y + 5) {
                return;
            }
            
            return {
                type: 'group',
                position: [10, y],
                children: [
                    {
                        type: 'path',
                        shape: {
                            d: 'M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z',
                            x: 0,
                            y: -20,
                            width: 90,
                            height: 20,
                            layout: 'cover'
                        },
                        style: {
                            fill: '#368c6c'
                        }
                    },
                    {
                        type: 'text',
                        style: {
                            x: 24,
                            y: -3,
                            text: api.value(1),
                            textVerticalAlign: 'bottom',
                            textAlign: 'center',
                            fill: '#fff',
                            fontSize: 12
                        }
                    },
                    {
                        type: 'text',
                        style: {
                            x: 75,
                            y: -2,
                            text: api.value(2),
                            textVerticalAlign: 'bottom',
                            textAlign: 'center',
                            fill: '#000',
                            fontSize: 12
                        }
                    }
                ]
            };
        };
    }, []);

    const chartOption = useMemo(() => ({
        animation: false,
        tooltip: {
            formatter: (params: any) => {
                if (Array.isArray(params)) {
                    const param = params[0];
                    if (param?.seriesIndex === 0) {
                        const startTime = new Date(param.value[1]).toLocaleString();
                        const endTime = new Date(param.value[2]).toLocaleString();
                        const taskName = param.value[3];
                        const category = data.categories[param.value[0]]?.name || 'Unknown';
                        return `
                            <strong>${taskName}</strong><br/>
                            Category: ${category}<br/>
                            Start: ${startTime}<br/>
                            End: ${endTime}
                        `;
                    }
                }
                return '';
            },
            ...tooltip,
        },
        grid: {
            show: true,
            top: 70,
            bottom: showDataZoom ? 40 : 20,
            left: 100,
            right: 20,
            backgroundColor: '#fff',
            borderWidth: 0,
            ...grid,
        },
        xAxis: {
            type: 'time',
            position: 'top',
            splitLine: {
                lineStyle: {
                    color: ['#E9EDFF']
                }
            },
            axisLine: {
                show: false
            },
            axisTick: {
                lineStyle: {
                    color: '#929ABA'
                }
            },
            axisLabel: {
                color: '#929ABA',
                inside: false,
                align: 'center'
            },
            ...xAxis,
        },
        yAxis: {
            axisTick: { show: false },
            splitLine: { show: false },
            axisLine: { show: false },
            axisLabel: { show: false },
            min: 0,
            max: processedData.categories.length,
            ...yAxis,
        },
        ...(showDataZoom && {
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: 0,
                    filterMode: 'weakFilter',
                    height: 20,
                    bottom: 0,
                    start: 0,
                    end: 50,
                    handleIcon: 'path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    showDetail: false
                },
                {
                    type: 'inside',
                    xAxisIndex: 0,
                    filterMode: 'weakFilter',
                    start: 0,
                    end: 50,
                    zoomOnMouseWheel: false,
                    moveOnMouseMove: true
                },
                {
                    type: 'slider',
                    yAxisIndex: 0,
                    zoomLock: true,
                    width: 10,
                    right: 10,
                    top: 70,
                    bottom: 40,
                    start: 0,
                    end: 100,
                    handleSize: 0,
                    showDetail: false
                },
                {
                    type: 'inside',
                    yAxisIndex: 0,
                    start: 0,
                    end: 100,
                    zoomOnMouseWheel: false,
                    moveOnMouseMove: true,
                    moveOnMouseWheel: true
                }
            ]
        }),
        legend: showLegend 
            ? {
                top: 20,
                ...legend,
            } as LegendComponentOption
            : undefined,
        series: [
            {
                id: 'ganttData',
                type: 'custom',
                renderItem: renderGanttItem,
                dimensions: ['categoryIndex', 'startTime', 'endTime', 'taskName', 'vip', 'id', 'color'],
                encode: {
                    x: [1, 2], // startTime, endTime
                    y: 0,      // categoryIndex
                    tooltip: [0, 1, 2, 3] // categoryIndex, startTime, endTime, taskName
                },
                data: processedData.tasks
            },
            {
                type: 'custom',
                renderItem: renderAxisLabelItem,
                dimensions: ['categoryIndex', 'name', 'label'],
                encode: {
                    x: -1,
                    y: 0
                },
                data: processedData.categories
            }
        ]
    }), [
        data.categories,
        processedData,
        showDataZoom,
        showLegend,
        tooltip,
        grid,
        xAxis,
        yAxis,
        legend,
        renderGanttItem,
        renderAxisLabelItem
    ]);

    return (
        <BaseChart
            ref={ref}
            option={chartOption as any}
            {...props}
        />
    );
});

OldGanttChart.displayName = 'OldGanttChart';