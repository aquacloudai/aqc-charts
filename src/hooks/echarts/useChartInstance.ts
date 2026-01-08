import { useEffect, useRef, useState, useCallback } from 'react';
import type { RefObject } from 'react';
import type { EChartsType } from 'echarts/core';
// Import from our utility to ensure ecStat transforms are registered
import { echarts } from '@/utils/echarts';

interface UseChartInstanceProps {
  containerRef: RefObject<HTMLDivElement | null>;
  onChartReady?: ((chart: EChartsType) => void) | undefined;
}

interface UseChartInstanceReturn {
  chartInstance: EChartsType | null;
  isInitialized: boolean;
  error: Error | null;
  initChart: () => void;
  disposeChart: () => void;
}

export function useChartInstance({
  containerRef,
  onChartReady,
}: UseChartInstanceProps): UseChartInstanceReturn {
  const [chartInstance, setChartInstance] = useState<EChartsType | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Store onChartReady in a ref to avoid dependency issues
  const onChartReadyRef = useRef(onChartReady);
  onChartReadyRef.current = onChartReady;

  // Track if we're mounted to avoid state updates after unmount
  const isMountedRef = useRef(true);

  const disposeChart = useCallback(() => {
    if (chartInstance && !chartInstance.isDisposed?.()) {
      chartInstance.dispose();
    }
  }, [chartInstance]);

  // Initialize chart - synchronous to avoid StrictMode race conditions
  useEffect(() => {
    isMountedRef.current = true;

    const container = containerRef.current;
    if (!container) return;

    // Check if there's already a chart on this container (from StrictMode remount)
    const existingInstance = echarts.getInstanceByDom(container);
    if (existingInstance && !existingInstance.isDisposed?.()) {
      // Reuse existing instance
      setChartInstance(existingInstance as unknown as EChartsType);
      setIsInitialized(true);
      setError(null);
      onChartReadyRef.current?.(existingInstance as unknown as EChartsType);
      return;
    }

    try {
      // Create new chart instance synchronously
      const chart = echarts.init(container, undefined, {
        renderer: 'canvas',
        useDirtyRect: true,
      });

      if (!isMountedRef.current) {
        // Component unmounted during init, dispose immediately
        chart.dispose();
        return;
      }

      setChartInstance(chart as unknown as EChartsType);
      setIsInitialized(true);
      setError(null);
      onChartReadyRef.current?.(chart as unknown as EChartsType);
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsInitialized(false);
      }
    }

    return () => {
      isMountedRef.current = false;
      // Don't dispose here - let echarts manage the instance
      // It will be reused if StrictMode remounts, or garbage collected if truly unmounting
    };
  }, []); // Empty deps - only run on mount

  // Cleanup on true unmount (when container is removed from DOM)
  useEffect(() => {
    return () => {
      const container = containerRef.current;
      if (container) {
        const instance = echarts.getInstanceByDom(container);
        if (instance && !instance.isDisposed?.()) {
          instance.dispose();
        }
      }
    };
  }, []);

  const manualInit = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      const chart = echarts.init(container, undefined, {
        renderer: 'canvas',
        useDirtyRect: true,
      });
      setChartInstance(chart as unknown as EChartsType);
      setIsInitialized(true);
      setError(null);
      onChartReadyRef.current?.(chart as unknown as EChartsType);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, []);

  return {
    chartInstance,
    isInitialized,
    error,
    initChart: manualInit,
    disposeChart,
  };
}
