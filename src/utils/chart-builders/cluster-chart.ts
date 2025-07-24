import type { EChartsOption } from 'echarts/types/dist/shared';
import type { ClusterChartProps } from '@/types';

import { isObjectData } from '../data-processing';
import {
  buildBaseOption,
  buildAxisOption,
  buildTooltipOption,
} from '../base-options';
import { enhanceAxisForNegativeValues } from '../negative-value-handling';

export function buildClusterChartOption(props: ClusterChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  // Default cluster colors
  const DEFAULT_CLUSTER_COLORS = [
    '#37A2DA', '#e06343', '#37a354', '#b55dba', '#b5bd48', '#8378EA', '#96BFFF'
  ];
  
  const clusterCount = props.clusterCount || 6;
  const clusterColors = props.clusterColors || props.colorPalette || DEFAULT_CLUSTER_COLORS;
  const visualMapPosition = props.visualMapPosition || 'left';
  
  if (!props.data || props.data.length === 0) {
    return { ...baseOption, series: [] };
  }
  
  // Process data into the format needed for ecStat clustering
  let sourceData: number[][];
  
  if (isObjectData(props.data)) {
    const xField = props.xField || 'x';
    const yField = props.yField || 'y';
    sourceData = props.data.map((item: any) => [
      Number(item[xField]) || 0,
      Number(item[yField]) || 0,
    ]);
  } else {
    sourceData = props.data.map((point: any) => {
      if (Array.isArray(point)) {
        return [Number(point[0]) || 0, Number(point[1]) || 0];
      }
      return [0, 0];
    });
  }
  
  // Detect if we have negative values in the data for proper axis configuration
  let hasNegativeX = false;
  let hasNegativeY = false;
  
  sourceData.forEach(([x, y]) => {
    if (x !== undefined && x < 0) hasNegativeX = true;
    if (y !== undefined && y < 0) hasNegativeY = true;
  });
  
  const outputClusterIndexDimension = 2;
  const gridLeft = visualMapPosition === 'left' ? 120 : 60;
  
  
  // Create visual map pieces for cluster coloring
  const pieces = Array.from({ length: clusterCount }, (_, i) => ({
    value: i,
    label: `cluster ${i}`,
    color: clusterColors[i % clusterColors.length] || clusterColors[0] || DEFAULT_CLUSTER_COLORS[0]!,
  }));
  
  const chartOption: EChartsOption = {
    ...baseOption,
    dataset: [
      {
        source: sourceData
      },
      {
        transform: {
          type: 'ecStat:clustering',
          print: true,
          config: {
            clusterCount,
            outputType: 'single',
            outputClusterIndexDimension
          }
        }
      }
    ],
    tooltip: props.tooltip ? buildTooltipOption(props.tooltip, props.theme) : {
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
    xAxis: enhanceAxisForNegativeValues({
      ...buildAxisOption(props.xAxis, 'numeric', props.theme),
      // Always override type to 'value' for clustering
      type: 'value',
      scale: true,
    }, hasNegativeX),
    yAxis: enhanceAxisForNegativeValues({
      ...buildAxisOption(props.yAxis, 'numeric', props.theme),
      // Always override type to 'value' for clustering
      type: 'value',
      scale: true,
    }, hasNegativeY),
    series: {
      type: 'scatter',
      encode: { 
        tooltip: [0, 1, 2],
        x: 0,
        y: 1
      },
      symbolSize: props.pointSize || 15,
      itemStyle: (props as any).itemStyle || { borderColor: '#555' },
      datasetIndex: 1,
    },
    ...props.customOption,
  };
  
  return chartOption;
}