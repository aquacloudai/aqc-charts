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
  
  const axisType = config.type || (dataType === 'numeric' ? 'value' : dataType === 'time' ? 'time' : 'category');
  
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
      formatter: config.format,
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

export function buildScatterChartOption(props: ScatterChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  let series: any[] = [];
  
  if (props.series) {
    series = props.series.map(s => ({
      name: s.name,
      type: 'scatter',
      data: s.data,
      itemStyle: { color: s.color },
      symbolSize: s.pointSize || props.pointSize || 10,
      symbol: s.pointShape || props.pointShape || 'circle',
    }));
  } else if (props.data) {
    if (isObjectData(props.data)) {
      let processedData;
      if (props.sizeField) {
        // Bubble chart with size dimension
        processedData = props.data.map((item: any) => [
          item[props.xField as string],
          item[props.yField as string],
          item[props.sizeField as string],
        ]);
      } else {
        processedData = props.data.map((item: any) => [
          item[props.xField as string],
          item[props.yField as string],
        ]);
      }
      
      series = [{
        type: 'scatter',
        data: processedData,
        symbolSize: props.sizeField 
          ? (value: number[]) => Math.sqrt(value[2] || 1) * 5 // Scale the size
          : props.pointSize || 10,
        symbol: props.pointShape || 'circle',
      }];
    } else {
      series = [{
        type: 'scatter',
        data: [...props.data],
        symbolSize: props.pointSize || 10,
        symbol: props.pointShape || 'circle',
      }];
    }
  }
  
  return {
    ...baseOption,
    xAxis: buildAxisOption(props.xAxis, 'numeric', props.theme),
    yAxis: buildAxisOption(props.yAxis, 'numeric', props.theme),
    series,
    legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
    tooltip: buildTooltipOption(props.tooltip, props.theme),
    ...props.customOption,
  };
}