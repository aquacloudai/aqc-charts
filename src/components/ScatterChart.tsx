import { forwardRef, useMemo, useImperativeHandle } from 'react';
import type { EChartsType } from 'echarts/core';
import type { ScatterChartProps, ErgonomicChartRef } from '@/types';
import { useECharts } from '@/hooks/useECharts';
import { buildScatterChartOption } from '@/utils/ergonomic';

/**
 * Ergonomic ScatterChart component with intuitive props
 * 
 * @example
 * // Simple scatter plot with object data
 * <ScatterChart
 *   data={[
 *     { x: 10, y: 20 },
 *     { x: 15, y: 25 },
 *     { x: 20, y: 18 }
 *   ]}
 *   xField="x"
 *   yField="y"
 *   pointSize={8}
 * />
 * 
 * @example
 * // Bubble chart with size dimension
 * <ScatterChart
 *   data={[
 *     { sales: 100, profit: 20, employees: 50 },
 *     { sales: 120, profit: 25, employees: 60 },
 *     { sales: 110, profit: 18, employees: 45 }
 *   ]}
 *   xField="sales"
 *   yField="profit"
 *   sizeField="employees"
 *   pointSize={[5, 30]}
 * />
 * 
 * @example
 * // Multiple series with explicit configuration
 * <ScatterChart
 *   series={[
 *     {
 *       name: 'Dataset A',
 *       data: [{ x: 10, y: 20 }, { x: 15, y: 25 }],
 *       color: '#ff6b6b',
 *       pointSize: 10
 *     },
 *     {
 *       name: 'Dataset B',
 *       data: [{ x: 5, y: 12 }, { x: 8, y: 18 }],
 *       color: '#4ecdc4',
 *       pointShape: 'square'
 *     }
 *   ]}
 *   xField="x"
 *   yField="y"
 * />
 */
const ScatterChart = forwardRef<ErgonomicChartRef, ScatterChartProps>(({
  // Chart dimensions
  width = '100%',
  height = 400,
  className,
  style,
  
  // Data and field mappings
  data,
  xField = 'x',
  yField = 'y',
  sizeField,
  colorField,
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
  
  // Point styling
  pointSize = 10,
  pointShape = 'circle',
  pointOpacity = 0.8,
  
  // Configuration
  xAxis,
  yAxis,
  legend,
  tooltip,
  
  // Regression line
  showTrendline = false,
  trendlineType = 'linear',
  
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
    const optionProps: any = {
      data: data || [],
      xField,
      yField,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      pointSize,
      pointShape,
      pointOpacity,
      animate,
      animationDuration,
      customOption,
    };
    
    // Only add optional fields if they have values
    if (sizeField) optionProps.sizeField = sizeField;
    if (colorField) optionProps.colorField = colorField;
    if (seriesField) optionProps.seriesField = seriesField;
    if (series) optionProps.series = series;
    if (xAxis) optionProps.xAxis = xAxis;
    if (yAxis) optionProps.yAxis = yAxis;
    if (legend) optionProps.legend = legend;
    if (tooltip) optionProps.tooltip = tooltip;
    if (showTrendline) optionProps.showTrendline = showTrendline;
    if (trendlineType) optionProps.trendlineType = trendlineType;
    
    return buildScatterChartOption(optionProps);
  }, [
    data, xField, yField, sizeField, colorField, seriesField, series,
    theme, colorPalette, backgroundColor,
    title, subtitle, titlePosition,
    pointSize, pointShape, pointOpacity,
    xAxis, yAxis, legend, tooltip,
    showTrendline, trendlineType, animate, animationDuration,
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
    
    const optionProps: any = {
      data: newData,
      xField,
      yField,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      pointSize,
      pointShape,
      pointOpacity,
      animate,
      animationDuration,
      customOption,
    };
    
    // Only add optional fields if they have values
    if (sizeField) optionProps.sizeField = sizeField;
    if (colorField) optionProps.colorField = colorField;
    if (seriesField) optionProps.seriesField = seriesField;
    if (series) optionProps.series = series;
    if (xAxis) optionProps.xAxis = xAxis;
    if (yAxis) optionProps.yAxis = yAxis;
    if (legend) optionProps.legend = legend;
    if (tooltip) optionProps.tooltip = tooltip;
    if (showTrendline) optionProps.showTrendline = showTrendline;
    if (trendlineType) optionProps.trendlineType = trendlineType;
    
    const newOption = buildScatterChartOption(optionProps);
    
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

ScatterChart.displayName = 'ScatterChart';

export { ScatterChart };