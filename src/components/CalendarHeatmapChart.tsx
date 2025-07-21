import { forwardRef, useMemo, useImperativeHandle } from 'react';
import type { EChartsType } from 'echarts/core';
import type { CalendarHeatmapProps, ErgonomicChartRef } from '@/types/ergonomic';
import { useECharts } from '@/hooks/useECharts';
import { buildCalendarHeatmapOption } from '@/utils/ergonomic';

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
  disabled = false,
  animate = true,
  animationDuration,
  
  // Events
  onChartReady,
  onDataPointClick,
  onDataPointHover,
  
  // Advanced
  customOption,
  responsive = true,
  
  ...restProps
}, ref) => {
  
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
  
  // Handle data point interactions
  const chartEvents = useMemo(() => {
    const events: Record<string, any> = {};
    
    if (onDataPointClick) {
      events.click = (params: any, chart: EChartsType) => {
        onDataPointClick(params, { chart, event: params });
      };
    }
    
    if (onDataPointHover) {
      events.mouseover = (params: any, chart: EChartsType) => {
        onDataPointHover(params, { chart, event: params });
      };
    }
    
    return Object.keys(events).length > 0 ? events : undefined;
  }, [onDataPointClick, onDataPointHover]);

  // Use our refactored hook with events included
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
    events: chartEvents,
    onChartReady,
  });
  
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
      {...restProps}
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