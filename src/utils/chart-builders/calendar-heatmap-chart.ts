import type { EChartsOption } from 'echarts/types/dist/shared';
import type { CalendarHeatmapProps } from '@/types';

import { isObjectData } from '../data-processing';
import {
  buildBaseOption,
  buildTooltipOption,
} from '../base-options';

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
  
  // Calculate proper spacing for calendar heatmap
  const hasTitle = !!props.title;
  const hasSubtitle = !!props.subtitle;
  const isVertical = props.orient === 'vertical';

  // Calendar needs extra top spacing for:
  // 1. Title (if present)
  // 2. Month labels that appear above the calendar grid
  // Title height: ~40px for title, ~60px for title+subtitle
  // Month labels: ~25px
  const titleHeight = hasTitle && hasSubtitle ? 60 : hasTitle ? 40 : 0;
  const monthLabelHeight = 25;
  const topPadding = titleHeight + monthLabelHeight + 10; // 10px buffer

  // Bottom spacing for visual map legend
  const bottomPadding = isVertical ? 30 : 50; // More space for horizontal visual map
  
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
      // For vertical layout
      calendarConfig.left = 80; // Space for day labels
      calendarConfig.top = topPadding;
      calendarConfig.bottom = bottomPadding;
      calendarConfig.right = 100; // Space for visual map on right
    } else {
      // For horizontal layout
      if (years.length > 1) {
        // Multiple years stacked vertically
        const totalHeight = 100; // percentage
        const availableHeight = totalHeight - topPadding - bottomPadding;
        const heightPerYear = availableHeight / years.length;
        calendarConfig.top = topPadding + index * heightPerYear;
        calendarConfig.left = 50; // Space for day labels
        calendarConfig.right = 30;
      } else {
        // Single year
        calendarConfig.top = topPadding;
        calendarConfig.left = 50; // Space for day labels (Mon, Wed, Fri)
        calendarConfig.right = 30;
        calendarConfig.bottom = bottomPadding;
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
    visualMap: {
      type: 'piecewise',
      orient: isVertical ? 'vertical' : 'horizontal',
      // Position visual map with proper spacing
      ...(isVertical ? {
        right: 20,
        top: topPadding,
        itemGap: 5,
      } : {
        left: 'center',
        bottom: 10, // Fixed bottom position with good spacing
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
    },
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