import { useEffect, useRef, useState, useCallback } from 'react';
import type { RefObject } from 'react';
import type { EChartsType } from 'echarts/core';
import { loadECharts } from '@/utils/EChartsLoader';
import { ChartInitError, ChartErrorCode, createChartError } from '@/utils/errors';

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
    if (!containerRef.current) {
      const error = createChartError(
        new Error('Container element not found'),
        ChartErrorCode.CONTAINER_NOT_FOUND,
        { containerRef: !!containerRef.current }
      );
      setError(error);
      return;
    }

    try {
      // Load ECharts dynamically
      const echarts = await loadECharts();

      // Dispose existing instance
      disposeChart();

      // Verify container still exists after async operation
      if (!containerRef.current) {
        throw new ChartInitError(
          new Error('Container element was removed during initialization'),
          { phase: 'post-load' }
        );
      }

      // Check container dimensions - if zero, wait a bit for layout to complete
      let rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        // Wait a short time for CSS/layout to apply, then check again
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Check again after waiting
        if (!containerRef.current) {
          throw new ChartInitError(
            new Error('Container element was removed during dimension check'),
            { phase: 'dimension-check' }
          );
        }
        
        rect = containerRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          console.warn('AQC Charts: Container still has zero dimensions after layout delay', {
            width: rect.width,
            height: rect.height,
            suggestion: 'Consider setting explicit width/height on the chart or its parent container'
          });
        }
      }

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

      if (!chart) {
        throw new ChartInitError(
          new Error('ECharts.init returned null or undefined'),
          { 
            containerDimensions: { width: rect.width, height: rect.height },
            containerElement: containerRef.current.tagName
          }
        );
      }

      chartRef.current = chart;
      setIsInitialized(true);
      setError(null);
      onChartReady?.(chart);
    } catch (err) {
      const error = err instanceof ChartInitError ? err : createChartError(
        err,
        ChartErrorCode.CHART_INIT_FAILED,
        { 
          containerExists: !!containerRef.current,
          containerDimensions: containerRef.current ? {
            width: containerRef.current.getBoundingClientRect().width,
            height: containerRef.current.getBoundingClientRect().height
          } : null
        }
      );
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