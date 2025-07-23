import type { EChartsOption } from 'echarts/types/dist/shared';
import type { AxisConfig, LegendConfig, TooltipConfig } from '@/types';
import { COLOR_PALETTES } from './color-palettes';
import { detectAxisType } from './dateFormatting';

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

export function buildAxisOption(config?: AxisConfig, dataType: 'numeric' | 'categorical' | 'time' = 'categorical', theme?: string, data?: readonly any[], field?: string): any {
  const isDark = theme === 'dark';
  
  // Smart axis type detection if no explicit config
  if (!config) {
    // Use auto-detection for safety, defaulting to category for date-like values
    const detectedType = data && field ? detectAxisType(data, field) : dataType;
    const safeAxisType = detectedType === 'time' ? 'category' : detectedType;
    const echartsType = safeAxisType === 'numeric' || safeAxisType === 'linear' ? 'value' : 'category';
    
    return {
      type: echartsType,
      // Default boundaryGap for line charts: false for category axes (starts at axis)
      ...(echartsType === 'category' && { boundaryGap: false }),
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
  
  // Determine axis type with safety overrides
  let axisType: string;
  
  if (config.type) {
    // Explicit type provided - but still protect against accidental time parsing
    if (config.type === 'time' && config.parseDate === false) {
      axisType = 'category'; // Override time to category if parseDate is false
    } else {
      axisType = config.type === 'linear' ? 'value' : 
        config.type === 'log' ? 'log' : 
        config.type === 'time' ? 'time' : 'category';
    }
  } else {
    // Auto-detect with safety
    const detectedType = data && field ? detectAxisType(data, field) : dataType;
    
    // Safety: if parseDate is explicitly false, force category even for detected time
    if (config.parseDate === false && detectedType === 'time') {
      axisType = 'category';
    } else {
      axisType = detectedType === 'numeric' || detectedType === 'linear' ? 'value' : 
        detectedType === 'time' && config.parseDate !== false ? 'time' : 'category';
    }
  }
  
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