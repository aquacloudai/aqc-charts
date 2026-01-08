import { useRef, useMemo, useCallback, useEffect } from 'react';
import type { RefObject } from 'react';
import type { EChartsType } from 'echarts/core';
import type { ChartRef } from '@/types';
import { useChartInstance } from './echarts/useChartInstance';
import { useChartResize } from './echarts/useChartResize';
import { useChartOptions } from './echarts/useChartOptions';
import { useChartEvents } from './echarts/useChartEvents';

type EventHandler = (params: any, chart: EChartsType) => void;

export interface UseEChartsProps {
  option: unknown;
  theme?: string | Record<string, unknown> | undefined;
  loading?: boolean;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  onChartReady?: ((chart: EChartsType) => void) | undefined;
  events?: Record<string, EventHandler> | undefined;
  debounceResize?: number;
}

export interface UseEChartsReturn extends ChartRef {
  containerRef: RefObject<HTMLDivElement | null>;
  loading: boolean;
  error: Error | null;
}

export function useECharts({
  option,
  theme,
  loading: externalLoading = false,
  notMerge = false,
  lazyUpdate = true,
  onChartReady,
  events,
  debounceResize = 100,
}: UseEChartsProps): UseEChartsReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Manage chart instance
  const {
    chartInstance,
    isInitialized,
    error,
    disposeChart,
  } = useChartInstance({
    containerRef,
    onChartReady,
  });

  // Handle resize
  const { resize } = useChartResize({
    chartInstance,
    containerRef,
    debounceMs: debounceResize,
  });

  // Handle option updates
  useChartOptions({
    chartInstance,
    option,
    theme,
    notMerge,
    lazyUpdate,
  });

  // Handle events
  useChartEvents({
    chartInstance,
    events: events || {},
  });

  // Loading state management
  const isLoading = useMemo(() => {
    return !isInitialized || externalLoading;
  }, [isInitialized, externalLoading]);

  // Show/hide loading
  const showLoading = useCallback(() => {
    if (chartInstance && isInitialized) {
      chartInstance.showLoading('default', {
        text: 'Loading...',
        color: '#1890ff',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0,
      });
    }
  }, [chartInstance, isInitialized]);

  const hideLoading = useCallback(() => {
    if (chartInstance && isInitialized) {
      chartInstance.hideLoading();
    }
  }, [chartInstance, isInitialized]);

  // Handle external loading state
  useEffect(() => {
    if (externalLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [externalLoading, showLoading, hideLoading]);

  // Get ECharts instance
  const getEChartsInstance = useCallback(() => {
    return chartInstance;
  }, [chartInstance]);

  // Refresh chart
  const refresh = useCallback(() => {
    if (chartInstance && option) {
      chartInstance.clear();
      chartInstance.setOption(option as any, { notMerge: true });
    }
  }, [chartInstance, option]);

  // Clear chart
  const clear = useCallback(() => {
    if (chartInstance) {
      chartInstance.clear();
    }
  }, [chartInstance]);

  // Dispose on unmount is handled in useChartInstance

  return {
    containerRef,
    loading: isLoading,
    error,
    resize,
    refresh,
    clear,
    getEChartsInstance,
    showLoading,
    hideLoading,
    dispose: disposeChart,
  };
}