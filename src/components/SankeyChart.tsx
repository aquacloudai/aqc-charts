import { forwardRef, useMemo, useImperativeHandle } from 'react';
import type { EChartsType } from 'echarts/core';
import type { SankeyChartProps, ErgonomicChartRef } from '@/types';
import { useECharts } from '@/hooks/useECharts';
import { buildSankeyChartOption } from '@/utils/chart-builders';

/**
 * Ergonomic SankeyChart component with intuitive props
 * 
 * @example
 * // Simple sankey chart with nodes and links data structure
 * <SankeyChart
 *   data={{
 *     nodes: [
 *       { name: 'a' },
 *       { name: 'b' },
 *       { name: 'c' }
 *     ],
 *     links: [
 *       { source: 'a', target: 'b', value: 10 },
 *       { source: 'b', target: 'c', value: 15 }
 *     ]
 *   }}
 *   title="Flow Diagram"
 * />
 * 
 * @example
 * // Sankey chart with flat data structure
 * <SankeyChart
 *   data={[
 *     { source: 'Product A', target: 'Sales', value: 120 },
 *     { source: 'Product B', target: 'Sales', value: 80 },
 *     { source: 'Sales', target: 'Profit', value: 150 }
 *   ]}
 *   sourceField="source"
 *   targetField="target"
 *   valueField="value"
 *   orient="horizontal"
 *   nodeAlign="left"
 * />
 * 
 * @example
 * // Highly customized sankey chart
 * <SankeyChart
 *   nodes={[
 *     { name: 'Revenue', value: 1000 },
 *     { name: 'Costs', value: 400 },
 *     { name: 'Profit', value: 600 }
 *   ]}
 *   links={[
 *     { source: 'Revenue', target: 'Costs', value: 400 },
 *     { source: 'Revenue', target: 'Profit', value: 600 }
 *   ]}
 *   nodeColors={['#5470c6', '#91cc75', '#fac858']}
 *   linkColors={['#ff6b6b', '#4ecdc4']}
 *   linkOpacity={0.8}
 *   linkCurveness={0.7}
 *   showNodeValues
 *   showLinkLabels
 * />
 */
const SankeyChart = forwardRef<ErgonomicChartRef, SankeyChartProps>(({
  // Chart dimensions
  width = '100%',
  height = 400,
  className,
  style,
  
  // Data and field mappings
  data,
  sourceField = 'source',
  targetField = 'target',
  valueField = 'value',
  nodeNameField,
  nodes,
  links,
  
  // Styling
  theme = 'light',
  colorPalette,
  backgroundColor,
  
  // Title
  title,
  subtitle,
  titlePosition = 'center',
  
  // Layout configuration
  layout = 'none',
  orient = 'horizontal',
  nodeAlign = 'justify',
  nodeGap = 8,
  nodeWidth = 20,
  iterations = 32,
  
  // Node styling
  nodeColors,
  showNodeValues = false,
  nodeLabels = true,
  nodeLabelPosition,
  
  // Link styling
  linkColors,
  linkOpacity = 0.6,
  linkCurveness = 0.5,
  showLinkLabels = false,
  
  // Focus and emphasis
  focusMode = 'adjacency',
  blurScope,
  
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
  
  // Advanced
  customOption,
  responsive: _responsive = true,
  
  ...restProps
}, ref) => {
  
  // Build ECharts option from ergonomic props
  const chartOption = useMemo(() => {
    return buildSankeyChartOption({
      data: data || undefined,
      sourceField,
      targetField,
      valueField,
      nodeNameField,
      nodes,
      links,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      layout,
      orient,
      nodeAlign,
      nodeGap,
      nodeWidth,
      iterations,
      nodeColors,
      showNodeValues,
      nodeLabels,
      nodeLabelPosition,
      linkColors,
      linkOpacity,
      linkCurveness,
      showLinkLabels,
      focusMode,
      blurScope,
      legend,
      tooltip,
      animate,
      animationDuration,
      customOption,
    });
  }, [
    data, sourceField, targetField, valueField, nodeNameField, nodes, links,
    theme, colorPalette, backgroundColor,
    title, subtitle, titlePosition,
    layout, orient, nodeAlign, nodeGap, nodeWidth, iterations,
    nodeColors, showNodeValues, nodeLabels, nodeLabelPosition,
    linkColors, linkOpacity, linkCurveness, showLinkLabels,
    focusMode, blurScope, legend, tooltip, animate, animationDuration,
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
  
  // Highlight functionality for nodes and links
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
  
  // Focus on specific node functionality
  const focusNode = (nodeName: string) => {
    const chart = getEChartsInstance();
    if (!chart) return;
    
    // Find the node index
    const option = chart.getOption() as any;
    const series = option.series?.[0];
    if (!series?.data) return;
    
    const nodeIndex = series.data.findIndex((node: any) => node.name === nodeName);
    if (nodeIndex >= 0) {
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: nodeIndex,
      });
    }
  };
  
  // Update data functionality
  const updateData = (newData: any) => {
    const chart = getEChartsInstance();
    if (!chart) return;
    
    const newOption = buildSankeyChartOption({
      data: newData,
      sourceField,
      targetField,
      valueField,
      nodeNameField,
      nodes,
      links,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      layout,
      orient,
      nodeAlign,
      nodeGap,
      nodeWidth,
      iterations,
      nodeColors,
      showNodeValues,
      nodeLabels,
      nodeLabelPosition,
      linkColors,
      linkOpacity,
      linkCurveness,
      showLinkLabels,
      focusMode,
      blurScope,
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
    // Sankey-specific methods
    focusNode,
  }), [getEChartsInstance, exportImage, resize, showLoading, hideLoading, highlight, clearHighlight, updateData, focusNode]);
  
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

SankeyChart.displayName = 'SankeyChart';

export { SankeyChart };