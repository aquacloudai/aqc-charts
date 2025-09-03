import React, { forwardRef, useMemo, useImperativeHandle, useEffect } from 'react';
import type { EChartsType } from 'echarts/core';
import type { CalendarHeatmapProps, ErgonomicChartRef } from '@/types';
import { useECharts } from '@/hooks/useECharts';
import { useLegendDoubleClick } from '@/hooks/useLegendDoubleClick';
import { buildCalendarHeatmapOption } from '@/utils/chart-builders';
import { filterDOMProps } from '@/utils/domProps';

/**
 * Ergonomic CalendarHeatmapChart component with intuitive props
 * 
 * @example
 * // Simple calendar heatmap with object data
 * <CalendarHeatmapChart
 *   data={[
 *     { date: '2023-01-01', value: 10 },
 *     { date: '2023-01-02', value: 25 },
 *     { date: '2023-01-03', value: 15 }
 *   ]}
 *   year={2023}
 *   colorScale={['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']}
 * />
 * 
 * @example
 * // Multi-year calendar heatmap with custom fields
 * <CalendarHeatmapChart
 *   data={commitData}
 *   dateField="commit_date"
 *   valueField="commits_count"
 *   year={[2022, 2023]}
 *   showValues
 *   cellSize={[20, 20]}
 * />
 * 
 * @example
 * // Calendar heatmap with custom styling
 * <CalendarHeatmapChart
 *   data={activityData}
 *   year={2023}
 *   colorScale={['#f0f0f0', '#d6e685', '#8cc665', '#44a340', '#1e6823']}
 *   cellBorderColor="#ccc"
 *   orient="vertical"
 *   showWeekLabel={false}
 * />
 */
const CalendarHeatmapChart = forwardRef<ErgonomicChartRef, CalendarHeatmapProps>(({
  // Chart dimensions
  width = '100%',
  height = 400,
  className,
  style,
  
  // Data and field mappings
  data,
  dateField = 'date',
  valueField = 'value',
  
  // Styling
  theme = 'light',
  colorPalette,
  backgroundColor,
  
  // Title
  title,
  subtitle,
  titlePosition = 'center',
  
  // Calendar configuration
  year,
  range,
  startOfWeek = 'sunday',
  cellSize,
  
  // Visual styling
  colorScale,
  showWeekLabel = true,
  showMonthLabel = true,
  showYearLabel = true,
  
  // Value formatting
  valueFormat,
  showValues = false,
  
  // Interaction
  cellBorderColor,
  cellBorderWidth,
  splitNumber,
  
  // Layout
  orient = 'horizontal',
  monthGap,
  yearGap,
  
  // Configuration
  legend,
  tooltip,
  
  // States
  loading = false,
  disabled: _disabled = false,
  animate = true,
  animationDuration,
  
  // Events
  onChartReady,
  onDataPointClick,
  onDataPointHover,
  onLegendDoubleClick,
  onSeriesDoubleClick,
  legendDoubleClickDelay,
  enableLegendDoubleClickSelection = true,
  
  // Advanced
  customOption,
  responsive: _responsive = true,
  
  ...restProps
}, ref) => {
  const domProps = filterDOMProps(restProps);
  
  // Build ECharts option from ergonomic props
  const chartOption = useMemo(() => {
    return buildCalendarHeatmapOption({
      data: data || [],
      dateField,
      valueField,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      year,
      range,
      startOfWeek,
      cellSize,
      colorScale,
      showWeekLabel,
      showMonthLabel,
      showYearLabel,
      valueFormat,
      showValues,
      cellBorderColor,
      cellBorderWidth,
      splitNumber,
      orient,
      monthGap,
      yearGap,
      legend,
      tooltip,
      animate,
      animationDuration,
      customOption,
    });
  }, [
    data, dateField, valueField,
    theme, colorPalette, backgroundColor,
    title, subtitle, titlePosition,
    year, range, startOfWeek, cellSize,
    colorScale, showWeekLabel, showMonthLabel, showYearLabel,
    valueFormat, showValues,
    cellBorderColor, cellBorderWidth, splitNumber,
    orient, monthGap, yearGap,
    legend, tooltip, animate, animationDuration,
    customOption
  ]);
  
  // Use our refactored hook
  const {
    containerRef,
    loading: chartLoading,
    error,
    getEChartsInstance,
    resize,
    showLoading,
    hideLoading,
  } = useECharts({
    option: chartOption,
    theme,
    loading,
    onChartReady,
  });
  
  // Get chart instance for legend double-click functionality
  const chartInstance = getEChartsInstance();

  // Setup legend and series double-click handling
  const { handleLegendClick, handleSeriesClick } = useLegendDoubleClick({
    chartInstance,
    onLegendDoubleClick,
    onSeriesDoubleClick,
    delay: legendDoubleClickDelay || 300,
    enableAutoSelection: enableLegendDoubleClickSelection,
  });

  // Handle data point interactions and legend events
  const chartEvents = useMemo(() => {
    const events: Record<string, any> = {};
    
    if (onDataPointClick) {
      events.click = (params: any, chart: EChartsType) => {
        onDataPointClick(params, { chart, event: params });
      };
    }

    // Add series double-click detection via click event (may need special handling for heatmap cells)
    if (onSeriesDoubleClick || enableLegendDoubleClickSelection) {
      const existingClick = events.click;
      events.click = (params: any, chart: EChartsType) => {
        // Call existing click handler first
        if (existingClick) {
          existingClick(params, chart);
        }
        // Then handle series double-click
        handleSeriesClick(params);
      };
    } else if (!onDataPointClick) {
      // If no existing click handler, add series double-click handler only
      events.click = (params: any) => {
        handleSeriesClick(params);
      };
    }
    
    if (onDataPointHover) {
      events.mouseover = (params: any, chart: EChartsType) => {
        onDataPointHover(params, { chart, event: params });
      };
    }
    
    // Add legend double-click detection via legendselectchanged event
    if (onLegendDoubleClick || enableLegendDoubleClickSelection) {
      events.legendselectchanged = (params: any) => {
        handleLegendClick(params);
      };
    }
    
    return events;
  }, [onDataPointClick, onDataPointHover, onLegendDoubleClick, onSeriesDoubleClick, enableLegendDoubleClickSelection, handleLegendClick, handleSeriesClick]);

  // Apply events to chart instance
  useEffect(() => {
    if (!chartInstance || Object.keys(chartEvents).length === 0) return;

    const eventHandlers: Array<[string, (...args: unknown[]) => void]> = [];

    Object.entries(chartEvents).forEach(([event, handler]) => {
      chartInstance.on(event, handler);
      eventHandlers.push([event, handler]);
    });

    return () => {
      eventHandlers.forEach(([event, handler]) => {
        chartInstance.off(event, handler);
      });
    };
  }, [chartInstance, chartEvents]);
  
  // Export image functionality
  const exportImage = (format: 'png' | 'jpeg' | 'svg' = 'png'): string => {
    const chart = getEChartsInstance();
    if (!chart) return '';
    
    return chart.getDataURL({
      type: format,
      pixelRatio: 2,
      backgroundColor: backgroundColor || '#fff',
    });
  };
  
  // Highlight functionality
  const highlight = (dataIndex: number, seriesIndex: number = 0) => {
    const chart = getEChartsInstance();
    if (!chart) return;
    
    chart.dispatchAction({
      type: 'highlight',
      seriesIndex,
      dataIndex,
    });
  };
  
  const clearHighlight = () => {
    const chart = getEChartsInstance();
    if (!chart) return;
    
    chart.dispatchAction({
      type: 'downplay',
    });
  };
  
  // Update data functionality
  const updateData = (newData: readonly any[]) => {
    const chart = getEChartsInstance();
    if (!chart) return;
    
    const newOption = buildCalendarHeatmapOption({
      data: newData,
      dateField,
      valueField,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      year,
      range,
      startOfWeek,
      cellSize,
      colorScale,
      showWeekLabel,
      showMonthLabel,
      showYearLabel,
      valueFormat,
      showValues,
      cellBorderColor,
      cellBorderWidth,
      splitNumber,
      orient,
      monthGap,
      yearGap,
      legend,
      tooltip,
      animate,
      animationDuration,
      customOption,
    });
    
    chart.setOption(newOption as any);
  };
  
  // Expose ergonomic API through ref
  useImperativeHandle(ref, () => ({
    getChart: getEChartsInstance,
    exportImage,
    resize,
    showLoading: () => showLoading(),
    hideLoading,
    highlight,
    clearHighlight,
    updateData,
  }), [getEChartsInstance, exportImage, resize, showLoading, hideLoading, highlight, clearHighlight, updateData]);
  
  // Error state
  if (error) {
    return (
      <div
        className={`aqc-charts-error ${className || ''}`}
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff4d4f',
          fontSize: '14px',
          border: '1px dashed #ff4d4f',
          borderRadius: '4px',
          ...style,
        }}
      >
        Error: {error.message || 'Failed to render chart'}
      </div>
    );
  }
  
  // Container style
  const containerStyle = useMemo(() => ({
    width,
    height,
    position: 'relative' as const,
    ...style,
  }), [width, height, style]);
  
  return (
    <div
      className={`aqc-charts-container ${className || ''}`}
      style={containerStyle}
      {...domProps}
    >
      {/* Chart container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      
      {/* Loading overlay */}
      {(chartLoading || loading) && (
        <div 
          className="aqc-charts-loading"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            color: '#666',
          }}
        >
          <div className="aqc-charts-spinner" style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #1890ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px',
          }} />
          Loading...
        </div>
      )}
    </div>
  );
});

CalendarHeatmapChart.displayName = 'CalendarHeatmapChart';

export { CalendarHeatmapChart };