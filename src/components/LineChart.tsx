import { forwardRef, useMemo, useImperativeHandle } from 'react';
import type { EChartsType } from 'echarts/core';
import type { LineChartProps, ErgonomicChartRef } from '@/types';
import { useECharts } from '@/hooks/useECharts';
import { buildLineChartOption } from '@/utils/chart-builders';

/**
 * Ergonomic LineChart component with intuitive props
 * 
 * @example
 * // Simple line chart with object data
 * <ErgonomicLineChart
 *   data={[
 *     { month: 'Jan', sales: 100, profit: 20 },
 *     { month: 'Feb', sales: 120, profit: 25 },
 *     { month: 'Mar', sales: 110, profit: 22 }
 *   ]}
 *   xField="month"
 *   yField={['sales', 'profit']}
 *   smooth
 *   showArea
 * />
 * 
 * @example
 * // Multiple series with explicit configuration
 * <ErgonomicLineChart
 *   series={[
 *     {
 *       name: 'Sales',
 *       data: [{ date: '2023-01', value: 100 }, { date: '2023-02', value: 120 }],
 *       color: '#ff6b6b',
 *       smooth: true
 *     },
 *     {
 *       name: 'Profit',
 *       data: [{ date: '2023-01', value: 20 }, { date: '2023-02', value: 25 }],
 *       color: '#4ecdc4'
 *     }
 *   ]}
 *   xField="date"
 *   yField="value"
 * />
 */
const LineChart = forwardRef<ErgonomicChartRef, LineChartProps>(({
  // Chart dimensions
  width = '100%',
  height = 400,
  className,
  style,
  
  // Data and field mappings
  data,
  xField = 'x',
  yField = 'y',
  seriesField,
  series,
  seriesConfig,
  
  // Styling
  theme = 'light',
  colorPalette,
  backgroundColor,
  
  // Title
  title,
  subtitle,
  titlePosition = 'center',
  
  // Line styling
  smooth = false,
  strokeWidth = 2,
  strokeStyle = 'solid',
  showPoints = true,
  pointSize = 4,
  pointShape = 'circle',
  
  // Area
  showArea = false,
  areaOpacity = 0.3,
  areaGradient = false,
  
  // Configuration
  xAxis,
  yAxis,
  legend,
  tooltip,
  
  // Interaction
  zoom = false,
  pan = false,
  brush = false,
  
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
    return buildLineChartOption({
      data: data || undefined,
      xField,
      yField,
      seriesField,
      series,
      seriesConfig,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      smooth,
      strokeWidth,
      strokeStyle,
      showPoints,
      pointSize,
      pointShape,
      showArea,
      areaOpacity,
      areaGradient,
      xAxis: xAxis || undefined,
      yAxis: yAxis || undefined,
      legend,
      tooltip,
      zoom,
      pan,
      brush,
      animate,
      animationDuration,
      customOption,
    });
  }, [
    data, xField, yField, seriesField, series, seriesConfig,
    theme, colorPalette, backgroundColor,
    title, subtitle, titlePosition,
    smooth, strokeWidth, strokeStyle, showPoints, pointSize, pointShape,
    showArea, areaOpacity, areaGradient,
    xAxis, yAxis, legend, tooltip,
    zoom, pan, brush, animate, animationDuration,
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
    
    const newOption = buildLineChartOption({
      data: newData,
      xField,
      yField,
      seriesField: seriesField || undefined,
      series,
      seriesConfig,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      smooth,
      strokeWidth,
      strokeStyle,
      showPoints,
      pointSize,
      pointShape,
      showArea,
      areaOpacity,
      areaGradient,
      xAxis: xAxis || undefined,
      yAxis: yAxis || undefined,
      legend,
      tooltip,
      zoom,
      pan,
      brush,
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

LineChart.displayName = 'LineChart';

export { LineChart };