import { forwardRef, useMemo, useImperativeHandle } from 'react';
import type { EChartsType } from 'echarts/core';
import type { BarChartProps, ErgonomicChartRef } from '@/types';
import { useECharts } from '@/hooks/useECharts';
import { buildBarChartOption } from '@/utils/chart-builders';

/**
 * Ergonomic BarChart component with intuitive props
 * 
 * @example
 * // Simple bar chart with object data
 * <ErgonomicBarChart
 *   data={[
 *     { category: 'Q1', sales: 100, profit: 20 },
 *     { category: 'Q2', sales: 120, profit: 25 },
 *     { category: 'Q3', sales: 110, profit: 22 },
 *     { category: 'Q4', sales: 140, profit: 30 }
 *   ]}
 *   categoryField="category"
 *   valueField={['sales', 'profit']}
 *   orientation="vertical"
 * />
 * 
 * @example
 * // Stacked bar chart
 * <ErgonomicBarChart
 *   data={salesData}
 *   categoryField="month"
 *   valueField="amount"
 *   seriesField="product"
 *   stack="normal"
 *   orientation="horizontal"
 * />
 * 
 * @example
 * // Multiple series with explicit configuration
 * <ErgonomicBarChart
 *   series={[
 *     {
 *       name: 'Sales',
 *       data: [{ quarter: 'Q1', value: 100 }, { quarter: 'Q2', value: 120 }],
 *       color: '#1890ff'
 *     },
 *     {
 *       name: 'Profit',
 *       data: [{ quarter: 'Q1', value: 20 }, { quarter: 'Q2', value: 25 }],
 *       color: '#52c41a'
 *     }
 *   ]}
 *   categoryField="quarter"
 *   valueField="value"
 * />
 */
const BarChart = forwardRef<ErgonomicChartRef, BarChartProps>(({
  // Chart dimensions
  width = '100%',
  height = 400,
  className,
  style,
  
  // Data and field mappings
  data,
  categoryField = 'category',
  valueField = 'value',
  seriesField,
  series,
  
  // Styling
  theme = 'light',
  colorPalette,
  backgroundColor,
  
  // Title
  title,
  subtitle,
  titlePosition = 'center',
  
  // Bar styling
  orientation = 'vertical',
  barWidth,
  barGap,
  borderRadius = 0,
  
  // Stacking
  stack = false,
  stackType = 'normal',
  showPercentage = false,
  
  // Label visibility
  showLabels = false,
  showAbsoluteValues = false,
  showPercentageLabels = false,
  
  // Configuration
  xAxis,
  yAxis,
  legend,
  tooltip,
  
  // Sorting
  sortBy = 'none',
  sortOrder = 'asc',
  
  // States
  loading = false,
  disabled: _disabled = false,
  animate = true,
  animationDuration,
  
  // Events
  onChartReady,
  onDataPointClick,
  onDataPointHover,
  
  // Advanced
  customOption,
  responsive: _responsive = true,
  
  ...restProps
}, ref) => {
  
  // Build ECharts option from ergonomic props
  const chartOption = useMemo(() => {
    return buildBarChartOption({
      data: data || undefined,
      categoryField,
      valueField,
      seriesField,
      series,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      orientation,
      barWidth,
      barGap,
      borderRadius,
      stack,
      stackType,
      showPercentage,
      showLabels,
      showAbsoluteValues,
      showPercentageLabels,
      xAxis: xAxis || undefined,
      yAxis: yAxis || undefined,
      legend,
      tooltip,
      sortBy,
      sortOrder,
      animate,
      animationDuration,
      customOption,
    });
  }, [
    data, categoryField, valueField, seriesField, series,
    theme, colorPalette, backgroundColor,
    title, subtitle, titlePosition,
    orientation, barWidth, barGap, borderRadius,
    stack, stackType, showPercentage, showLabels, showAbsoluteValues, showPercentageLabels,
    xAxis, yAxis, legend, tooltip,
    sortBy, sortOrder, animate, animationDuration,
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
    
    const newOption = buildBarChartOption({
      data: newData,
      categoryField,
      valueField,
      seriesField,
      series,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      orientation,
      barWidth,
      barGap,
      borderRadius,
      stack,
      stackType,
      showPercentage,
      showLabels,
      showAbsoluteValues,
      showPercentageLabels,
      xAxis: xAxis || undefined,
      yAxis: yAxis || undefined,
      legend,
      tooltip,
      sortBy,
      sortOrder,
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

BarChart.displayName = 'BarChart';

export { BarChart };