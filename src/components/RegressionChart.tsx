import { forwardRef, useMemo, useImperativeHandle } from 'react';
import type { EChartsType } from 'echarts/core';
import type { RegressionChartProps, ErgonomicChartRef } from '@/types';
import { useECharts } from '@/hooks/useECharts';
import { buildRegressionChartOption } from '@/utils/chart-builders';

/**
 * Ergonomic RegressionChart component with intuitive props
 * 
 * @example
 * // Simple regression chart with array data
 * <RegressionChart
 *   data={[
 *     [1, 2], [2, 4], [3, 6], [4, 8], [5, 10]
 *   ]}
 *   method="linear"
 *   title="Linear Regression"
 * />
 * 
 * @example
 * // Regression chart with object data
 * <RegressionChart
 *   data={[
 *     { x: 1, y: 2.1 },
 *     { x: 2, y: 3.9 },
 *     { x: 3, y: 6.2 },
 *     { x: 4, y: 7.8 },
 *     { x: 5, y: 10.1 }
 *   ]}
 *   xField="x"
 *   yField="y"
 *   method="linear"
 *   showEquation={true}
 *   equationPosition="top-left"
 * />
 * 
 * @example
 * // Polynomial regression with custom styling
 * <RegressionChart
 *   data={polynomialData}
 *   method="polynomial"
 *   order={3}
 *   pointSize={10}
 *   lineWidth={3}
 *   lineColor="#ff6b6b"
 *   showEquation={true}
 *   showRSquared={true}
 * />
 */
const RegressionChart = forwardRef<ErgonomicChartRef, RegressionChartProps>(({
  // Chart dimensions
  width = '100%',
  height = 400,
  className,
  style,
  
  // Data and field mappings
  data,
  xField = 'x',
  yField = 'y',
  
  // Regression configuration
  method = 'linear',
  order = 2,
  
  // Styling
  theme = 'light',
  colorPalette,
  backgroundColor,
  
  // Title
  title,
  subtitle,
  titlePosition = 'center',
  
  // Point styling
  pointSize = 8,
  pointShape = 'circle',
  pointOpacity = 0.7,
  showPoints = true,
  
  // Line styling
  lineWidth = 2,
  lineStyle = 'solid',
  lineColor,
  lineOpacity = 1,
  showLine = true,
  
  // Equation display
  showEquation = false,
  equationPosition = 'top-right',
  showRSquared = true,
  equationFormatter,
  
  // Configuration
  xAxis,
  yAxis,
  legend,
  tooltip,
  
  // Labels
  pointsLabel = 'Data Points',
  regressionLabel = 'Regression Line',
  
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
    return buildRegressionChartOption({
      data: data || [],
      xField,
      yField,
      method,
      order,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      pointSize,
      pointShape,
      pointOpacity,
      showPoints,
      lineWidth,
      lineStyle,
      lineColor,
      lineOpacity,
      showLine,
      showEquation,
      equationPosition,
      showRSquared,
      equationFormatter,
      xAxis: xAxis || undefined,
      yAxis: yAxis || undefined,
      legend,
      tooltip,
      pointsLabel,
      regressionLabel,
      animate,
      animationDuration,
      customOption,
    });
  }, [
    data, xField, yField, method, order,
    theme, colorPalette, backgroundColor,
    title, subtitle, titlePosition,
    pointSize, pointShape, pointOpacity, showPoints,
    lineWidth, lineStyle, lineColor, lineOpacity, showLine,
    showEquation, equationPosition, showRSquared, equationFormatter,
    xAxis, yAxis, legend, tooltip,
    pointsLabel, regressionLabel, animate, animationDuration,
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
    
    const newOption = buildRegressionChartOption({
      data: newData,
      xField,
      yField,
      method,
      order,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      pointSize,
      pointShape,
      pointOpacity,
      showPoints,
      lineWidth,
      lineStyle,
      lineColor,
      lineOpacity,
      showLine,
      showEquation,
      equationPosition,
      showRSquared,
      equationFormatter,
      xAxis: xAxis || undefined,
      yAxis: yAxis || undefined,
      legend,
      tooltip,
      pointsLabel,
      regressionLabel,
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

RegressionChart.displayName = 'RegressionChart';

export { RegressionChart };