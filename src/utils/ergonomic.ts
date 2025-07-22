import type { EChartsOption } from 'echarts/types/dist/shared';
import type {
  DataPoint,
  AxisConfig,
  LegendConfig,
  TooltipConfig,
  LineChartProps,
  BarChartProps,
  PieChartProps,
  ScatterChartProps,
  ClusterChartProps,
  CalendarHeatmapProps,
  SankeyChartProps,
  SankeyNode,
  SankeyLink,
  GanttChartProps,
  GanttTask,
  GanttCategory,
  TaskBarStyle,
  CategoryLabelStyle,
  TimelineStyle,
  StatusStyleMap,
  PriorityStyleMap,
  GanttDataZoomConfig,
  RegressionChartProps,
} from '@/types';

// Default color palettes
export const COLOR_PALETTES = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
  vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'],
  pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFD9BA', '#E6E6FA', '#D3FFD3', '#FFCCFF', '#FFEFD5'],
  business: ['#2E4057', '#048A81', '#54C6EB', '#F8B500', '#B83A4B', '#5C7A89', '#A8E6CF', '#FFB6B3', '#C7CEEA'],
  earth: ['#8B4513', '#228B22', '#4682B4', '#DAA520', '#CD853F', '#32CD32', '#6495ED', '#FF8C00', '#9ACD32'],
} as const;

// Utility functions for data processing
export function isObjectData(data: readonly any[]): data is readonly DataPoint[] {
  return data.length > 0 && typeof data[0] === 'object' && !Array.isArray(data[0]);
}

export function extractUniqueValues(data: readonly DataPoint[], field: string): (string | number | Date)[] {
  return [...new Set(data.map(item => item[field]).filter(val => val != null))];
}

export function groupDataByField(data: readonly DataPoint[], field: string): Record<string, DataPoint[]> {
  return data.reduce((groups, item) => {
    const key = String(item[field] ?? 'Unknown');
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {} as Record<string, DataPoint[]>);
}

export function detectDataType(values: (string | number | Date | null | undefined)[]): 'numeric' | 'categorical' | 'time' {
  const nonNullValues = values.filter(v => v != null);
  if (nonNullValues.length === 0) return 'categorical';
  
  // Check if all values are numbers
  if (nonNullValues.every(v => typeof v === 'number' || !isNaN(Number(v)))) {
    return 'numeric';
  }
  
  // Check if values look like dates
  if (nonNullValues.some(v => v instanceof Date || (typeof v === 'string' && !isNaN(Date.parse(v))))) {
    return 'time';
  }
  
  return 'categorical';
}

// Base option builders
export function buildBaseOption(props: any): Partial<EChartsOption> {
  const option: Partial<EChartsOption> = {};
  const isDark = props.theme === 'dark';
  
  
  // Title with theme-aware colors
  if (props.title) {
    option.title = {
      text: props.title,
      subtext: props.subtitle,
      left: props.titlePosition || 'center',
      textStyle: {
        color: isDark ? '#ffffff' : '#333333',
      },
      subtextStyle: {
        color: isDark ? '#cccccc' : '#666666',
      },
    };
  }
  
  // Animation
  option.animation = props.animate !== false;
  if (props.animationDuration) {
    option.animationDuration = props.animationDuration;
  }
  
  // Theme-aware background
  if (props.backgroundColor) {
    option.backgroundColor = props.backgroundColor;
  } else {
    option.backgroundColor = isDark ? '#1a1a1a' : '#ffffff';
  }
  
  // Color palette
  if (props.colorPalette) {
    option.color = [...props.colorPalette];
  } else {
    option.color = [...COLOR_PALETTES.default];
  }
  
  // Theme-aware text styles for all components
  option.textStyle = {
    color: isDark ? '#ffffff' : '#333333',
  };
  
  // Ensure we have proper defaults for theme-aware styling
  if (!option.backgroundColor) {
    option.backgroundColor = isDark ? '#1a1a1a' : '#ffffff';
  }
  
  return option;
}

export function buildAxisOption(config?: AxisConfig, dataType: 'numeric' | 'categorical' | 'time' = 'categorical', theme?: string): any {
  const isDark = theme === 'dark';
  
  if (!config) {
    return {
      type: dataType === 'numeric' ? 'value' : dataType === 'time' ? 'time' : 'category',
      // Default boundaryGap for line charts: false for category axes (starts at axis)
      ...(dataType === 'categorical' && { boundaryGap: false }),
      axisLine: {
        lineStyle: { color: isDark ? '#666666' : '#cccccc' }
      },
      axisTick: {
        lineStyle: { color: isDark ? '#666666' : '#cccccc' }
      },
      axisLabel: {
        color: isDark ? '#cccccc' : '#666666'
      },
      splitLine: {
        lineStyle: { color: isDark ? '#333333' : '#f0f0f0' }
      },
    };
  }
  
  const axisType = config.type === 'linear' ? 'value' : 
    config.type === 'log' ? 'log' :
    config.type || (dataType === 'numeric' ? 'value' : dataType === 'time' ? 'time' : 'category');
  
  return {
    type: axisType,
    name: config.label,
    min: config.min,
    max: config.max,
    splitLine: config.grid ? { 
      show: true, 
      lineStyle: { 
        color: config.gridColor || (isDark ? '#333333' : '#f0f0f0')
      } 
    } : {
      lineStyle: { color: isDark ? '#333333' : '#f0f0f0' }
    },
    interval: config.tickInterval,
    axisLine: {
      lineStyle: { color: isDark ? '#666666' : '#cccccc' }
    },
    axisTick: {
      lineStyle: { color: isDark ? '#666666' : '#cccccc' }
    },
    axisLabel: {
      rotate: config.rotate,
      formatter: config.format 
        ? (typeof config.format === 'function' 
          ? config.format 
          : (value: number) => {
              // Handle simple format strings like '${value:,.0f}'
              if (config.format === '${value:,.0f}') {
                return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
              }
              if (config.format === '{value}%') {
                return value + '%';
              }
              if (config.format === '${value}') {
                return '$' + value;
              }
              // Default fallback
              return value.toString();
            })
        : undefined,
      color: isDark ? '#cccccc' : '#666666',
    },
    nameTextStyle: {
      color: isDark ? '#cccccc' : '#666666',
    },
    // Only apply boundaryGap for category and time axes
    ...(axisType === 'category' || axisType === 'time') && {
      boundaryGap: config.boundaryGap !== undefined ? config.boundaryGap : false
    },
  };
}

export function buildLegendOption(config?: LegendConfig, hasTitle?: boolean, hasSubtitle?: boolean, hasDataZoom?: boolean, theme?: string): any {
  if (!config || config.show === false) {
    return { show: false };
  }
  
  const position = config.position || 'top';
  const orientation = config.orientation || (position === 'left' || position === 'right' ? 'vertical' : 'horizontal');
  const align = config.align || 'center';
  
  // Calculate smart positioning based on content
  let positioning: any = {};
  
  switch (position) {
    case 'top':
      // Account for title/subtitle space
      if (hasTitle && hasSubtitle) {
        positioning = { top: '12%' }; // More space for title + subtitle
      } else if (hasTitle) {
        positioning = { top: '8%' }; // Space for title only
      } else {
        positioning = { top: '5%' }; // Default top spacing
      }
      // Center alignment for top position
      if (align === 'center') {
        positioning = { ...positioning, left: 'center' };
      } else if (align === 'start') {
        positioning = { ...positioning, left: '5%' };
      } else if (align === 'end') {
        positioning = { ...positioning, right: '5%' };
      }
      break;
      
    case 'bottom':
      // Account for data zoom controls and ensure proper spacing
      if (hasDataZoom) {
        positioning = { bottom: '15%' }; // More space for zoom controls
      } else {
        positioning = { bottom: '8%' }; // Standard bottom spacing
      }
      // Center alignment for bottom position
      if (align === 'center') {
        positioning = { ...positioning, left: 'center' };
      } else if (align === 'start') {
        positioning = { ...positioning, left: '5%' };
      } else if (align === 'end') {
        positioning = { ...positioning, right: '5%' };
      }
      break;
      
    case 'left':
      positioning = { 
        left: '5%',
        top: hasTitle ? (hasSubtitle ? '15%' : '12%') : 'center'
      };
      break;
      
    case 'right':
      positioning = { 
        right: '5%',
        top: hasTitle ? (hasSubtitle ? '15%' : '12%') : 'center'
      };
      break;
  }
  
  const isDark = theme === 'dark';
  
  return {
    show: true,
    type: 'scroll',
    orient: orientation,
    ...positioning,
    itemGap: 10, // Better spacing between legend items
    textStyle: {
      fontSize: 12,
      padding: [2, 0, 0, 2], // Better text padding
      color: isDark ? '#cccccc' : '#666666'
    }
  };
}

export function calculateGridSpacing(legendConfig?: LegendConfig, hasTitle?: boolean, hasSubtitle?: boolean, hasDataZoom?: boolean): any {
  const defaultGrid = {
    left: '3%',
    right: '4%',
    top: '10%',
    bottom: '3%',
    containLabel: true
  };

  if (!legendConfig || legendConfig.show === false) {
    // Adjust for title/subtitle and zoom only
    let topSpacing = '10%';
    if (hasTitle && hasSubtitle) {
      topSpacing = '15%';
    } else if (hasTitle) {
      topSpacing = '12%';
    }
    
    return {
      ...defaultGrid,
      top: topSpacing,
      bottom: hasDataZoom ? '12%' : '3%'
    };
  }

  const position = legendConfig.position || 'top';
  let gridAdjustments = { ...defaultGrid };

  switch (position) {
    case 'top':
      // Reserve space for legend at top
      if (hasTitle && hasSubtitle) {
        gridAdjustments.top = '20%'; // Title + subtitle + legend
      } else if (hasTitle) {
        gridAdjustments.top = '18%'; // Title + legend
      } else {
        gridAdjustments.top = '15%'; // Legend only
      }
      gridAdjustments.bottom = hasDataZoom ? '12%' : '3%';
      break;
      
    case 'bottom':
      // Reserve space for legend at bottom
      let topSpacing = '10%';
      if (hasTitle && hasSubtitle) {
        topSpacing = '15%';
      } else if (hasTitle) {
        topSpacing = '12%';
      }
      gridAdjustments.top = topSpacing;
      
      if (hasDataZoom) {
        gridAdjustments.bottom = '25%'; // Legend + zoom controls
      } else {
        gridAdjustments.bottom = '15%'; // Legend only
      }
      break;
      
    case 'left':
      gridAdjustments.left = '15%'; // More space for left legend
      gridAdjustments.top = hasTitle ? (hasSubtitle ? '15%' : '12%') : '10%';
      gridAdjustments.bottom = hasDataZoom ? '12%' : '3%';
      break;
      
    case 'right':
      gridAdjustments.right = '15%'; // More space for right legend
      gridAdjustments.top = hasTitle ? (hasSubtitle ? '15%' : '12%') : '10%';
      gridAdjustments.bottom = hasDataZoom ? '12%' : '3%';
      break;
  }

  return gridAdjustments;
}

// Generate stable component key for theme changes
export function generateChartKey(theme?: string, colorPalette?: readonly string[]): string {
  const themeKey = theme || 'default';
  const paletteKey = colorPalette ? colorPalette.slice(0, 3).join('') : 'default';
  return `chart-${themeKey}-${paletteKey}`;
}

export function buildTooltipOption(config?: TooltipConfig, theme?: string): any {
  if (!config || config.show === false) {
    return { show: false };
  }
  
  const isDark = theme === 'dark';
  
  return {
    show: true,
    trigger: config.trigger || 'item',
    formatter: config.format,
    backgroundColor: config.backgroundColor || (isDark ? '#333333' : 'rgba(255, 255, 255, 0.95)'),
    borderColor: config.borderColor || (isDark ? '#555555' : '#dddddd'),
    textStyle: config.textColor ? { color: config.textColor } : { color: isDark ? '#ffffff' : '#333333' },
  };
}

// Chart-specific option builders
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
      lineStyle: { width: props.strokeWidth },
      itemStyle: { color: s.color },
      areaStyle: (s.showArea ?? props.showArea) ? { opacity: props.areaOpacity || 0.3 } : undefined,
      symbol: props.showPoints !== false ? (props.pointShape || 'circle') : 'none',
      symbolSize: props.pointSize || 4,
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
        series = Object.entries(groups).map(([name, groupData]) => ({
          name,
          type: 'line',
          data: groupData.map(item => item[props.yField as string]),
          smooth: props.smooth,
          lineStyle: { width: props.strokeWidth },
          areaStyle: props.showArea ? { opacity: props.areaOpacity || 0.3 } : undefined,
          symbol: props.showPoints !== false ? (props.pointShape || 'circle') : 'none',
          symbolSize: props.pointSize || 4,
        }));
        xAxisData = extractUniqueValues(props.data, props.xField as string) as any[];
      } else {
        // Single series
        if (Array.isArray(props.yField)) {
          // Multiple y fields = multiple series
          series = props.yField.map(field => ({
            name: field,
            type: 'line',
            data: props.data!.map((item: any) => item[field]),
            smooth: props.smooth,
            lineStyle: { width: props.strokeWidth },
            areaStyle: props.showArea ? { opacity: props.areaOpacity || 0.3 } : undefined,
            symbol: props.showPoints !== false ? (props.pointShape || 'circle') : 'none',
            symbolSize: props.pointSize || 4,
          }));
        } else {
          series = [{
            type: 'line',
            data: props.data.map((item: any) => item[props.yField as string]),
            smooth: props.smooth,
            lineStyle: { width: props.strokeWidth },
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
        lineStyle: { width: props.strokeWidth },
        areaStyle: props.showArea ? { opacity: props.areaOpacity || 0.3 } : undefined,
        symbol: props.showPoints !== false ? (props.pointShape || 'circle') : 'none',
        symbolSize: props.pointSize || 4,
      }];
    }
  }
  
  const xAxisType = (props.data && isObjectData(props.data) && props.xField)
    ? detectDataType(props.data.map((item: any) => item[props.xField as string]))
    : 'categorical';
  
  return {
    ...baseOption,
    grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, !!props.zoom),
    xAxis: {
      ...buildAxisOption(props.xAxis, xAxisType, props.theme),
      data: xAxisType === 'categorical' ? xAxisData : undefined,
    },
    yAxis: buildAxisOption(props.yAxis, 'numeric', props.theme),
    series,
    legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, !!props.zoom, props.theme),
    tooltip: buildTooltipOption(props.tooltip, props.theme),
    ...(props.zoom && { dataZoom: [{ type: 'inside' }, { type: 'slider' }] }),
    ...(props.brush && { brush: {} }),
    ...props.customOption,
  };
}

export function buildBarChartOption(props: BarChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  let series: any[] = [];
  let categoryData: any[] = [];
  
  if (props.series) {
    series = props.series.map((s) => ({
      name: s.name,
      type: 'bar',
      data: isObjectData(s.data) && props.valueField 
        ? s.data.map(item => item[props.valueField as string])
        : s.data,
      itemStyle: { 
        color: s.color,
        borderRadius: props.borderRadius 
      },
      stack: s.stack || (props.stack ? 'defaultStack' : undefined),
      barWidth: props.barWidth,
      barGap: props.barGap,
    }));
    
    if (props.series && props.series[0] && isObjectData(props.series[0].data) && props.categoryField) {
      categoryData = props.series[0].data.map(item => (item as any)[props.categoryField as string]);
    }
  } else if (props.data) {
    if (isObjectData(props.data)) {
      if (props.seriesField) {
        const groups = groupDataByField(props.data, props.seriesField);
        series = Object.entries(groups).map(([name, groupData]) => ({
          name,
          type: 'bar',
          data: groupData.map(item => item[props.valueField as string]),
          stack: props.stack ? 'defaultStack' : undefined,
          barWidth: props.barWidth,
          barGap: props.barGap,
          itemStyle: { borderRadius: props.borderRadius },
        }));
        categoryData = extractUniqueValues(props.data, props.categoryField as string);
      } else {
        if (Array.isArray(props.valueField)) {
          series = props.valueField.map(field => ({
            name: field,
            type: 'bar',
            data: props.data!.map((item: any) => item[field]),
            stack: props.stack ? 'defaultStack' : undefined,
            barWidth: props.barWidth,
            barGap: props.barGap,
            itemStyle: { borderRadius: props.borderRadius },
          }));
        } else {
          series = [{
            type: 'bar',
            data: props.data.map((item: any) => item[props.valueField as string]),
            stack: props.stack ? 'defaultStack' : undefined,
            barWidth: props.barWidth,
            barGap: props.barGap,
            itemStyle: { borderRadius: props.borderRadius },
          }];
        }
        if (props.data) {
          categoryData = props.data.map((item: any) => item[props.categoryField as string]);
        }
      }
    } else {
      series = [{
        type: 'bar',
        data: props.data,
        stack: props.stack ? 'defaultStack' : undefined,
        barWidth: props.barWidth,
        barGap: props.barGap,
        itemStyle: { borderRadius: props.borderRadius },
      }];
    }
  }
  
  // Handle percentage calculation for stacked bars
  if (props.showPercentage && props.stack && series.length > 1) {
    // Calculate totals for each category
    const totalsByCategory: number[] = [];
    const categoryCount = Math.max(...series.map(s => s.data.length));
    
    for (let i = 0; i < categoryCount; i++) {
      let sum = 0;
      for (const seriesItem of series) {
        sum += seriesItem.data[i] || 0;
      }
      totalsByCategory.push(sum);
    }
    
    // Convert values to percentages
    series = series.map(seriesItem => ({
      ...seriesItem,
      data: seriesItem.data.map((value: number, index: number) => {
        const total = totalsByCategory[index];
        return (total === undefined || total <= 0) ? 0 : value / total;
      }),
      // Add percentage labels
      label: {
        show: true,
        position: (props.orientation === 'horizontal' ? 'right' : 'top') as any,
        formatter: (params: any) => `${Math.round(params.value * 1000) / 10}%`
      }
    }));
  }
  
  // Handle sorting
  if (props.sortBy && props.sortBy !== 'none') {
    // Implement sorting logic here
  }
  
  const isHorizontal = props.orientation === 'horizontal';
  
  // Handle percentage stacking or showPercentage
  if ((props.stackType === 'percent' || props.showPercentage) && props.stack) {
    const yAxisOptions = isHorizontal 
      ? buildAxisOption(props.yAxis, 'categorical', props.theme)
      : buildAxisOption(props.yAxis, 'numeric', props.theme);
    
    // For showPercentage, we need custom tooltip formatting
    let tooltipConfig = props.tooltip;
    if (props.showPercentage && !props.tooltip?.format) {
      tooltipConfig = {
        ...props.tooltip,
        show: true,
        trigger: 'axis',
        format: (params: any) => {
          if (!Array.isArray(params)) return '';
          
          let result = `${params[0].name}<br/>`;
          for (const param of params) {
            const percentage = Math.round(param.value * 1000) / 10;
            result += `${param.marker}${param.seriesName}: ${percentage}%<br/>`;
          }
          return result;
        }
      };
    }
    
    if (!isHorizontal) {
      if (props.stackType === 'percent') {
        (yAxisOptions as any).max = 100;
        (yAxisOptions as any).axisLabel = {
          ...(yAxisOptions as any).axisLabel,
          formatter: '{value}%'
        };
      } else if (props.showPercentage) {
        (yAxisOptions as any).max = 1;
        (yAxisOptions as any).axisLabel = {
          ...(yAxisOptions as any).axisLabel,
          formatter: (value: number) => `${Math.round(value * 100)}%`
        };
      }
    }
    
    return {
      ...baseOption,
      grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, false),
      xAxis: isHorizontal 
        ? { 
            ...buildAxisOption(props.xAxis, 'numeric', props.theme), 
            ...(props.stackType === 'percent' ? { max: 100, axisLabel: { formatter: '{value}%' } } : {}),
            ...(props.showPercentage && props.stackType !== 'percent' ? { max: 1, axisLabel: { formatter: (value: number) => `${Math.round(value * 100)}%` } } : {})
          }
        : { ...buildAxisOption(props.xAxis, 'categorical', props.theme), data: categoryData, boundaryGap: true },
      yAxis: isHorizontal
        ? { ...yAxisOptions, data: categoryData, boundaryGap: true }
        : yAxisOptions,
      series: series.map(s => ({ ...s, stack: props.stackType === 'percent' ? 'percent' : 'defaultStack' })),
      legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
      tooltip: buildTooltipOption(tooltipConfig, props.theme),
      ...props.customOption,
    };
  }
  
  return {
    ...baseOption,
    grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, false),
    xAxis: isHorizontal 
      ? buildAxisOption(props.xAxis, 'numeric', props.theme)
      : { ...buildAxisOption(props.xAxis, 'categorical', props.theme), data: categoryData, boundaryGap: true },
    yAxis: isHorizontal
      ? { ...buildAxisOption(props.yAxis, 'categorical', props.theme), data: categoryData, boundaryGap: true }
      : buildAxisOption(props.yAxis, 'numeric', props.theme),
    series,
    legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme), // Bar charts don't typically use zoom
    tooltip: buildTooltipOption(props.tooltip, props.theme),
    ...props.customOption,
  };
}

export function buildPieChartOption(props: PieChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  let data: any[] = [];
  
  if (props.data && isObjectData(props.data)) {
    if (props.nameField && props.valueField) {
      data = props.data.map(item => ({
        name: (item as any)[props.nameField as string],
        value: (item as any)[props.valueField as string],
      }));
    } else {
      // Assume first property is name, second is value
      const firstItem = props.data[0];
      if (firstItem) {
        const keys = Object.keys(firstItem);
        data = props.data.map(item => ({
          name: (item as any)[keys[0]!],
          value: (item as any)[keys[1]!],
        }));
      }
    }
  } else if (props.data) {
    data = [...props.data];
  }
  
  const radius = Array.isArray(props.radius) ? props.radius : ['0%', (props.radius || 75) + '%'];
  
  return {
    ...baseOption,
    series: [{
      type: 'pie',
      data,
      radius,
      startAngle: props.startAngle || 90,
      ...(props.roseType ? { roseType: 'area' as const } : {}),
      label: {
        show: props.showLabels !== false,
        position: props.labelPosition || 'outside',
        formatter: props.labelFormat || (props.showPercentages ? '{b}: {d}%' : '{b}: {c}'),
      },
      selectedMode: props.selectedMode || false,
      ...(props.emphasis !== false ? { emphasis: { focus: 'self' } } : {}),
    }],
    legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
    tooltip: buildTooltipOption(props.tooltip, props.theme),
    ...props.customOption,
  };
}

export function buildScatterChartOption(props: any): EChartsOption {
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
              item[props.sizeField],
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
            item[props.sizeField],
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

export function buildClusterChartOption(props: any): EChartsOption {
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
  
  const outputClusterIndexDimension = 2;
  const gridLeft = visualMapPosition === 'left' ? 120 : 60;
  
  // Debug logging
  console.log('ClusterChart sourceData sample:', sourceData.slice(0, 3));
  console.log('ClusterChart config:', { clusterCount, outputClusterIndexDimension });
  
  // Create visual map pieces for cluster coloring
  const pieces = Array.from({ length: clusterCount }, (_, i) => ({
    value: i,
    label: `cluster ${i}`,
    color: clusterColors[i % clusterColors.length] || clusterColors[0] || DEFAULT_CLUSTER_COLORS[0],
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
    xAxis: {
      ...buildAxisOption(props.xAxis, 'numeric', props.theme),
      // Always override type to 'value' for clustering
      type: 'value',
      scale: true,
    },
    yAxis: {
      ...buildAxisOption(props.yAxis, 'numeric', props.theme),
      // Always override type to 'value' for clustering
      type: 'value',
      scale: true,
    },
    series: {
      type: 'scatter',
      encode: { 
        tooltip: [0, 1, 2],
        x: 0,
        y: 1
      },
      symbolSize: props.pointSize || 15,
      itemStyle: props.itemStyle || { borderColor: '#555' },
      datasetIndex: 1,
    },
    ...props.customOption,
  };
  
  return chartOption;
}

export function buildCalendarHeatmapOption(props: CalendarHeatmapProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  // Process data into calendar format
  let calendarData: [string, number][] = [];
  
  if (props.data && props.data.length > 0) {
    if (isObjectData(props.data)) {
      const dateField = props.dateField || 'date';
      const valueField = props.valueField || 'value';
      
      calendarData = props.data.map((item: any) => {
        const dateValue = item[dateField];
        const formattedDate = typeof dateValue === 'string' 
          ? dateValue 
          : dateValue 
          ? new Date(dateValue).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        return [formattedDate, Number(item[valueField]) || 0] as [string, number];
      });
    } else {
      // Assume data is already in [date, value] format or has date/value properties
      calendarData = (props.data as any[]).map((item: any) => {
        const dateValue = item.date || item[0];
        const valueValue = item.value || item[1];
        const formattedDate = typeof dateValue === 'string' 
          ? dateValue 
          : dateValue 
          ? new Date(dateValue).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        return [formattedDate, Number(valueValue) || 0] as [string, number];
      });
    }
  }
  
  // Determine year(s) for calendar
  let years: number[] = [];
  if (props.year) {
    years = Array.isArray(props.year) ? [...props.year] : [props.year];
  } else if (props.range) {
    const startYear = new Date(props.range[0]).getFullYear();
    const endYear = new Date(props.range[1]).getFullYear();
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }
  } else if (calendarData.length > 0) {
    // Auto-detect years from data
    const dataYears = new Set(calendarData.map(([date]) => new Date(date).getFullYear()));
    years = Array.from(dataYears).sort();
  } else {
    years = [new Date().getFullYear()];
  }
  
  // Default color scale
  const colorScale = props.colorScale || ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
  
  // Calculate cell size
  const defaultCellSize: [number, number] = props.orient === 'vertical' ? [15, 15] : [20, 20];
  const cellSize: [number, number] = Array.isArray(props.cellSize) 
    ? [props.cellSize[0] || 20, props.cellSize[1] || 20]
    : props.cellSize 
    ? [props.cellSize, props.cellSize] 
    : defaultCellSize;
  
  // Calculate values for visual map
  const values = calendarData.map(([, value]) => value);
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 1);
  
  // Calculate proper spacing using the standard approach
  const hasTitle = !!props.title;
  const isVertical = props.orient === 'vertical';
  
  // Create a mock legend config to determine visual map positioning
  const visualMapLegendConfig: LegendConfig = {
    show: true,
    position: isVertical ? 'right' : 'bottom',
    orientation: isVertical ? 'vertical' : 'horizontal',
  };
  
  // Use the standard spacing calculation but adapt for calendar
  const gridSpacing = calculateGridSpacing(visualMapLegendConfig, hasTitle, false, false);
  
  // Build calendar configurations - use any to bypass strict typing for now
  const calendars: any[] = years.map((year, index) => {
    const calendarConfig: any = {
      orient: props.orient || 'horizontal',
      range: props.range || year.toString(),
      cellSize,
      dayLabel: {
        show: props.showWeekLabel !== false,
        firstDay: props.startOfWeek === 'monday' ? 1 : 0,
      },
      monthLabel: {
        show: props.showMonthLabel !== false,
      },
      yearLabel: {
        show: props.showYearLabel !== false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: props.cellBorderColor || '#eee',
          width: props.cellBorderWidth || 1,
          type: 'solid' as const,
        },
      },
      itemStyle: {
        borderColor: props.cellBorderColor || '#eee',
        borderWidth: props.cellBorderWidth || 1,
      },
    };

    if (isVertical) {
      // For vertical layout, use standard grid spacing approach
      calendarConfig.left = gridSpacing.left;
      calendarConfig.top = gridSpacing.top;
      calendarConfig.bottom = gridSpacing.bottom;
      calendarConfig.right = gridSpacing.right;
    } else {
      // For horizontal layout
      if (years.length > 1) {
        const availableHeight = 100 - parseInt(gridSpacing.top) - parseInt(gridSpacing.bottom);
        calendarConfig.top = `${parseInt(gridSpacing.top) + index * (availableHeight / years.length)}%`;
        calendarConfig.height = `${Math.floor(availableHeight / years.length * 0.8)}%`;
        calendarConfig.left = gridSpacing.left;
        calendarConfig.right = gridSpacing.right;
      } else {
        calendarConfig.top = gridSpacing.top;
        calendarConfig.left = gridSpacing.left;
        calendarConfig.right = gridSpacing.right;
        calendarConfig.bottom = gridSpacing.bottom;
      }
    }

    return calendarConfig;
  });
  
  // Build series configurations - use any to bypass strict typing for now
  const series: any[] = years.map((year, index) => ({
    type: 'heatmap' as const,
    coordinateSystem: 'calendar' as const,
    calendarIndex: index,
    data: calendarData.filter(([date]) => new Date(date).getFullYear() === year),
    ...(props.showValues && {
      label: {
        show: true,
        formatter: props.valueFormat && typeof props.valueFormat === 'function'
          ? (params: any) => (props.valueFormat as Function)(params.value[1])
          : props.valueFormat && typeof props.valueFormat === 'string'
          ? (params: any) => {
              const value = params.value[1];
              if (props.valueFormat === '{value}') return value.toString();
              if (props.valueFormat === '{value:,.0f}') return value.toLocaleString();
              return value.toString();
            }
          : undefined,
      },
    }),
  }));
  
  const isDark = props.theme === 'dark';
  
  return {
    ...baseOption,
    calendar: calendars,
    series,
    visualMap: (() => {
      return {
        type: 'piecewise',
        orient: isVertical ? 'vertical' : 'horizontal',
        // Use the same positioning as the legend would use
        ...(isVertical ? {
          right: '5%',
          top: hasTitle ? (gridSpacing.top) : 'center',
          itemGap: 5,
        } : {
          left: 'center',
          bottom: years.length > 1 ? '3%' : '5%',
        }),
        min: minValue,
        max: maxValue,
        splitNumber: props.splitNumber || colorScale.length - 1,
        inRange: {
          color: colorScale,
        },
        textStyle: {
          color: isDark ? '#cccccc' : '#666666',
          fontSize: isVertical ? 11 : 12,
        },
        itemSymbol: 'rect',
        itemWidth: isVertical ? 15 : 20,
        itemHeight: isVertical ? 12 : 14,
      };
    })(),
    tooltip: props.tooltip ? buildTooltipOption(props.tooltip, props.theme) : {
      trigger: 'item',
      formatter: (params: any) => {
        const [date, value] = params.value;
        const formattedDate = new Date(date).toLocaleDateString();
        const formattedValue = props.valueFormat && typeof props.valueFormat === 'function'
          ? props.valueFormat(value)
          : value;
        return `${formattedDate}<br/>Value: ${formattedValue}`;
      },
      textStyle: {
        color: isDark ? '#ffffff' : '#333333',
      },
      backgroundColor: isDark ? '#333333' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? '#555555' : '#dddddd',
    },
    ...props.customOption,
  };
}

export function buildSankeyChartOption(props: SankeyChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  let nodes: SankeyNode[] = [];
  let links: SankeyLink[] = [];
  
  // Handle different data input formats
  if (props.nodes && props.links) {
    // Direct nodes and links provided
    nodes = [...props.nodes];
    links = [...props.links];
  } else if (props.data) {
    if (Array.isArray(props.data) && isObjectData(props.data)) {
      // Flat data format - need to extract nodes and links
      const flatData = props.data as DataPoint[];
      const sourceField = props.sourceField || 'source';
      const targetField = props.targetField || 'target';
      const valueField = props.valueField || 'value';
      
      // Extract unique nodes from source and target fields
      const nodeSet = new Set<string>();
      flatData.forEach(item => {
        const source = String(item[sourceField] || '');
        const target = String(item[targetField] || '');
        if (source) nodeSet.add(source);
        if (target) nodeSet.add(target);
      });
      
      // Convert to node objects
      nodes = Array.from(nodeSet).map(name => ({ name }));
      
      // Convert to link objects
      links = flatData.map(item => ({
        source: String(item[sourceField] || ''),
        target: String(item[targetField] || ''),
        value: Number(item[valueField]) || 0,
      }));
    } else {
      // Assume data is in { nodes, links } format
      const structuredData = props.data as { nodes: SankeyNode[]; links: SankeyLink[] };
      nodes = structuredData.nodes && Array.isArray(structuredData.nodes) ? [...structuredData.nodes] : [];
      links = structuredData.links && Array.isArray(structuredData.links) ? [...structuredData.links] : [];
    }
  }
  
  // Apply node styling and colors
  const processedNodes = nodes.map((node, index) => {
    const processedNode: any = { ...node };
    
    // Apply custom colors if provided
    if (props.nodeColors && props.nodeColors[index]) {
      processedNode.itemStyle = {
        ...processedNode.itemStyle,
        color: props.nodeColors[index],
      };
    }
    
    // Configure labels
    if (props.nodeLabels !== false) {
      processedNode.label = {
        show: true,
        position: props.nodeLabelPosition || (props.orient === 'vertical' ? 'bottom' : 'right'),
        formatter: props.showNodeValues 
          ? `{b}: {c}` 
          : `{b}`,
        ...processedNode.label,
      };
    } else {
      processedNode.label = { show: false };
    }
    
    return processedNode;
  });
  
  // Apply link styling
  const processedLinks = links.map((link, index) => {
    const processedLink: any = { ...link };
    
    // Apply link styling
    processedLink.lineStyle = {
      opacity: props.linkOpacity || 0.6,
      curveness: props.linkCurveness || 0.5,
      ...processedLink.lineStyle,
    };
    
    // Apply custom link colors if provided
    if (props.linkColors && props.linkColors[index]) {
      processedLink.lineStyle.color = props.linkColors[index];
    }
    
    // Show link labels if requested
    if (props.showLinkLabels) {
      processedLink.label = {
        show: true,
        formatter: '{c}',
        ...processedLink.label,
      };
    }
    
    return processedLink;
  });
  
  // Build series configuration
  const series: any = {
    type: 'sankey',
    layout: props.layout || 'none',
    orient: props.orient || 'horizontal', 
    nodeAlign: props.nodeAlign || 'justify',
    nodeGap: props.nodeGap || 8,
    nodeWidth: props.nodeWidth || 20,
    layoutIterations: props.iterations || 32,
    data: processedNodes,
    links: processedLinks,
    emphasis: {
      focus: props.focusMode || 'adjacency',
      ...(props.blurScope && { blurScope: props.blurScope }),
    },
    // Standard spacing
    left: '5%',
    top: props.title ? '15%' : '5%',
    right: '5%',
    bottom: '5%',
  };
  
  return {
    ...baseOption,
    series: [series],
    legend: props.legend ? buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme) : undefined,
    tooltip: props.tooltip ? buildTooltipOption(props.tooltip, props.theme) : {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: (params: any) => {
        if (params.dataType === 'edge') {
          return `${params.data.source} → ${params.data.target}<br/>Value: ${params.data.value}`;
        } else {
          return `${params.data.name}<br/>Value: ${params.data.value || 'N/A'}`;
        }
      },
    },
    ...props.customOption,
  };
}

export function buildGanttChartOption(props: GanttChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  const isDark = props.theme === 'dark';
  
  let tasks: GanttTask[] = [];
  let categories: GanttCategory[] = [];
  
  // Handle different data input formats
  if (props.tasks && props.categories) {
    // Direct tasks and categories provided
    tasks = [...props.tasks];
    categories = [...props.categories];
  } else if (props.data) {
    if (Array.isArray(props.data) && isObjectData(props.data)) {
      // Flat data format - need to extract tasks and categories
      const flatData = props.data as DataPoint[];
      const idField = props.idField || 'id';
      const nameField = props.nameField || 'name';
      const categoryField = props.categoryField || 'category';
      const startTimeField = props.startTimeField || 'startTime';
      const endTimeField = props.endTimeField || 'endTime';
      const colorField = props.colorField || 'color';
      const statusField = props.statusField || 'status';
      const priorityField = props.priorityField || 'priority';
      const progressField = props.progressField || 'progress';
      const assigneeField = props.assigneeField || 'assignee';
      
      // Extract unique categories
      const categorySet = new Set<string>();
      flatData.forEach(item => {
        const category = String(item[categoryField] || '');
        if (category) categorySet.add(category);
      });
      
      // Convert to category objects
      categories = Array.from(categorySet).map(name => ({ name }));
      
      // Convert to task objects
      tasks = flatData.map(item => {
        const taskProps: any = {
          id: String(item[idField] || ''),
          name: String(item[nameField] || ''),
          category: String(item[categoryField] || ''),
          startTime: item[startTimeField] || new Date(),
          endTime: item[endTimeField] || new Date(),
        };
        
        if (item[colorField]) taskProps.color = String(item[colorField]);
        if (item[statusField]) taskProps.status = String(item[statusField]);
        if (item[priorityField] !== undefined) taskProps.priority = item[priorityField];
        if (item[progressField] !== undefined) taskProps.progress = Number(item[progressField]);
        if (item[assigneeField]) taskProps.assignee = String(item[assigneeField]);
        
        return taskProps as GanttTask;
      });
    } else {
      // Assume data is in { tasks, categories } format
      const structuredData = props.data as { tasks: GanttTask[]; categories: GanttCategory[] };
      tasks = structuredData.tasks && Array.isArray(structuredData.tasks) ? [...structuredData.tasks] : [];
      categories = structuredData.categories && Array.isArray(structuredData.categories) ? [...structuredData.categories] : [];
    }
  }
  
  // Sort and group categories
  if (props.sortBy === 'category' || props.groupByCategory) {
    categories.sort((a, b) => {
      const orderA = a.order ?? 0;
      const orderB = b.order ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
  }
  
  // Sort tasks
  if (props.sortBy) {
    tasks.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (props.sortBy) {
        case 'startTime':
          aVal = new Date(a.startTime).getTime();
          bVal = new Date(b.startTime).getTime();
          break;
        case 'endTime':
          aVal = new Date(a.endTime).getTime();
          bVal = new Date(b.endTime).getTime();
          break;
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'priority':
          // Convert priority to numeric for sorting
          const priorityMap = { low: 1, medium: 2, high: 3, critical: 4 };
          aVal = typeof a.priority === 'number' ? a.priority : (priorityMap[a.priority as keyof typeof priorityMap] || 0);
          bVal = typeof b.priority === 'number' ? b.priority : (priorityMap[b.priority as keyof typeof priorityMap] || 0);
          break;
        default:
          return 0;
      }
      
      const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return props.sortOrder === 'desc' ? -result : result;
    });
  }
  
  // Apply filters
  if (props.filterByStatus && props.filterByStatus.length > 0) {
    tasks = tasks.filter(task => task.status && props.filterByStatus!.includes(task.status));
  }
  
  if (props.filterByPriority && props.filterByPriority.length > 0) {
    tasks = tasks.filter(task => task.priority && props.filterByPriority!.includes(task.priority));
  }
  
  // Create category index map
  const categoryMap = new Map(categories.map((cat, index) => [cat.name, index]));
  
  // Default style configurations
  const defaultTaskBarStyle: TaskBarStyle = {
    height: 0.6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: isDark ? '#404040' : '#e0e0e0',
    showProgress: props.showTaskProgress !== false,
    textStyle: {
      color: isDark ? '#ffffff' : '#000000',
      fontSize: 12,
      position: 'inside',
      showDuration: false,
      showProgress: false,
    },
    hoverStyle: {
      elevation: 2,
      opacity: 0.9,
    },
  };
  
  const taskBarStyle = { ...defaultTaskBarStyle, ...props.taskBarStyle };
  
  const defaultCategoryLabelStyle: CategoryLabelStyle = {
    width: props.categoryWidth || 120,
    backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
    textColor: isDark ? '#ffffff' : '#333333',
    fontSize: 12,
    fontWeight: 'normal',
    padding: [6, 12],
    borderRadius: 4,
    borderColor: isDark ? '#404040' : '#e0e0e0',
    borderWidth: 1,
    position: 'left',
    shape: 'rounded',
  };
  
  const categoryLabelStyle = { ...defaultCategoryLabelStyle, ...props.categoryLabelStyle };
  
  const defaultTimelineStyle: TimelineStyle = {
    position: 'top',
    showGrid: true,
    gridStyle: {
      color: isDark ? '#404040' : '#e9e9e9',
      width: 1,
      type: 'solid',
      opacity: 0.8,
    },
    tickStyle: {
      color: isDark ? '#666666' : '#999999',
      width: 1,
      length: 5,
    },
    labelStyle: {
      color: isDark ? '#cccccc' : '#666666',
      fontSize: 12,
      fontWeight: 'normal',
    },
  };
  
  const timelineStyle = { ...defaultTimelineStyle, ...props.timelineStyle };
  
  // Default status styles
  const defaultStatusStyles: StatusStyleMap = {
    'planned': {
      backgroundColor: isDark ? '#404040' : '#e0e0e0',
      color: isDark ? '#cccccc' : '#666666',
      borderColor: isDark ? '#666666' : '#cccccc',
    },
    'in-progress': {
      backgroundColor: '#4CAF50',
      color: '#ffffff',
      borderColor: '#45a049',
    },
    'completed': {
      backgroundColor: '#2196F3',
      color: '#ffffff',
      borderColor: '#1976D2',
    },
    'delayed': {
      backgroundColor: '#FF9800',
      color: '#ffffff',
      borderColor: '#F57C00',
    },
    'cancelled': {
      backgroundColor: '#f44336',
      color: '#ffffff',
      borderColor: '#d32f2f',
    },
  };
  
  const statusStyles = { ...defaultStatusStyles, ...props.statusStyles };
  
  // Default priority styles
  const defaultPriorityStyles: PriorityStyleMap = {
    'low': {
      backgroundColor: isDark ? '#2c3e50' : '#ecf0f1',
      borderColor: isDark ? '#34495e' : '#bdc3c7',
    },
    'medium': {
      backgroundColor: '#3498db',
      borderColor: '#2980b9',
    },
    'high': {
      backgroundColor: '#e67e22',
      borderColor: '#d35400',
    },
    'critical': {
      backgroundColor: '#e74c3c',
      borderColor: '#c0392b',
      glowColor: '#ff6b6b',
    },
  };
  
  const priorityStyles = { ...defaultPriorityStyles, ...props.priorityStyles };
  
  // Process tasks for rendering
  const processedTasks = tasks.map((task, taskIndex) => {
    const categoryIndex = categoryMap.get(task.category) ?? 0;
    const startTime = new Date(task.startTime).getTime();
    const endTime = new Date(task.endTime).getTime();
    
    // Determine task styling
    const statusStyle = task.status ? statusStyles[task.status] : null;
    const priorityStyle = task.priority ? priorityStyles[String(task.priority)] : null;
    const customStyle = task.style;
    
    // Final task color with priority: custom > status > priority > color prop > palette
    const taskColor = customStyle?.backgroundColor ||
      statusStyle?.backgroundColor ||
      priorityStyle?.backgroundColor ||
      task.color ||
      (props.colorPalette && props.colorPalette[taskIndex % props.colorPalette.length]) ||
      COLOR_PALETTES.default[taskIndex % COLOR_PALETTES.default.length];
      
    return {
      name: task.name,
      value: [
        categoryIndex,
        startTime,
        endTime,
        task.name,
        task.id,
        taskColor,
        task.progress || 0,
        task.status || '',
        task.priority || '',
        task.assignee || '',
      ],
      itemStyle: {
        color: taskColor,
        borderColor: customStyle?.borderColor || statusStyle?.borderColor || priorityStyle?.borderColor || taskBarStyle.borderColor,
        borderWidth: customStyle?.borderWidth || taskBarStyle.borderWidth,
        borderRadius: customStyle?.borderRadius || taskBarStyle.borderRadius,
        opacity: customStyle?.opacity,
      },
      emphasis: {
        itemStyle: {
          opacity: taskBarStyle.hoverStyle?.opacity || 1,
          borderColor: taskBarStyle.hoverStyle?.borderColor,
          borderWidth: taskBarStyle.hoverStyle?.borderWidth || (taskBarStyle.borderWidth! + 1),
        },
      },
    };
  });
  
  // Process categories for labels
  const processedCategories = categories.map((category, index) => ({
    name: category.name,
    value: [index, category.name, category.label || category.name],
    itemStyle: {
      color: category.color || categoryLabelStyle.backgroundColor,
      borderColor: category.style?.borderColor || categoryLabelStyle.borderColor,
      borderWidth: category.style?.borderWidth || categoryLabelStyle.borderWidth,
    },
    textStyle: {
      color: category.style?.textColor || categoryLabelStyle.textColor,
      fontSize: category.style?.fontSize || categoryLabelStyle.fontSize,
      fontWeight: category.style?.fontWeight || categoryLabelStyle.fontWeight,
    },
  }));
  
  // Custom render function for task bars
  const renderTaskItem = (params: any, api: any) => {
    const categoryIndex = api.value(0);
    const startTime = api.value(1);
    const endTime = api.value(2);
    const taskName = api.value(3);
    const progress = api.value(6);
    
    const timeStart = api.coord([startTime, categoryIndex]);
    const timeEnd = api.coord([endTime, categoryIndex]);
    
    const barLength = Math.max(timeEnd[0] - timeStart[0], 2); // Minimum 2px width
    const barHeight = api.size([0, 1])[1] * (typeof taskBarStyle.height === 'number' ? taskBarStyle.height : 0.6);
    const x = timeStart[0];
    const y = timeStart[1] - barHeight / 2;
    
    const showText = barLength > taskName.length * 6 + 20; // Show text if bar is wide enough
    
    const children: any[] = [
      // Main task bar
      {
        type: 'rect',
        shape: { x, y, width: barLength, height: barHeight },
        style: {
          fill: api.style().fill,
          stroke: api.style().stroke,
          lineWidth: api.style().lineWidth,
        },
      },
    ];
    
    // Add progress bar if enabled and progress > 0
    if (taskBarStyle.showProgress && progress > 0) {
      const progressWidth = (barLength * progress) / 100;
      children.push({
        type: 'rect',
        shape: { x, y, width: progressWidth, height: barHeight },
        style: {
          fill: taskBarStyle.progressStyle?.backgroundColor || 'rgba(255, 255, 255, 0.3)',
          opacity: taskBarStyle.progressStyle?.opacity || 0.7,
        },
      });
    }
    
    // Add text label if there's space
    if (showText && taskBarStyle.textStyle?.position !== 'outside') {
      children.push({
        type: 'text',
        style: {
          text: taskName,
          x: x + barLength / 2,
          y: y + barHeight / 2,
          textAlign: 'center',
          textVerticalAlign: 'middle',
          fill: taskBarStyle.textStyle?.color || '#ffffff',
          fontSize: taskBarStyle.textStyle?.fontSize || 12,
          fontWeight: taskBarStyle.textStyle?.fontWeight || 'normal',
        },
      });
    }
    
    return {
      type: 'group',
      children,
    };
  };
  
  // Custom render function for category labels
  const renderCategoryLabelItem = (params: any, api: any) => {
    if (!props.showCategoryLabels) return null;
    
    const categoryIndex = api.value(0);
    const categoryName = api.value(1);
    const categoryLabel = api.value(2);
    
    const y = api.coord([0, categoryIndex])[1];
    const labelWidth = categoryLabelStyle.width!;
    const labelHeight = api.size([0, 1])[1] * 0.8;
    const x = categoryLabelStyle.position === 'right' ? params.coordSys.x + params.coordSys.width + 10 : 10;
    
    // Skip if outside visible area
    if (y < params.coordSys.y - labelHeight || y > params.coordSys.y + params.coordSys.height) {
      return null;
    }
    
    const children: any[] = [];
    
    // Background shape
    if (categoryLabelStyle.shape === 'rounded' || categoryLabelStyle.shape === 'pill') {
      children.push({
        type: 'rect',
        shape: {
          x: x - labelWidth / 2,
          y: y - labelHeight / 2,
          width: labelWidth,
          height: labelHeight,
          r: categoryLabelStyle.shape === 'pill' ? labelHeight / 2 : categoryLabelStyle.borderRadius || 4,
        },
        style: {
          fill: api.style().fill,
          stroke: api.style().stroke,
          lineWidth: api.style().lineWidth,
        },
      });
    } else {
      // Rectangle or custom shape
      children.push({
        type: 'rect',
        shape: {
          x: x - labelWidth / 2,
          y: y - labelHeight / 2,
          width: labelWidth,
          height: labelHeight,
        },
        style: {
          fill: api.style().fill,
          stroke: api.style().stroke,
          lineWidth: api.style().lineWidth,
        },
      });
    }
    
    // Text label
    children.push({
      type: 'text',
      style: {
        text: categoryLabel,
        x,
        y,
        textAlign: 'center',
        textVerticalAlign: 'middle',
        fill: categoryLabelStyle.textColor,
        fontSize: categoryLabelStyle.fontSize,
        fontWeight: categoryLabelStyle.fontWeight,
      },
    });
    
    return {
      type: 'group',
      children,
    };
  };
  
  // Build data zoom configuration
  const dataZoomConfig = [];
  if (props.dataZoom !== false) {
    const zoomConfig = typeof props.dataZoom === 'boolean' ? {} : (props.dataZoom || {});
    const showSlider = zoomConfig.type === 'slider' || zoomConfig.type === 'both' || zoomConfig.show !== false;
    const showInside = zoomConfig.type === 'inside' || zoomConfig.type === 'both';
    
    if (showSlider) {
      dataZoomConfig.push({
        type: 'slider',
        xAxisIndex: 0,
        height: zoomConfig.height || 20,
        bottom: 0,
        start: 0,
        end: 50,
        backgroundColor: zoomConfig.backgroundColor || (isDark ? '#2a2a2a' : '#f5f5f5'),
        borderColor: zoomConfig.borderColor || (isDark ? '#404040' : '#e0e0e0'),
        handleStyle: {
          color: zoomConfig.handleStyle?.color || (isDark ? '#666666' : '#cccccc'),
          borderColor: zoomConfig.handleStyle?.borderColor || (isDark ? '#888888' : '#999999'),
          ...zoomConfig.handleStyle,
        },
      });
    }
    
    if (showInside) {
      dataZoomConfig.push({
        type: 'inside',
        xAxisIndex: 0,
        zoomOnMouseWheel: props.allowZoom !== false,
        moveOnMouseMove: props.allowPan !== false,
      });
    }
    
    // Vertical data zoom for categories
    if (categories.length > 10) {
      dataZoomConfig.push({
        type: 'inside',
        yAxisIndex: 0,
        zoomOnMouseWheel: false,
        moveOnMouseMove: true,
        moveOnMouseWheel: true,
      });
    }
  }
  
  // Add today marker if enabled
  const todayMarkerSeries: any[] = [];
  if (props.todayMarker) {
    const todayConfig = typeof props.todayMarker === 'boolean' ? {} : props.todayMarker;
    const today = new Date().getTime();
    
    todayMarkerSeries.push({
      type: 'line' as const,
      markLine: {
        silent: true,
        symbol: 'none',
        data: [{ xAxis: today }],
        lineStyle: {
          color: todayConfig.color || '#ff4444',
          width: todayConfig.width || 2,
          type: todayConfig.style || 'dashed',
        },
      },
    });
  }
  
  return {
    ...baseOption,
    grid: {
      show: timelineStyle.showGrid || false,
      left: (categoryLabelStyle.width! + 20) || 140,
      right: 20,
      top: timelineStyle.position === 'top' ? 60 : 20,
      bottom: (props.dataZoom !== false ? 40 : 20) + (timelineStyle.position === 'bottom' ? 40 : 0),
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      borderWidth: 0,
    },
    xAxis: {
      type: 'time',
      position: timelineStyle.position || 'top',
      splitLine: {
        show: timelineStyle.showGrid || false,
        lineStyle: {
          color: timelineStyle.gridStyle?.color || (isDark ? '#404040' : '#e9e9e9'),
          width: timelineStyle.gridStyle?.width || 1,
          type: timelineStyle.gridStyle?.type || 'solid',
          opacity: timelineStyle.gridStyle?.opacity || 0.8,
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: timelineStyle.tickStyle?.color || (isDark ? '#666666' : '#999999'),
          width: timelineStyle.tickStyle?.width || 1,
        },
        length: timelineStyle.tickStyle?.length || 5,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: timelineStyle.tickStyle?.color || (isDark ? '#666666' : '#999999'),
        },
      },
      axisLabel: {
        rotate: timelineStyle.labelStyle?.rotate || 0,
        ...(timelineStyle.labelStyle?.color && { color: timelineStyle.labelStyle.color }),
        ...(timelineStyle.labelStyle?.fontSize && { fontSize: timelineStyle.labelStyle.fontSize }),
        ...(timelineStyle.labelStyle?.fontWeight && { fontWeight: timelineStyle.labelStyle.fontWeight }),
        ...(timelineStyle.labelStyle?.format && typeof timelineStyle.labelStyle.format === 'string' && { 
          formatter: timelineStyle.labelStyle.format 
        }),
        ...(timelineStyle.labelStyle?.format && typeof timelineStyle.labelStyle.format === 'function' && { 
          formatter: (value: number) => (timelineStyle.labelStyle!.format as Function)(new Date(value))
        }),
      },
      ...(props.timeRange && {
        min: new Date(props.timeRange[0]).getTime(),
        max: new Date(props.timeRange[1]).getTime(),
      }),
    },
    yAxis: {
      type: 'category',
      data: categories.map(cat => cat.label || cat.name),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
      inverse: true, // Show categories from top to bottom
    },
    ...(dataZoomConfig.length > 0 && { dataZoom: dataZoomConfig }),
    series: [
      // Main task series
      {
        type: 'custom',
        renderItem: renderTaskItem,
        encode: {
          x: [1, 2], // startTime, endTime
          y: 0,      // categoryIndex
          tooltip: [0, 1, 2, 3, 4], // categoryIndex, startTime, endTime, taskName, taskId
        },
        data: processedTasks,
        z: 10,
      },
      // Category labels series
      {
        type: 'custom',
        renderItem: renderCategoryLabelItem,
        encode: {
          x: -1, // No x encoding
          y: 0,  // categoryIndex
        },
        data: processedCategories,
        z: 5,
      },
      ...todayMarkerSeries,
    ],
    tooltip: props.tooltip ? buildTooltipOption(props.tooltip, props.theme) : {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.seriesIndex === 0) { // Task tooltip
          const [categoryIndex, startTime, endTime, taskName, taskId] = params.value;
          const start = new Date(startTime).toLocaleString();
          const end = new Date(endTime).toLocaleString();
          const duration = Math.round((endTime - startTime) / (1000 * 60 * 60 * 24 * 10)) / 100; // Days with 2 decimals
          const category = categories[categoryIndex]?.name || 'Unknown';
          
          return `
            <strong>${taskName}</strong><br/>
            Category: ${category}<br/>
            Start: ${start}<br/>
            End: ${end}<br/>
            Duration: ${duration} days
          `;
        }
        return '';
      },
      backgroundColor: isDark ? 'rgba(50, 50, 50, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? '#666' : '#ddd',
      textStyle: {
        color: isDark ? '#fff' : '#333',
      },
    },
    legend: props.legend ? buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme) : undefined,
    ...props.customOption,
  };
}

export function buildRegressionChartOption(props: RegressionChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  if (!props.data || props.data.length === 0) {
    return { ...baseOption, series: [] };
  }
  
  // Process data into the format needed for ecStat regression
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
  
  // Default regression configuration
  const method = props.method || 'linear';
  const order = props.order || (method === 'polynomial' ? 2 : undefined);
  const showPoints = props.showPoints !== false;
  const showLine = props.showLine !== false;
  const showEquation = props.showEquation !== false;
  const showRSquared = props.showRSquared !== false;
  
  // Point and line styling
  const pointSize = props.pointSize || 8;
  const pointShape = props.pointShape || 'circle';
  const pointOpacity = props.pointOpacity || 0.7;
  const lineWidth = props.lineWidth || 2;
  const lineStyle = props.lineStyle || 'solid';
  const lineColor = props.lineColor;
  const lineOpacity = props.lineOpacity || 1;
  
  // Labels
  const pointsLabel = props.pointsLabel || 'Data Points';
  const regressionLabel = props.regressionLabel || 'Regression Line';
  
  // Build datasets with ecStat regression transform
  const datasets: any[] = [
    {
      source: sourceData
    }
  ];
  
  // Add regression transform dataset if regression line should be shown
  if (showLine) {
    const regressionConfig: any = {
      method,
      formulaOn: showEquation ? (props.equationPosition === 'top-left' || props.equationPosition === 'bottom-left' ? 'start' : 'end') : false,
    };
    
    if (method === 'polynomial' && order !== undefined) {
      regressionConfig.order = order;
    }
    
    datasets.push({
      transform: {
        type: 'ecStat:regression',
        config: regressionConfig,
      }
    });
  }
  
  // Build series
  const series: any[] = [];
  
  // Scatter points series
  if (showPoints) {
    series.push({
      name: pointsLabel,
      type: 'scatter',
      datasetIndex: 0,
      symbolSize: pointSize,
      symbol: pointShape,
      itemStyle: {
        opacity: pointOpacity,
      },
      emphasis: {
        focus: 'series',
      },
    });
  }
  
  // Regression line series
  if (showLine) {
    const lineSeriesStyle: any = {
      width: lineWidth,
      type: lineStyle === 'dashed' ? 'dashed' : lineStyle === 'dotted' ? 'dotted' : 'solid',
      opacity: lineOpacity,
    };
    
    if (lineColor) {
      lineSeriesStyle.color = lineColor;
    }
    
    series.push({
      name: regressionLabel,
      type: 'line',
      datasetIndex: 1,
      symbolSize: 0,
      symbol: 'none',
      lineStyle: lineSeriesStyle,
      emphasis: {
        focus: 'series',
      },
      encode: { 
        tooltip: [0, 1]
      },
    });
  }
  
  // Build equation display if enabled
  const equationGraphic: any[] = [];
  if (showEquation && showLine) {
    const position = props.equationPosition || 'top-right';
    let x: string | number = '90%';
    let y: string | number = '10%';
    
    switch (position) {
      case 'top-left':
        x = '5%';
        y = '15%';
        break;
      case 'top-right':
        x = '90%';
        y = '15%';
        break;
      case 'bottom-left':
        x = '5%';
        y = '85%';
        break;
      case 'bottom-right':
        x = '90%';
        y = '85%';
        break;
    }
    
    // Note: The actual equation will be calculated by ecStat transform
    // This is a placeholder that will be updated by the transform
    equationGraphic.push({
      type: 'text',
      left: x,
      top: y,
      style: {
        text: 'Calculating equation...',
        fontSize: 12,
        fill: props.theme === 'dark' ? '#cccccc' : '#666666',
      },
    });
  }
  
  return {
    ...baseOption,
    dataset: datasets,
    grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, false),
    xAxis: {
      ...buildAxisOption(props.xAxis, 'numeric', props.theme),
      type: 'value',
      scale: true,
    },
    yAxis: {
      ...buildAxisOption(props.yAxis, 'numeric', props.theme),
      type: 'value',
      scale: true,
    },
    series,
    legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
    tooltip: buildTooltipOption(props.tooltip, props.theme),
    ...(equationGraphic.length > 0 && { graphic: equationGraphic }),
    ...props.customOption,
  };
}