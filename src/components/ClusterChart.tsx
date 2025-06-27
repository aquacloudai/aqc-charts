import React, { forwardRef, useMemo } from 'react';
import type { BaseChartProps, ChartRef, EChartsOption, ClusterChartData, ClusterVisualMapPiece, EcStatClusteringTransformOption } from '@/types';
import { BaseChart } from './BaseChart';

export interface ClusterChartProps extends Omit<BaseChartProps, 'option'> {
    readonly data: ClusterChartData;
    readonly clusterCount?: number;
    readonly outputClusterIndexDimension?: number;
    readonly colors?: readonly string[];
    readonly symbolSize?: number;
    readonly itemStyle?: {
        readonly borderColor?: string;
        readonly borderWidth?: number;
        readonly [key: string]: unknown;
    };
    readonly visualMapPosition?: 'left' | 'right' | 'top' | 'bottom';
    readonly gridLeft?: number | string;
    readonly option?: Partial<EChartsOption>;
}

const DEFAULT_COLORS = [
    '#37A2DA',
    '#e06343',
    '#37a354',
    '#b55dba',
    '#b5bd48',
    '#8378EA',
    '#96BFFF'
];

export const ClusterChart = forwardRef<ChartRef, ClusterChartProps>(({
    data,
    clusterCount = 6,
    outputClusterIndexDimension = 2,
    colors = DEFAULT_COLORS,
    symbolSize = 15,
    itemStyle = { borderColor: '#555' },
    visualMapPosition = 'left',
    gridLeft = 120,
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
        // ecStat clustering expects purely numerical data for clustering dimensions
        const sourceData = data.data.map(point => [
            point.value[0], // x (dimension 0)
            point.value[1], // y (dimension 1)
            // dimension 2 will be populated by clustering transform with cluster index
        ]);

        // Debug logging
        console.log('ClusterChart sourceData sample:', sourceData.slice(0, 3));
        console.log('ClusterChart config:', { clusterCount, outputClusterIndexDimension });

        // Create visual map pieces
        const pieces: ClusterVisualMapPiece[] = [];
        for (let i = 0; i < clusterCount; i++) {
            pieces.push({
                value: i,
                label: `cluster ${i}`,
                color: colors[i] || colors[0] || DEFAULT_COLORS[0] || '#37A2DA'
            });
        }

        // Create the ECharts option with dataset transforms
        const baseOption: EChartsOption = {
            dataset: [
                {
                    source: sourceData
                },
                {
                    transform: {
                        type: 'ecStat:clustering',
                        print: true, // Enable debug logging
                        config: {
                            clusterCount,
                            outputType: 'single',
                            outputClusterIndexDimension
                        }
                    }
                }
            ],
            tooltip: {
                position: 'top',
                formatter: (params: any) => {
                    const [x, y, cluster] = params.value;
                    const name = params.name || '';
                    return `${name ? name + '<br/>' : ''}X: ${x}<br/>Y: ${y}<br/>Cluster: ${cluster}`;
                }
            },
            visualMap: {
                type: 'piecewise',
                top: visualMapPosition === 'top' ? 10 : visualMapPosition === 'bottom' ? 'bottom' : 'middle',
                ...(visualMapPosition === 'left' && { left: 10 }),
                ...(visualMapPosition === 'right' && { left: 'right', right: 10 }),
                ...(visualMapPosition === 'bottom' && { bottom: 10 }),
                min: 0,
                max: clusterCount,
                splitNumber: clusterCount,
                dimension: outputClusterIndexDimension,
                pieces: pieces
            },
            grid: {
                left: gridLeft
            },
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
            series: {
                type: 'scatter',
                encode: { 
                    tooltip: [0, 1],
                    x: 0,
                    y: 1
                },
                symbolSize,
                itemStyle,
                datasetIndex: 1
            },
            ...(title && { title: { text: title, left: 'center' } })
        };

        // Merge with custom option if provided
        return customOption ? { ...baseOption, ...customOption } : baseOption;
    }, [
        data, 
        clusterCount, 
        outputClusterIndexDimension, 
        colors, 
        symbolSize, 
        itemStyle, 
        visualMapPosition, 
        gridLeft, 
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

ClusterChart.displayName = 'ClusterChart';