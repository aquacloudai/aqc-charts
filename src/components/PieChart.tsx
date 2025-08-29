import { forwardRef, useMemo, useImperativeHandle } from 'react';
import type { EChartsType } from 'echarts/core';
import type { PieChartProps, ErgonomicChartRef } from '@/types';
import { useECharts } from '@/hooks/useECharts';
import { buildPieChartOption } from '@/utils/chart-builders';
import { filterDOMProps } from '@/utils/domProps';

/**
 * Ergonomic PieChart component with intuitive props
 * 
 * @example
 * // Simple pie chart with object data
 * <ErgonomicPieChart
 *   data={[
 *     { category: 'Desktop', sales: 4200 },
 *     { category: 'Mobile', sales: 3800 },
 *     { category: 'Tablet', sales: 1200 }
 *   ]}
 *   nameField="category"
 *   valueField="sales"
 *   title="Sales by Platform"
 * />
 * 
 * @example
 * // Donut chart with custom styling
 * <ErgonomicPieChart
 *   data={marketData}
 *   nameField="segment"
 *   valueField="share"
 *   radius={[40, 70]}
 *   title="Market Share"
 *   showPercentages
 *   labelPosition="outside"
 * />
 * 
 * @example
 * // Rose/nightingale chart
 * <ErgonomicPieChart
 *   data={performanceData}
 *   nameField="department"
 *   valueField="score"
 *   roseType
 *   title="Performance by Department"
 *   showLabels
 * />
 */
const PieChart = forwardRef<ErgonomicChartRef, PieChartProps>(({
  // Chart dimensions
  width = '100%',
  height = 400,
  className,
  style,
  
  // Data and field mappings
  data,
  nameField = 'name',
  valueField = 'value',
  
  // Styling
  theme = 'light',
  colorPalette,
  backgroundColor,
  
  // Title
  title,
  subtitle,
  titlePosition = 'center',
  
  // Pie styling
  radius = 75,
  startAngle = 90,
  roseType = false,
  
  // Labels
  showLabels = true,
  labelPosition = 'outside',
  showValues = false,
  showPercentages = true,
  labelFormat,
  
  // Configuration
  legend,
  tooltip,
  
  // Interaction
  selectedMode = false,
  emphasis = true,
  
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
  
  // Filter out chart-specific props to prevent DOM warnings
  const domProps = filterDOMProps(restProps);
  
  // Build ECharts option from ergonomic props
  const chartOption = useMemo(() => {
    return buildPieChartOption({
      data,
      nameField,
      valueField,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      radius,
      startAngle,
      roseType,
      showLabels,
      labelPosition,
      showValues,
      showPercentages,
      labelFormat,
      legend,
      tooltip,
      selectedMode,
      emphasis,
      animate,
      animationDuration,
      customOption,
    });
  }, [
    data, nameField, valueField,
    theme, colorPalette, backgroundColor,
    title, subtitle, titlePosition,
    radius, startAngle, roseType,
    showLabels, labelPosition, showValues, showPercentages, labelFormat,
    legend, tooltip, selectedMode, emphasis,
    animate, animationDuration, customOption
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
  const highlight = (dataIndex: number) => {
    const chart = getEChartsInstance();
    if (!chart) return;
    
    chart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
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
  
  // Select/unselect slice functionality
  const selectSlice = (dataIndex: number) => {
    const chart = getEChartsInstance();
    if (!chart) return;
    
    chart.dispatchAction({
      type: 'pieSelect',
      seriesIndex: 0,
      dataIndex,
    });
  };
  
  const unselectSlice = (dataIndex: number) => {
    const chart = getEChartsInstance();
    if (!chart) return;
    
    chart.dispatchAction({
      type: 'pieUnSelect',
      seriesIndex: 0,
      dataIndex,
    });
  };
  
  // Update data functionality
  const updateData = (newData: readonly any[]) => {
    const chart = getEChartsInstance();
    if (!chart) return;
    
    const newOption = buildPieChartOption({
      data: newData,
      nameField,
      valueField,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      radius,
      startAngle,
      roseType,
      showLabels,
      labelPosition,
      showValues,
      showPercentages,
      labelFormat,
      legend,
      tooltip,
      selectedMode,
      emphasis,
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
    selectSlice,
    unselectSlice,
  }), [getEChartsInstance, exportImage, resize, showLoading, hideLoading, highlight, clearHighlight, updateData, selectSlice, unselectSlice]);
  
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
  
  // Container style with minimum dimensions fallback
  const containerStyle = useMemo(() => ({
    width,
    height,
    // Add min dimensions when using percentage width to prevent zero-size containers
    minWidth: typeof width === 'string' && width.includes('%') ? '300px' : undefined,
    minHeight: '300px', // Always ensure minimum height
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

PieChart.displayName = 'PieChart';

export { PieChart };