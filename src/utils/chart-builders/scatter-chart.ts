import type { EChartsOption } from 'echarts/types/dist/shared';
import type { ScatterChartProps, JitterConfig } from '@/types';

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

/**
 * Build jitter configuration for ECharts 6 scatter series
 * Jittering adds random offsets to prevent point overlap while maintaining axis accuracy
 */
function buildJitterConfig(jitter: boolean | JitterConfig | undefined): Record<string, unknown> | undefined {
  if (!jitter) return undefined;

  if (jitter === true) {
    // Auto jitter with default values
    return { jitter: 0.4 }; // Default jitter amount
  }

  // Custom jitter configuration
  const config: Record<string, unknown> = {};
  if (jitter.width !== undefined) {
    config.jitter = jitter.width;
  }
  if (jitter.height !== undefined) {
    config.jitterHeight = jitter.height;
  }
  return Object.keys(config).length > 0 ? config : { jitter: 0.4 };
}

export function buildScatterChartOption(props: ScatterChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);

  // Get global jitter config
  const globalJitterConfig = buildJitterConfig(props.jitter);

  let series: any[] = [];

  if (props.series) {
    series = props.series.map((s: any) => {
      // Per-series jitter config overrides global
      const seriesJitterConfig = s.jitter !== undefined
        ? buildJitterConfig(s.jitter)
        : globalJitterConfig;

      return {
        name: s.name,
        type: 'scatter',
        data: s.data,
        itemStyle: { color: s.color, opacity: props.pointOpacity || 0.8 },
        symbolSize: s.pointSize || props.pointSize || 10,
        symbol: s.pointShape || props.pointShape || 'circle',
        // ECharts 6: Jitter configuration
        ...seriesJitterConfig,
        ...(s.jitterOverlap !== undefined ? { jitterOverlap: s.jitterOverlap } : props.jitterOverlap !== undefined ? { jitterOverlap: props.jitterOverlap } : {}),
      };
    });
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
            // ECharts 6: Jitter configuration
            ...globalJitterConfig,
            ...(props.jitterOverlap !== undefined && { jitterOverlap: props.jitterOverlap }),
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
          // ECharts 6: Jitter configuration
          ...globalJitterConfig,
          ...(props.jitterOverlap !== undefined && { jitterOverlap: props.jitterOverlap }),
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
        // ECharts 6: Jitter configuration
        ...globalJitterConfig,
        ...(props.jitterOverlap !== undefined && { jitterOverlap: props.jitterOverlap }),
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