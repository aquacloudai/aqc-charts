import type { EChartsOption } from 'echarts/types/dist/shared';
import type { AreaChartProps } from '@/types';
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

export function buildStackedAreaChartOption(props: AreaChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  // Handle different data formats
  let series: any[] = [];
  let xAxisData: any[] = [];
  
  if (props.series && props.data) {
    // Multiple series provided explicitly
    series = props.series.map((s, index) => ({
      name: s.name,
      type: 'line',
      data: isObjectData(s.data) && props.yField 
        ? s.data.map(item => item[props.yField as string])
        : s.data,
      smooth: s.smooth ?? props.smooth,
      lineStyle: { 
        width: s.strokeWidth ?? props.strokeWidth ?? 2,
        type: mapStrokeStyleToECharts(s.strokeStyle ?? props.strokeStyle)
      },
      itemStyle: { color: s.color },
      areaStyle: { 
        opacity: props.opacity ?? 0.7,
        ...(props.areaGradient && {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: s.color || `rgba(${index * 50 % 255}, ${(index * 80) % 255}, ${(index * 120) % 255}, 0.8)`
            }, {
              offset: 1,
              color: s.color || `rgba(${index * 50 % 255}, ${(index * 80) % 255}, ${(index * 120) % 255}, 0.1)`
            }]
          }
        })
      },
      emphasis: {
        focus: 'series',
        areaStyle: {
          opacity: Math.min((props.opacity ?? 0.7) + 0.2, 1),
        }
      },
      triggerLineEvent: true,
      symbol: (s.showPoints ?? props.showPoints) !== false ? (s.pointShape ?? props.pointShape ?? 'circle') : 'none',
      symbolSize: s.pointSize ?? props.pointSize ?? 4,
      yAxisIndex: s.yAxisIndex ?? 0,
      stack: props.stacked ? 'Total' : undefined,
      ...(props.stackType === 'percent' && { stack: 'Total', areaStyle: { ...series[index]?.areaStyle, opacity: 0.7 } })
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
              width: seriesSpecificConfig.strokeWidth ?? props.strokeWidth ?? 2,
              type: mapStrokeStyleToECharts(seriesSpecificConfig.strokeStyle ?? props.strokeStyle)
            },
            itemStyle: seriesSpecificConfig.color ? { color: seriesSpecificConfig.color } : undefined,
            areaStyle: { 
              opacity: props.opacity ?? 0.7,
              ...(props.areaGradient && seriesSpecificConfig.color && {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: seriesSpecificConfig.color + 'CC'
                  }, {
                    offset: 1,
                    color: seriesSpecificConfig.color + '1A'
                  }]
                }
              })
            },
            symbol: (seriesSpecificConfig.showPoints ?? props.showPoints) !== false ? 
              (seriesSpecificConfig.pointShape ?? props.pointShape ?? 'circle') : 'none',
            symbolSize: seriesSpecificConfig.pointSize ?? props.pointSize ?? 4,
            yAxisIndex: seriesSpecificConfig.yAxisIndex ?? 0,
            stack: props.stacked ? 'Total' : undefined,
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
          series = props.yField.map((field) => {
            const seriesSpecificConfig = props.seriesConfig?.[field] || {};
            return {
              name: field,
              type: 'line',
              data: props.data!.map((item: any) => item[field]),
              smooth: seriesSpecificConfig.smooth ?? props.smooth,
              lineStyle: { 
                width: seriesSpecificConfig.strokeWidth ?? props.strokeWidth ?? 2,
                type: mapStrokeStyleToECharts(seriesSpecificConfig.strokeStyle ?? props.strokeStyle)
              },
              itemStyle: seriesSpecificConfig.color ? { color: seriesSpecificConfig.color } : undefined,
              areaStyle: { 
                opacity: props.opacity ?? 0.7,
                ...(props.areaGradient && seriesSpecificConfig.color && {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0,
                      color: seriesSpecificConfig.color + 'CC'
                    }, {
                      offset: 1,
                      color: seriesSpecificConfig.color + '1A'
                    }]
                  }
                })
              },
              emphasis: {
                focus: 'series',
                areaStyle: {
                  opacity: Math.min((props.opacity ?? 0.7) + 0.2, 1),
                }
              },
              triggerLineEvent: true,
              symbol: (seriesSpecificConfig.showPoints ?? props.showPoints) !== false ? 
                (seriesSpecificConfig.pointShape ?? props.pointShape ?? 'circle') : 'none',
              symbolSize: seriesSpecificConfig.pointSize ?? props.pointSize ?? 4,
              yAxisIndex: seriesSpecificConfig.yAxisIndex ?? 0,
              stack: props.stacked ? 'Total' : undefined,
            };
          });
        } else {
          series = [{
            type: 'line',
            data: props.data.map((item: any) => item[props.yField as string]),
            smooth: props.smooth,
            lineStyle: { 
              width: props.strokeWidth ?? 2,
              type: mapStrokeStyleToECharts(props.strokeStyle)
            },
            areaStyle: { 
              opacity: props.opacity ?? 0.7,
              ...(props.areaGradient && {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(64, 158, 255, 0.8)'
                  }, {
                    offset: 1,
                    color: 'rgba(64, 158, 255, 0.1)'
                  }]
                }
              })
            },
            emphasis: {
              focus: 'series',
              areaStyle: {
                opacity: Math.min((props.opacity ?? 0.7) + 0.2, 1),
              }
            },
            triggerLineEvent: true,
            symbol: props.showPoints !== false ? (props.pointShape || 'circle') : 'none',
            symbolSize: props.pointSize || 4,
            stack: props.stacked ? 'Total' : undefined,
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
          width: props.strokeWidth ?? 2,
          type: mapStrokeStyleToECharts(props.strokeStyle)
        },
        areaStyle: { 
          opacity: props.opacity ?? 0.7,
          ...(props.areaGradient && {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(64, 158, 255, 0.8)'
              }, {
                offset: 1,
                color: 'rgba(64, 158, 255, 0.1)'
              }]
            }
          })
        },
        emphasis: {
          focus: 'series',
          areaStyle: {
            opacity: Math.min((props.opacity ?? 0.7) + 0.2, 1),
          }
        },
        triggerLineEvent: true,
        symbol: props.showPoints !== false ? (props.pointShape || 'circle') : 'none',
        symbolSize: props.pointSize || 4,
        stack: props.stacked ? 'Total' : undefined,
      }];
    }
  }

  // Handle percentage stacking
  if (props.stackType === 'percent') {
    series = series.map(s => ({
      ...s,
      stack: 'Total',
      areaStyle: { ...s.areaStyle, opacity: 0.7 },
    }));
  }
  
  return {
    ...baseOption,
    grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, !!props.zoom),
    xAxis: {
      ...buildAxisOption(props.xAxis, 'categorical', props.theme),
      data: xAxisData,
    },
    yAxis: Array.isArray(props.yAxis) 
      ? props.yAxis.map(axis => ({
          ...buildAxisOption(axis, 'numeric', props.theme),
          ...(props.stackType === 'percent' && { 
            axisLabel: { 
              ...buildAxisOption(axis, 'numeric', props.theme).axisLabel,
              formatter: '{value}%' 
            },
            max: 100 
          })
        }))
      : {
          ...buildAxisOption(props.yAxis as AxisConfig | undefined, 'numeric', props.theme),
          ...(props.stackType === 'percent' && { 
            axisLabel: { 
              ...buildAxisOption(props.yAxis as AxisConfig | undefined, 'numeric', props.theme).axisLabel,
              formatter: '{value}%' 
            },
            max: 100 
          })
        },
    series,
    legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, !!props.zoom, props.theme),
    tooltip: {
      ...buildTooltipOption(props.tooltip, props.theme),
      ...(props.stackType === 'percent' && {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: function(params: any) {
          if (!Array.isArray(params)) return '';
          
          let total = 0;
          params.forEach((param: any) => {
            total += param.value;
          });
          
          let result = params[0].name + '<br/>';
          params.forEach((param: any) => {
            const percentage = total > 0 ? ((param.value / total) * 100).toFixed(1) : '0.0';
            result += `${param.marker}${param.seriesName}: ${param.value} (${percentage}%)<br/>`;
          });
          return result;
        }
      })
    },
    ...(props.zoom && { dataZoom: [{ type: 'inside' }, { type: 'slider' }] }),
    ...(props.brush && { brush: {} }),
    ...props.customOption,
  };
}