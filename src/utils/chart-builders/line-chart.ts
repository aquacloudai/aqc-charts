import type { EChartsOption } from 'echarts/types/dist/shared';
import type { LineChartProps } from '@/types';
import type { AxisConfig } from '@/types/config';

import {
  isObjectData,
  groupDataByField,
  mapStrokeStyleToECharts,
} from '../data-processing';
import {
  buildBaseOption,
  buildAxisOption,
  buildLegendOption,
  calculateGridSpacing,
  buildTooltipOption,
} from '../base-options';

export function buildLineChartOption(props: LineChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  // Handle different data formats
  let series: any[] = [];
  let xAxisData: any[] = [];
  
  if (props.series && props.data) {
    // Multiple series provided explicitly
    series = props.series.map((s) => ({
      name: s.name,
      type: 'line',
      data: isObjectData(s.data) && props.yField 
        ? s.data.map(item => item[props.yField as string])
        : s.data,
      smooth: s.smooth ?? props.smooth,
      lineStyle: { 
        width: s.strokeWidth ?? props.strokeWidth,
        type: mapStrokeStyleToECharts(s.strokeStyle ?? props.strokeStyle)
      },
      itemStyle: { color: s.color },
      areaStyle: (s.showArea ?? props.showArea) ? { opacity: props.areaOpacity || 0.3 } : undefined,
      symbol: (s.showPoints ?? props.showPoints) !== false ? (s.pointShape ?? props.pointShape ?? 'circle') : 'none',
      symbolSize: s.pointSize ?? props.pointSize ?? 4,
      yAxisIndex: s.yAxisIndex ?? 0, // Default to first y-axis
    }));
    
    // Extract x-axis data from first series
    if (props.series && props.series[0] && isObjectData(props.series[0].data) && props.xField) {
      xAxisData = props.series[0].data.map(item => (item as any)[props.xField as string]);
    }
  } else if (props.data) {
    // Single series from main data
    if (isObjectData(props.data)) {
      // Object data format
      if (props.seriesField) {
        // Group by series field
        const groups = groupDataByField(props.data, props.seriesField);
        series = Object.entries(groups).map(([name, groupData]) => {
          const seriesSpecificConfig = props.seriesConfig?.[name] || {};
          return {
            name,
            type: 'line',
            data: groupData.map(item => item[props.yField as string]),
            smooth: seriesSpecificConfig.smooth ?? props.smooth,
            lineStyle: { 
              width: seriesSpecificConfig.strokeWidth ?? props.strokeWidth,
              type: mapStrokeStyleToECharts(seriesSpecificConfig.strokeStyle ?? props.strokeStyle)
            },
            itemStyle: seriesSpecificConfig.color ? { color: seriesSpecificConfig.color } : undefined,
            areaStyle: (seriesSpecificConfig.showArea ?? props.showArea) ? { 
              opacity: seriesSpecificConfig.areaOpacity ?? (props.areaOpacity || 0.3)
            } : undefined,
            symbol: (seriesSpecificConfig.showPoints ?? props.showPoints) !== false ? 
              (seriesSpecificConfig.pointShape ?? props.pointShape ?? 'circle') : 'none',
            symbolSize: seriesSpecificConfig.pointSize ?? props.pointSize ?? 4,
            yAxisIndex: seriesSpecificConfig.yAxisIndex ?? 0, // Default to first y-axis
          };
        });
        // Extract unique X values while preserving original data order
        const seen = new Set();
        xAxisData = [];
        for (const item of props.data) {
          const value = item[props.xField as string];
          if (value != null && !seen.has(value)) {
            seen.add(value);
            xAxisData.push(value);
          }
        }
      } else {
        // Single series
        if (Array.isArray(props.yField)) {
          // Multiple y fields = multiple series
          series = props.yField.map(field => {
            const seriesSpecificConfig = props.seriesConfig?.[field] || {};
            return {
              name: field,
              type: 'line',
              data: props.data!.map((item: any) => item[field]),
              smooth: seriesSpecificConfig.smooth ?? props.smooth,
              lineStyle: { 
                width: seriesSpecificConfig.strokeWidth ?? props.strokeWidth,
                type: mapStrokeStyleToECharts(seriesSpecificConfig.strokeStyle ?? props.strokeStyle)
              },
              itemStyle: seriesSpecificConfig.color ? { color: seriesSpecificConfig.color } : undefined,
              areaStyle: (seriesSpecificConfig.showArea ?? props.showArea) ? { 
                opacity: seriesSpecificConfig.areaOpacity ?? (props.areaOpacity || 0.3)
              } : undefined,
              symbol: (seriesSpecificConfig.showPoints ?? props.showPoints) !== false ? 
                (seriesSpecificConfig.pointShape ?? props.pointShape ?? 'circle') : 'none',
              symbolSize: seriesSpecificConfig.pointSize ?? props.pointSize ?? 4,
              yAxisIndex: seriesSpecificConfig.yAxisIndex ?? 0, // Default to first y-axis
            };
          });
        } else {
          series = [{
            type: 'line',
            data: props.data.map((item: any) => item[props.yField as string]),
            smooth: props.smooth,
            lineStyle: { 
              width: props.strokeWidth,
              type: mapStrokeStyleToECharts(props.strokeStyle)
            },
            areaStyle: props.showArea ? { opacity: props.areaOpacity || 0.3 } : undefined,
            symbol: props.showPoints !== false ? (props.pointShape || 'circle') : 'none',
            symbolSize: props.pointSize || 4,
          }];
        }
        if (props.data) {
          xAxisData = props.data.map((item: any) => item[props.xField as string]);
        }
      }
    } else {
      // Array data format [[x, y], [x, y], ...]
      series = [{
        type: 'line',
        data: props.data,
        smooth: props.smooth,
        lineStyle: { 
          width: props.strokeWidth,
          type: mapStrokeStyleToECharts(props.strokeStyle)
        },
        areaStyle: props.showArea ? { opacity: props.areaOpacity || 0.3 } : undefined,
        symbol: props.showPoints !== false ? (props.pointShape || 'circle') : 'none',
        symbolSize: props.pointSize || 4,
      }];
    }
  }
  
  return {
    ...baseOption,
    grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, !!props.zoom),
    xAxis: {
      ...buildAxisOption(props.xAxis, 'categorical', props.theme),
      data: xAxisData,
    },
    yAxis: Array.isArray(props.yAxis) 
      ? props.yAxis.map(axis => buildAxisOption(axis, 'numeric', props.theme))
      : buildAxisOption(props.yAxis as AxisConfig | undefined, 'numeric', props.theme),
    series,
    legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, !!props.zoom, props.theme),
    tooltip: buildTooltipOption(props.tooltip, props.theme),
    ...(props.zoom && { dataZoom: [{ type: 'inside' }, { type: 'slider' }] }),
    ...(props.brush && { brush: {} }),
    ...props.customOption,
  };
}