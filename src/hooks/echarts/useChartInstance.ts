import { useEffect, useRef, useState, useCallback } from 'react';
import type { RefObject } from 'react';
import type { EChartsType } from 'echarts/core';
import { loadECharts } from '@/utils/EChartsLoader';

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
  const chartRef = useRef<EChartsType | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const disposeChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.dispose();
      chartRef.current = null;
      setIsInitialized(false);
    }
  }, []);

  const initChart = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      // Load ECharts dynamically
      const echarts = await loadECharts();

      // Dispose existing instance
      disposeChart();

      // Create new instance without built-in theme
      // We handle theming through our comprehensive option-based approach
      const chart = echarts.init(
        containerRef.current,
        undefined, // No built-in theme - we use options for full control
        {
          renderer: 'canvas',
          useDirtyRect: true,
        }
      );
      chartRef.current = chart;
      setIsInitialized(true);
      setError(null);
      onChartReady?.(chart);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize chart');
      setError(error);
      setIsInitialized(false);
      console.error('Failed to initialize ECharts:', error);
    }
  }, [containerRef, onChartReady, disposeChart]);

  // Initialize chart when container is ready 
  // Theme changes are handled via options, not chart reinitialization
  useEffect(() => {
    if (containerRef.current) {
      initChart();
    }

    return () => {
      disposeChart();
    };
  }, [initChart, disposeChart]); // Removed theme dependency - we handle theming via options

  return {
    chartInstance: chartRef.current,
    isInitialized,
    error,
    initChart,
    disposeChart,
  };
}