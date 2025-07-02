import { useEffect, useRef } from 'react';
import type { EChartsType } from 'echarts/core';

interface UseChartOptionsProps {
  chartInstance: EChartsType | null;
  option: unknown;
  theme?: string | object | undefined;
  notMerge?: boolean;
  lazyUpdate?: boolean;
}

export function useChartOptions({
  chartInstance,
  option,
  theme,
  notMerge = true,
  lazyUpdate = true,
}: UseChartOptionsProps) {
  const lastChartInstanceRef = useRef<EChartsType | null>(null);

  useEffect(() => {
    if (!chartInstance || !option) return;

    // Check if this is a new chart instance (e.g., from theme change)
    const isNewChartInstance = lastChartInstanceRef.current !== chartInstance;
    
    if (isNewChartInstance) {
      lastChartInstanceRef.current = chartInstance;
    }

    // Always set options when chart instance or options change
    try {
      chartInstance.setOption(option as any, { 
        notMerge: isNewChartInstance ? true : notMerge, 
        lazyUpdate 
      });
    } catch (error) {
      console.error('Failed to set chart options:', error);
    }
  }, [chartInstance, option, notMerge, lazyUpdate]);

  // Handle theme changes - for string themes, the chart instance will reinitialize
  // For object themes, merge with current options
  useEffect(() => {
    if (!chartInstance || !theme) return;

    // Only handle object themes here since string themes trigger chart reinitialization
    if (typeof theme === 'object') {
      try {
        const currentOption = chartInstance.getOption();
        if (currentOption && typeof currentOption === 'object') {
          const themedOption = { ...currentOption as any, ...theme };
          chartInstance.setOption(themedOption as any, { notMerge: true });
        }
      } catch (error) {
        console.error('Failed to apply theme:', error);
      }
    }
  }, [chartInstance, theme]);
}