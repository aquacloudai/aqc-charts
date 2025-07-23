import type { EChartsOption } from 'echarts/types/dist/shared';
import type { ScatterChartProps } from '@/types';

import {
  isObjectData,
  groupDataByField,
} from '../data-processing';
import {
  buildBaseOption,
  buildAxisOption,
  buildLegendOption,
  calculateGridSpacing,
  buildTooltipOption,
} from '../base-options';

export function buildScatterChartOption(props: ScatterChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  let series: any[] = [];
  
  if (props.series) {
    series = props.series.map((s: any) => ({
      name: s.name,
      type: 'scatter',
      data: s.data,
      itemStyle: { color: s.color, opacity: props.pointOpacity || 0.8 },
      symbolSize: s.pointSize || props.pointSize || 10,
      symbol: s.pointShape || props.pointShape || 'circle',
    }));
  } else if (props.data && props.data.length > 0) {
    if (isObjectData(props.data)) {
      if (props.seriesField) {
        // Group by series field
        const groups = groupDataByField(props.data, props.seriesField);
        series = Object.entries(groups).map(([name, groupData]) => {
          let processedData;
          if (props.sizeField) {
            processedData = groupData.map((item: any) => [
              item[props.xField || 'x'],
              item[props.yField || 'y'],
              item[props.sizeField!],
            ]);
          } else {
            processedData = groupData.map((item: any) => [
              item[props.xField || 'x'],
              item[props.yField || 'y'],
            ]);
          }
          
          return {
            name,
            type: 'scatter',
            data: processedData,
            symbolSize: props.sizeField 
              ? (value: number[]) => Math.sqrt(value[2] || 1) * 5
              : props.pointSize || 10,
            symbol: props.pointShape || 'circle',
            itemStyle: { opacity: props.pointOpacity || 0.8 },
          };
        });
      } else {
        // Single series
        let processedData;
        if (props.sizeField) {
          // Bubble chart with size dimension
          processedData = props.data.map((item: any) => [
            item[props.xField || 'x'],
            item[props.yField || 'y'],
            item[props.sizeField!],
          ]);
        } else {
          processedData = props.data.map((item: any) => [
            item[props.xField || 'x'],
            item[props.yField || 'y'],
          ]);
        }
        
        series = [{
          type: 'scatter',
          data: processedData,
          symbolSize: props.sizeField 
            ? (value: number[]) => Math.sqrt(value[2] || 1) * 5 // Scale the size
            : props.pointSize || 10,
          symbol: props.pointShape || 'circle',
          itemStyle: { opacity: props.pointOpacity || 0.8 },
        }];
      }
    } else {
      // Array data format
      series = [{
        type: 'scatter',
        data: [...props.data],
        symbolSize: props.pointSize || 10,
        symbol: props.pointShape || 'circle',
        itemStyle: { opacity: props.pointOpacity || 0.8 },
      }];
    }
  }
  
  const xAxisOption = buildAxisOption(props.xAxis, 'numeric', props.theme);
  const yAxisOption = buildAxisOption(props.yAxis, 'numeric', props.theme);
  
  // Ensure axis types are 'value' for scatter charts
  if (xAxisOption.type === 'linear') xAxisOption.type = 'value';
  if (yAxisOption.type === 'linear') yAxisOption.type = 'value';
  
  return {
    ...baseOption,
    grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, false),
    xAxis: xAxisOption,
    yAxis: yAxisOption,
    series,
    legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
    tooltip: buildTooltipOption(props.tooltip, props.theme),
    ...props.customOption,
  };
}