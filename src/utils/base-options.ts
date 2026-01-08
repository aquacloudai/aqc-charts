import type { EChartsOption } from 'echarts/types/dist/shared';
import type { AxisConfig, LegendConfig, TooltipConfig, ChartLogo } from '@/types';
import { COLOR_PALETTES } from './color-palettes';
import { createLogoGraphic } from './logo';

/**
 * Props used by buildBaseOption function
 * All properties explicitly allow undefined to support exactOptionalPropertyTypes
 */
interface BaseOptionProps {
  readonly theme?: 'light' | 'dark' | 'auto' | undefined;
  readonly title?: string | undefined;
  readonly subtitle?: string | undefined;
  readonly titlePosition?: 'left' | 'center' | 'right' | undefined;
  readonly animate?: boolean | undefined;
  readonly animationDuration?: number | undefined;
  readonly backgroundColor?: string | undefined;
  readonly colorPalette?: readonly string[] | undefined;
  readonly logo?: ChartLogo | undefined;
  readonly width?: number | string | undefined;
  readonly height?: number | string | undefined;
}

/**
 * Record type for ECharts option objects
 * eslint-disable-next-line @typescript-eslint/no-explicit-any
 * Using Record<string, any> because ECharts option objects are dynamic
 * and need to support spreading
 */
// biome-ignore lint/suspicious/noExplicitAny: ECharts options require dynamic object types
type EChartsOptionRecord = Record<string, any>;

// Base option builders
export function buildBaseOption(props: BaseOptionProps): Partial<EChartsOption> {
  const option: Partial<EChartsOption> = {};
  const isDark = props.theme === 'dark';
  
  
  // Title with theme-aware colors and proper spacing
  if (props.title) {
    option.title = {
      text: props.title,
      ...(props.subtitle && { subtext: props.subtitle }),
      left: props.titlePosition || 'center',
      top: 10, // Add top padding to prevent edge clipping
      textStyle: {
        color: isDark ? '#ffffff' : '#333333',
        fontSize: 16,
        fontWeight: 'bold',
      },
      subtextStyle: {
        color: isDark ? '#cccccc' : '#666666',
        fontSize: 12,
      },
      itemGap: 8, // Space between title and subtitle
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

  // Add logo if provided and not onSaveOnly
  if (props.logo && !props.logo.onSaveOnly) {
    const chartWidth = typeof props.width === 'number' ? props.width : 600;
    const chartHeight = typeof props.height === 'number' ? props.height : 400;
    const logoGraphic = createLogoGraphic(props.logo, chartWidth, chartHeight);
    
    option.graphic = option.graphic ? 
      (Array.isArray(option.graphic) ? [...option.graphic, logoGraphic] : [option.graphic, logoGraphic]) :
      [logoGraphic];
  }
  
  return option;
}

export function buildAxisOption(config?: AxisConfig, dataType: 'numeric' | 'categorical' | 'time' = 'categorical', theme?: string): EChartsOptionRecord {
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

export function buildLegendOption(config?: LegendConfig, hasTitle?: boolean, hasSubtitle?: boolean, hasDataZoom?: boolean, theme?: string): EChartsOptionRecord {
  if (!config || config.show === false) {
    return { show: false };
  }

  const position = config.position || 'top';
  const orientation = config.orientation || (position === 'left' || position === 'right' ? 'vertical' : 'horizontal');
  const align = config.align || 'center';

  // Use percentage-based positioning for responsive layout
  let positioning: EChartsOptionRecord = {};

  // Calculate top offset based on title presence
  const topOffset = hasTitle && hasSubtitle ? '10%' : hasTitle ? '8%' : '3%';

  switch (position) {
    case 'top':
      positioning = { top: topOffset };
      if (align === 'center') {
        positioning.left = 'center';
      } else if (align === 'start') {
        positioning.left = '10%';
      } else {
        positioning.right = '5%';
      }
      break;

    case 'bottom':
      positioning = { bottom: hasDataZoom ? '12%' : '3%' };
      if (align === 'center') {
        positioning.left = 'center';
      } else if (align === 'start') {
        positioning.left = '10%';
      } else {
        positioning.right = '5%';
      }
      break;

    case 'left':
      positioning = { left: '3%', top: topOffset };
      break;

    case 'right':
      positioning = { right: '3%', top: topOffset };
      break;
  }

  const isDark = theme === 'dark';

  return {
    show: true,
    type: 'scroll',
    orient: orientation,
    ...positioning,
    itemGap: 12,
    itemWidth: 20,
    itemHeight: 12,
    textStyle: {
      fontSize: 12,
      color: isDark ? '#cccccc' : '#666666'
    }
  };
}

export function calculateGridSpacing(legendConfig?: LegendConfig, hasTitle?: boolean, hasSubtitle?: boolean, hasDataZoom?: boolean): EChartsOptionRecord {
  // Use ECharts' built-in grid with containLabel for automatic label handling
  // Position using percentages for responsive sizing

  const hasLegendTop = legendConfig && legendConfig.show !== false && (legendConfig.position || 'top') === 'top';
  const hasLegendBottom = legendConfig && legendConfig.show !== false && legendConfig.position === 'bottom';
  const hasLegendLeft = legendConfig && legendConfig.show !== false && legendConfig.position === 'left';
  const hasLegendRight = legendConfig && legendConfig.show !== false && legendConfig.position === 'right';

  // Calculate top spacing: title (if any) + legend (if top)
  let top = '10%';
  if (hasTitle && hasSubtitle && hasLegendTop) {
    top = '18%';
  } else if (hasTitle && hasSubtitle) {
    top = '14%';
  } else if ((hasTitle && hasLegendTop) || (hasSubtitle && hasLegendTop)) {
    top = '15%';
  } else if (hasTitle || hasSubtitle) {
    top = '12%';
  } else if (hasLegendTop) {
    top = '12%';
  }

  // Calculate bottom spacing: dataZoom (if any) + legend (if bottom)
  let bottom = '10%';
  if (hasDataZoom && hasLegendBottom) {
    bottom = '22%';
  } else if (hasDataZoom) {
    bottom = '15%';
  } else if (hasLegendBottom) {
    bottom = '15%';
  }

  return {
    left: hasLegendLeft ? '15%' : '10%',
    right: hasLegendRight ? '15%' : '5%',
    top,
    bottom,
    containLabel: true  // Let ECharts handle axis label spacing automatically
  };
}

// Generate stable component key for theme changes
export function generateChartKey(theme?: string, colorPalette?: readonly string[]): string {
  const themeKey = theme || 'default';
  const paletteKey = colorPalette ? colorPalette.slice(0, 3).join('') : 'default';
  return `chart-${themeKey}-${paletteKey}`;
}

export function buildTooltipOption(config?: TooltipConfig, theme?: string): EChartsOptionRecord {
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