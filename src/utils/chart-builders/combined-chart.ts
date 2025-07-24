import type { CombinedChartProps, DataPoint, AxisConfig } from '@/types';
import {
  buildBaseOption,
  buildAxisOption,
  buildLegendOption,
  buildTooltipOption,
  calculateGridSpacing,
  COLOR_PALETTES,
  isObjectData,
  mapStrokeStyleToECharts,
} from '../chart-builders';
import { analyzeDataRange, enhanceAxisForNegativeValues } from '../negative-value-handling';

export interface BuildCombinedChartOptionParams {
  readonly data: readonly DataPoint[];
  readonly xField: string;
  readonly series: CombinedChartProps['series'];
  readonly theme?: string | undefined;
  readonly colorPalette?: readonly string[] | undefined;
  readonly backgroundColor?: string | undefined;
  readonly title?: string | undefined;
  readonly subtitle?: string | undefined;
  readonly titlePosition?: 'left' | 'center' | 'right' | undefined;
  readonly xAxis?: AxisConfig | undefined;
  readonly yAxis?: readonly AxisConfig[] | undefined;
  readonly legend?: any | undefined;
  readonly tooltip?: any | undefined;
  readonly zoom?: boolean | undefined;
  readonly pan?: boolean | undefined;
  readonly brush?: boolean | undefined;
  readonly animate?: boolean | undefined;
  readonly animationDuration?: number | undefined;
  readonly customOption?: any | undefined;
}

export function buildCombinedChartOption(params: BuildCombinedChartOptionParams): any {
  const {
    data,
    xField,
    series,
    theme = 'light',
    colorPalette,
    backgroundColor,
    title,
    subtitle,
    titlePosition = 'center',
    xAxis,
    yAxis = [{ type: 'value' }],
    legend,
    tooltip,
    zoom = false,
    brush = false,
    animate = true,
    animationDuration,
    customOption,
  } = params;

  // Extract x-axis values from data
  const xAxisData = isObjectData(data) 
    ? data.map(item => (item as any)[xField])
    : [];

  // Get colors from palette
  const colors = colorPalette || COLOR_PALETTES[theme as keyof typeof COLOR_PALETTES] || COLOR_PALETTES.default;

  // Build base option
  const baseOption = buildBaseOption({
    title,
    subtitle,
    titlePosition,
    backgroundColor,
    animate,
    animationDuration,
  });

  // Build series data for each series configuration
  const echartsSeriesData = series.map((seriesConfig, index) => {
    const { field, type, name, color, yAxisIndex = 0, ...seriesOptions } = seriesConfig;
    
    // Extract data for this series
    const seriesData = isObjectData(data)
      ? data.map(item => (item as any)[field])
      : [];

    const baseSeriesConfig: any = {
      name,
      type,
      data: seriesData,
      color: color || colors[index % colors.length],
      yAxisIndex,
    };

    // Add type-specific configurations
    if (type === 'line') {
      Object.assign(baseSeriesConfig, {
        smooth: seriesOptions.smooth || false,
        lineStyle: {
          width: seriesOptions.strokeWidth || 2,
          type: mapStrokeStyleToECharts(seriesOptions.strokeStyle || 'solid'),
        },
        symbol: seriesOptions.showPoints ? 'circle' : 'none',
        symbolSize: seriesOptions.pointSize || 4,
        areaStyle: seriesOptions.showArea ? {
          opacity: seriesOptions.areaOpacity || 0.3,
        } : undefined,
      });
    } else if (type === 'bar') {
      Object.assign(baseSeriesConfig, {
        barWidth: seriesOptions.barWidth,
        stack: seriesOptions.stack,
        label: seriesOptions.showLabels ? {
          show: true,
          position: 'top',
        } : undefined,
      });
    }

    return baseSeriesConfig;
  });

  // Build X axis
  const builtXAxis = buildAxisOption({
    type: 'category',
    boundaryGap: true, // Ensures bars stay within chart boundaries
    ...xAxis,
  });
  
  // Add data for category axis
  if (builtXAxis.type === 'category') {
    (builtXAxis as any).data = xAxisData;
  }

  // Analyze data ranges for automatic axis scaling with negative value support
  const seriesFields = series.map(s => s.field);
  const dataRanges = analyzeDataRange(data, seriesFields);
  
  // Build Y axes (support for dual axes) with automatic range detection
  const builtYAxis = yAxis.map((axisConfig, index) => {
    // Find which series use this axis index
    const seriesUsingThisAxis = series.filter(s => (s.yAxisIndex || 0) === index);
    const fieldsForThisAxis = seriesUsingThisAxis.map(s => s.field);
    
    // Calculate combined range for all fields using this axis
    let axisMin: number | undefined;
    let axisMax: number | undefined;
    let hasNegativeValues = false;
    
    fieldsForThisAxis.forEach(field => {
      const range = dataRanges[field];
      if (range) {
        axisMin = axisMin === undefined ? range.min : Math.min(axisMin, range.min);
        axisMax = axisMax === undefined ? range.max : Math.max(axisMax, range.max);
        if (range.hasNegative) hasNegativeValues = true;
      }
    });
    
    // Build axis configuration with proper negative value support
    let axisOptions: any = {
      type: 'value' as any,
      ...axisConfig,
    };
    
    // Only override min/max if not explicitly set and we have calculated ranges
    if (axisMin !== undefined && axisMax !== undefined) {
      if (axisConfig.min === undefined) axisOptions.min = axisMin;
      if (axisConfig.max === undefined) axisOptions.max = axisMax;
    }
    
    // For dual axis charts, only show grid lines on the primary (left) axis
    // This prevents overlapping grid lines that create irregular patterns
    if (yAxis.length > 1 && index > 0) {
      axisOptions.splitLine = { show: false };
    }
    
    // Enhance axis for negative value support
    axisOptions = enhanceAxisForNegativeValues(axisOptions, hasNegativeValues);
    
    return buildAxisOption(axisOptions);
  });

  // Build legend
  const builtLegend = legend !== false ? buildLegendOption({
    show: true,
    data: series.map(s => s.name),
    ...legend,
  }) : undefined;

  // Build tooltip
  const builtTooltip = buildTooltipOption({
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    },
    ...tooltip,
  });

  // Build zoom and interaction features
  const dataZoom = zoom ? [
    {
      type: 'slider',
      xAxisIndex: 0,
      show: true,
    },
    {
      type: 'inside',
      xAxisIndex: 0,
    }
  ] : undefined;

  const brushConfig = brush ? {
    toolbox: {
      feature: {
        brush: {
          type: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear']
        }
      }
    },
    brush: {
      xAxisIndex: 0,
    }
  } : undefined;

  // Combine all options
  const option: any = {
    ...baseOption,
    color: colors as any,
    xAxis: builtXAxis,
    yAxis: builtYAxis,
    series: echartsSeriesData,
    legend: builtLegend,
    tooltip: builtTooltip,
    dataZoom,
    ...brushConfig,
    grid: {
      ...calculateGridSpacing(legend, !!title, !!subtitle, zoom),
      // Override right spacing for dual axes
      right: yAxis.length > 1 ? '8%' : calculateGridSpacing(legend, !!title, !!subtitle, zoom).right,
      containLabel: true,
    },
  };

  // Apply custom option overrides
  if (customOption) {
    // Deep merge custom options
    return { ...option, ...customOption };
  }

  return option;
}