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
} from '@/types/ergonomic';

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