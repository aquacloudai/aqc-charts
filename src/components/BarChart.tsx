import React, { forwardRef, useMemo, useImperativeHandle, useEffect } from 'react';
import type { EChartsType } from 'echarts/core';
import type { BarChartProps, ErgonomicChartRef } from '@/types';
import { useECharts } from '@/hooks/useECharts';
import { useLegendDoubleClick } from '@/hooks/useLegendDoubleClick';
import { buildBarChartOption } from '@/utils/chart-builders';
import { filterDOMProps } from '@/utils/domProps';

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

  // Logo
  logo,

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
  onLegendDoubleClick,
  onSeriesDoubleClick,
  legendDoubleClickDelay,
  enableLegendDoubleClickSelection = true,

  // Advanced
  customOption,
  responsive: _responsive = true,

  ...restProps
}, ref) => {

  // Filter out chart-specific props from restProps to avoid React DOM warnings
  const domProps = filterDOMProps(restProps);

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
      ...(logo && { logo }),
      ...(width && { width }),
      ...(height && { height }),
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
    title, subtitle, titlePosition, logo, width, height,
    orientation, barWidth, barGap, borderRadius,
    stack, stackType, showPercentage, showLabels, showAbsoluteValues, showPercentageLabels,
    xAxis, yAxis, legend, tooltip,
    sortBy, sortOrder, animate, animationDuration,
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
    enableAutoSelection: enableLegendDoubleClickSelection || false,
  });

  // Handle data point interactions and legend events
  const chartEvents = useMemo(() => {
    const events: Record<string, any> = {};

    if (onDataPointClick) {
      events.click = (params: any, chart: EChartsType) => {
        onDataPointClick(params, { chart, event: params });
      };
    }

    // Add series double-click detection via click event
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

  // Export image functionality with logo support
  const exportImage = (format: 'png' | 'jpeg' | 'svg' = 'png', opts?: { pixelRatio?: number; backgroundColor?: string; excludeComponents?: string[] }): string => {
    const chart = getEChartsInstance();
    if (!chart) return '';

    // If logo should only appear on save, temporarily add it
    if (logo?.onSaveOnly) {
      const currentOption = chart.getOption();
      const chartWidth = typeof width === 'number' ? width : 600;
      const chartHeight = typeof height === 'number' ? height : 400;

      // Add logo to option
      const logoGraphic = {
        type: 'image',
        style: {
          image: logo.src,
          x: logo.x !== undefined ? logo.x : (logo.position === 'bottom-right' ? chartWidth - (logo.width || 100) - 10 : 10),
          y: logo.y !== undefined ? logo.y : (logo.position === 'bottom-right' ? chartHeight - (logo.height || 50) - 10 : 10),
          width: logo.width || 100,
          height: logo.height || 50,
          opacity: logo.opacity || 1,
        },
        z: 1000,
        silent: true,
      };

      const optionWithLogo = {
        ...currentOption,
        graphic: [
          ...(Array.isArray(currentOption.graphic) ? currentOption.graphic : currentOption.graphic ? [currentOption.graphic] : []),
          logoGraphic,
        ],
      };

      chart.setOption(optionWithLogo, { notMerge: false, lazyUpdate: false });

      const dataURL = chart.getDataURL({
        type: format,
        pixelRatio: opts?.pixelRatio || 2,
        backgroundColor: opts?.backgroundColor || backgroundColor || '#fff',
        ...(opts?.excludeComponents && { excludeComponents: opts.excludeComponents }),
      });

      // Remove logo after export
      const filteredGraphics = Array.isArray(currentOption.graphic)
        ? currentOption.graphic.filter((g: any) => g.type !== 'image')
        : (currentOption.graphic && (currentOption.graphic as any).type !== 'image') ? [currentOption.graphic] : [];

      const optionWithoutLogo = {
        ...currentOption,
        graphic: filteredGraphics.length > 0 ? filteredGraphics : undefined,
      };
      chart.setOption(optionWithoutLogo, { notMerge: false, lazyUpdate: false });

      return dataURL;
    }

    // Normal export without temporary logo
    return chart.getDataURL({
      type: format,
      pixelRatio: opts?.pixelRatio || 2,
      backgroundColor: opts?.backgroundColor || backgroundColor || '#fff',
      ...(opts?.excludeComponents && { excludeComponents: opts.excludeComponents }),
    });
  };

  // Save as image functionality
  const saveAsImage = (filename?: string, opts?: { type?: 'png' | 'jpeg' | 'svg'; pixelRatio?: number; backgroundColor?: string; excludeComponents?: string[] }) => {
    const dataURL = exportImage(opts?.type || 'png', opts);
    if (!dataURL) return;

    // Create download link
    const link = document.createElement('a');
    link.download = filename || `chart.${opts?.type || 'png'}`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    saveAsImage,
    resize,
    showLoading: () => showLoading(),
    hideLoading,
    highlight,
    clearHighlight,
    updateData,
  }), [getEChartsInstance, exportImage, saveAsImage, resize, showLoading, hideLoading, highlight, clearHighlight, updateData]);

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

BarChart.displayName = 'BarChart';

export { BarChart };