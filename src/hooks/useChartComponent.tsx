import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { EChartsType } from 'echarts/core';
import type { EChartsOption } from 'echarts/types/dist/shared';
import type { BaseErgonomicChartProps, ErgonomicChartRef } from '@/types';
import { useECharts } from './useECharts';
import { useLegendDoubleClick, type LegendClickParams } from './useLegendDoubleClick';
import { addLogoToOption, removeLogoFromOption } from '@/utils/logo';

/**
 * Props for the useChartComponent hook
 */
export interface UseChartComponentProps<TProps extends BaseErgonomicChartProps> {
  /** The chart component props */
  props: TProps;
  /** Function to build ECharts option from props */
  buildOption: (props: TProps) => EChartsOption;
  /** Chart type identifier for debugging */
  chartType?: string;
}

/**
 * Return type for the useChartComponent hook
 */
export interface UseChartComponentReturn {
  /** Ref for the chart container div */
  containerRef: RefObject<HTMLDivElement | null>;
  /** Whether the chart is loading */
  isLoading: boolean;
  /** Error if chart initialization failed */
  error: Error | null;
  /** Container style with proper dimensions */
  containerStyle: React.CSSProperties;
  /** DOM props filtered for safe spreading */
  domProps: Record<string, unknown>;
  /** ECharts instance getter */
  getEChartsInstance: () => EChartsType | null;
  /** Methods to expose via ref */
  refMethods: Omit<ErgonomicChartRef, 'selectSlice' | 'unselectSlice'>;
  /** Render the error state */
  renderError: () => React.ReactNode;
  /** Render the loading overlay */
  renderLoading: () => React.ReactNode;
}

/**
 * Shared hook that consolidates common chart component logic.
 * Eliminates ~400 lines of duplicated code per chart component.
 *
 * @example
 * ```tsx
 * const LineChart = forwardRef<ErgonomicChartRef, LineChartProps>((props, ref) => {
 *   const {
 *     containerRef,
 *     containerStyle,
 *     domProps,
 *     refMethods,
 *     renderError,
 *     renderLoading,
 *     error,
 *   } = useChartComponent({
 *     props,
 *     buildOption: buildLineChartOption,
 *     chartType: 'line',
 *   });
 *
 *   useImperativeHandle(ref, () => refMethods, [refMethods]);
 *
 *   if (error) return renderError();
 *
 *   return (
 *     <div className={`aqc-charts-container ${props.className || ''}`} style={containerStyle} {...domProps}>
 *       <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
 *       {renderLoading()}
 *     </div>
 *   );
 * });
 * ```
 */
export function useChartComponent<TProps extends BaseErgonomicChartProps>({
  props,
  buildOption,
  chartType: _chartType,
}: UseChartComponentProps<TProps>): UseChartComponentReturn {
  const {
    width = '100%',
    height = 400,
    className,
    style,
    theme = 'light',
    loading = false,
    logo,
    backgroundColor,
    onChartReady,
    onDataPointClick,
    onDataPointHover,
    onLegendDoubleClick,
    onSeriesDoubleClick,
    legendDoubleClickDelay = 300,
    enableLegendDoubleClickSelection = true,
    ...restProps
  } = props;

  // Build ECharts option from props - memoized
  const chartOption = useMemo(() => {
    return buildOption(props);
  }, [buildOption, props]);

  // Use the ECharts hook
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

  // Get chart instance for events
  const chartInstance = getEChartsInstance();

  // Setup legend and series double-click handling
  const { handleLegendClick, handleSeriesClick } = useLegendDoubleClick({
    chartInstance,
    onLegendDoubleClick,
    onSeriesDoubleClick,
    delay: legendDoubleClickDelay,
    enableAutoSelection: enableLegendDoubleClickSelection,
  });

  // Stable event handlers - memoized to prevent infinite re-registration
  const stableEventHandlers = useMemo(() => {
    const handlers: Record<string, (params: unknown) => void> = {};

    if (onDataPointClick) {
      handlers.click = (params: unknown) => {
        onDataPointClick(params, { chart: chartInstance, event: params });
      };
    }

    if (onDataPointHover) {
      handlers.mouseover = (params: unknown) => {
        onDataPointHover(params, { chart: chartInstance, event: params });
      };
    }

    return handlers;
  }, [onDataPointClick, onDataPointHover, chartInstance]);

  // Apply events to chart instance
  const eventHandlersRef = useRef<Array<[string, (...args: unknown[]) => void]>>([]);

  useEffect(() => {
    if (!chartInstance) return;

    // Clean up previous handlers
    eventHandlersRef.current.forEach(([event, handler]) => {
      chartInstance.off(event, handler);
    });
    eventHandlersRef.current = [];

    // Register base event handlers
    Object.entries(stableEventHandlers).forEach(([event, handler]) => {
      chartInstance.on(event, handler as (...args: unknown[]) => void);
      eventHandlersRef.current.push([event, handler as (...args: unknown[]) => void]);
    });

    // Add series double-click detection via click
    if (onSeriesDoubleClick || enableLegendDoubleClickSelection) {
      const seriesClickHandler = (params: unknown) => {
        handleSeriesClick(params as LegendClickParams);
      };
      chartInstance.on('click', seriesClickHandler);
      eventHandlersRef.current.push(['click', seriesClickHandler]);
    }

    // Add legend double-click detection
    if (onLegendDoubleClick || enableLegendDoubleClickSelection) {
      const legendHandler = (params: unknown) => {
        handleLegendClick(params as LegendClickParams);
      };
      chartInstance.on('legendselectchanged', legendHandler);
      eventHandlersRef.current.push(['legendselectchanged', legendHandler]);
    }

    return () => {
      eventHandlersRef.current.forEach(([event, handler]) => {
        chartInstance.off(event, handler);
      });
      eventHandlersRef.current = [];
    };
  }, [
    chartInstance,
    stableEventHandlers,
    onSeriesDoubleClick,
    onLegendDoubleClick,
    enableLegendDoubleClickSelection,
    handleSeriesClick,
    handleLegendClick,
  ]);

  // Export image functionality with logo support
  const exportImage = useCallback((
    format: 'png' | 'jpeg' | 'svg' = 'png',
    opts?: { pixelRatio?: number; backgroundColor?: string; excludeComponents?: string[] }
  ): string => {
    const chart = getEChartsInstance();
    if (!chart) return '';

    const chartWidth = typeof width === 'number' ? width : 600;
    const chartHeight = typeof height === 'number' ? height : 400;
    const bgColor = opts?.backgroundColor || backgroundColor || '#fff';

    // If logo should only appear on save, temporarily add it
    if (logo?.onSaveOnly) {
      const currentOption = chart.getOption();
      const optionWithLogo = addLogoToOption(currentOption, logo, chartWidth, chartHeight);

      chart.setOption(optionWithLogo, { notMerge: false, lazyUpdate: false });

      const dataURL = chart.getDataURL({
        type: format,
        pixelRatio: opts?.pixelRatio || 2,
        backgroundColor: bgColor,
        ...(opts?.excludeComponents && { excludeComponents: opts.excludeComponents }),
      });

      // Remove logo after export
      const optionWithoutLogo = removeLogoFromOption(currentOption);
      chart.setOption(optionWithoutLogo, { notMerge: false, lazyUpdate: false });

      return dataURL;
    }

    // Normal export without temporary logo
    return chart.getDataURL({
      type: format,
      pixelRatio: opts?.pixelRatio || 2,
      backgroundColor: bgColor,
      ...(opts?.excludeComponents && { excludeComponents: opts.excludeComponents }),
    });
  }, [getEChartsInstance, logo, width, height, backgroundColor]);

  // Save as image functionality
  const saveAsImage = useCallback((
    filename?: string,
    opts?: { type?: 'png' | 'jpeg' | 'svg'; pixelRatio?: number; backgroundColor?: string; excludeComponents?: string[] }
  ) => {
    const dataURL = exportImage(opts?.type || 'png', opts);
    if (!dataURL) return;

    const link = document.createElement('a');
    link.download = filename || `chart.${opts?.type || 'png'}`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [exportImage]);

  // Highlight functionality
  const highlight = useCallback((dataIndex: number, seriesIndex: number = 0) => {
    const chart = getEChartsInstance();
    if (!chart) return;

    chart.dispatchAction({
      type: 'highlight',
      seriesIndex,
      dataIndex,
    });
  }, [getEChartsInstance]);

  const clearHighlight = useCallback(() => {
    const chart = getEChartsInstance();
    if (!chart) return;

    chart.dispatchAction({
      type: 'downplay',
    });
  }, [getEChartsInstance]);

  // Update data functionality - rebuilds option with new data
  const updateData = useCallback((newData: readonly unknown[]) => {
    const chart = getEChartsInstance();
    if (!chart) return;

    // Rebuild option with new data
    const newOption = buildOption({ ...props, data: newData } as TProps);
    chart.setOption(newOption as EChartsOption);
  }, [getEChartsInstance, buildOption, props]);

  // Container style with minimum dimensions fallback
  const containerStyle = useMemo((): React.CSSProperties => ({
    width,
    height,
    minWidth: typeof width === 'string' && width.includes('%') ? '300px' : undefined,
    minHeight: '300px',
    position: 'relative',
    ...style,
  }), [width, height, style]);

  // Filter DOM props
  const domProps = useMemo(() => {
    const filtered: Record<string, unknown> = {};
    Object.keys(restProps).forEach(key => {
      if (
        key === 'id' ||
        key.startsWith('data-') ||
        key.startsWith('aria-') ||
        key === 'role' ||
        key === 'tabIndex'
      ) {
        filtered[key] = (restProps as Record<string, unknown>)[key];
      }
    });
    return filtered;
  }, [restProps]);

  // Render error state
  const renderError = useCallback(() => (
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
      Error: {error?.message || 'Failed to render chart'}
    </div>
  ), [className, width, height, style, error]);

  // Render loading overlay
  const renderLoading = useCallback(() => {
    if (!chartLoading && !loading) return null;

    return (
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
        <div
          className="aqc-charts-spinner"
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #1890ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px',
          }}
        />
        Loading...
      </div>
    );
  }, [chartLoading, loading]);

  // Methods to expose via ref
  const refMethods = useMemo((): Omit<ErgonomicChartRef, 'selectSlice' | 'unselectSlice'> => ({
    getChart: getEChartsInstance,
    exportImage,
    saveAsImage,
    resize,
    showLoading: (_text?: string) => showLoading(),
    hideLoading,
    highlight,
    clearHighlight,
    updateData,
  }), [
    getEChartsInstance,
    exportImage,
    saveAsImage,
    resize,
    showLoading,
    hideLoading,
    highlight,
    clearHighlight,
    updateData,
  ]);

  return {
    containerRef,
    isLoading: chartLoading || loading,
    error,
    containerStyle,
    domProps,
    getEChartsInstance,
    refMethods,
    renderError,
    renderLoading,
  };
}
