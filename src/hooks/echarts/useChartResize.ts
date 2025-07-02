import { useEffect, useCallback, useRef } from 'react';
import type { RefObject } from 'react';
import type { EChartsType } from 'echarts/core';

interface UseChartResizeProps {
  chartInstance: EChartsType | null;
  containerRef: RefObject<HTMLDivElement | null>;
  debounceMs?: number;
}

export function useChartResize({
  chartInstance,
  containerRef,
  debounceMs = 100,
}: UseChartResizeProps) {
  const resizeTimeoutRef = useRef<number | undefined>(undefined);

  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current !== undefined) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      if (chartInstance) {
        try {
          chartInstance.resize();
        } catch (error) {
          console.warn('Failed to resize chart:', error);
        }
      }
    }, debounceMs) as any;
  }, [chartInstance, debounceMs]);

  // Use ResizeObserver for better performance
  useEffect(() => {
    if (!containerRef.current || !chartInstance) return;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Also handle window resize as fallback
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current !== undefined) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [containerRef, chartInstance, handleResize]);

  return { resize: handleResize };
}