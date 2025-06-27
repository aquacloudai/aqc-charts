import React, { forwardRef, useMemo } from 'react';
import type { BaseChartProps, ChartRef, EChartsOption, RegressionChartData, RegressionMethod, EcStatRegressionTransformOption } from '@/types';
import { BaseChart } from './BaseChart';

export interface RegressionChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: RegressionChartData;
    readonly method?: RegressionMethod;
    readonly formulaOn?: 'start' | 'end' | boolean;
    readonly scatterName?: string;
    readonly lineName?: string;
    readonly scatterColor?: string;
    readonly lineColor?: string;
    readonly symbolSize?: number;
    readonly showFormula?: boolean;
    readonly formulaFontSize?: number;
    readonly formulaPosition?: { dx?: number; dy?: number };
    readonly splitLineStyle?: 'solid' | 'dashed' | 'dotted';
    readonly legendPosition?: 'top' | 'bottom' | 'left' | 'right';
    readonly option?: Partial<EChartsOption>;
}

export const RegressionChart = forwardRef<ChartRef, RegressionChartProps>(({
    data,
    method = 'linear',
    formulaOn = 'end',
    scatterName = 'scatter',
    lineName = 'regression',
    scatterColor = '#5470c6',
    lineColor = '#91cc75',
    symbolSize = 8,
    showFormula = true,
    formulaFontSize = 16,
    formulaPosition = { dx: -20 },
    splitLineStyle = 'dashed',
    legendPosition = 'bottom',
    title,
    option: customOption,
    ...props
}, ref) => {
    const chartOption = useMemo(() => {
        // Ensure data exists
        if (!data?.data || !Array.isArray(data.data)) {
            return { series: [] };
        }

        // Convert our data format to the source format expected by ecStat
        const sourceData = data.data.map(point => [
            point.value[0], // x
            point.value[1]  // y
        ]);

        // Create the ECharts option with dataset transforms
        const baseOption: EChartsOption = {
            dataset: [
                {
                    source: sourceData
                },
                {
                    transform: {
                        type: 'ecStat:regression',
                        config: {
                            method,
                            ...(formulaOn !== false && { formulaOn })
                        }
                    } as EcStatRegressionTransformOption
                }
            ],
            ...(title && {
                title: {
                    text: title,
                    subtext: `By ecStat.regression (${method})`,
                    sublink: 'https://github.com/ecomfe/echarts-stat',
                    left: 'center'
                }
            }),
            legend: {
                [legendPosition]: legendPosition === 'top' || legendPosition === 'bottom' ? 5 : undefined,
                [legendPosition === 'left' ? 'left' : legendPosition === 'right' ? 'right' : 'bottom']: 
                    legendPosition === 'left' || legendPosition === 'right' ? 5 : 5
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            xAxis: {
                type: 'value',
                scale: true,
                splitLine: {
                    lineStyle: {
                        type: splitLineStyle
                    }
                },
                ...data.xAxis
            },
            yAxis: {
                type: 'value',
                scale: true,
                splitLine: {
                    lineStyle: {
                        type: splitLineStyle
                    }
                },
                ...data.yAxis
            },
            series: [
                {
                    name: scatterName,
                    type: 'scatter',
                    itemStyle: {
                        color: scatterColor
                    },
                    symbolSize
                },
                {
                    name: lineName,
                    type: 'line',
                    datasetIndex: 1,
                    symbolSize: 0.1,
                    symbol: 'circle',
                    itemStyle: {
                        color: lineColor
                    },
                    lineStyle: {
                        color: lineColor,
                        width: 2
                    },
                    ...(showFormula && {
                        label: { 
                            show: true, 
                            fontSize: formulaFontSize 
                        },
                        labelLayout: formulaPosition
                    }),
                    encode: { 
                        label: 2, 
                        tooltip: 1 
                    }
                }
            ]
        };

        // Merge with custom option if provided
        return customOption ? { ...baseOption, ...customOption } : baseOption;
    }, [
        data, 
        method, 
        formulaOn, 
        scatterName, 
        lineName, 
        scatterColor, 
        lineColor, 
        symbolSize, 
        showFormula, 
        formulaFontSize, 
        formulaPosition, 
        splitLineStyle, 
        legendPosition, 
        title, 
        customOption
    ]);

    return (
        <BaseChart
            ref={ref}
            option={chartOption}
            {...props}
        />
    );
});

RegressionChart.displayName = 'RegressionChart';