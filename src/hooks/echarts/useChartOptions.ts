import { useEffect, useRef } from 'react';
import type { EChartsType } from 'echarts/core';
import { createChartError, ChartErrorCode } from '@/utils/errors';

// Simple deep comparison for options stability
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
}

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
  const lastOptionRef = useRef<unknown>(null);

  useEffect(() => {
    if (!chartInstance || !option) return;

    // Check if this is a new chart instance (e.g., from theme change)
    const isNewChartInstance = lastChartInstanceRef.current !== chartInstance;
    
    // Check if the option has actually changed (deep comparison)
    const hasOptionChanged = !deepEqual(lastOptionRef.current, option);
    
    if (isNewChartInstance) {
      lastChartInstanceRef.current = chartInstance;
    }

    // Only set options if instance is new OR options have genuinely changed
    if (isNewChartInstance || hasOptionChanged) {
      lastOptionRef.current = option;
      
      try {
        chartInstance.setOption(option as any, { 
          notMerge: isNewChartInstance ? true : notMerge, 
          lazyUpdate 
        });
      } catch (error) {
        const chartError = createChartError(
          error,
          ChartErrorCode.CHART_UPDATE_FAILED,
          { 
            isNewChartInstance,
            notMerge: isNewChartInstance ? true : notMerge,
            lazyUpdate,
            optionKeys: typeof option === 'object' && option !== null 
              ? Object.keys(option as any)
              : 'not-object'
          }
        );
        console.error('Failed to set chart options:', chartError.toDetailedString());
        // Re-throw to allow error boundary to catch it
        throw chartError;
      }
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
        const chartError = createChartError(
          error,
          ChartErrorCode.INVALID_THEME,
          { 
            themeType: typeof theme,
            themeKeys: typeof theme === 'object' ? Object.keys(theme as any) : 'not-object'
          }
        );
        console.error('Failed to apply theme:', chartError.toDetailedString());
        // Don't re-throw theme errors as they're not critical
      }
    }
  }, [chartInstance, theme]);
}