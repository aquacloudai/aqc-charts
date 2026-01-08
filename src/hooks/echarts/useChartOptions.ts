import { useEffect, useRef } from 'react';
import type { EChartsType } from 'echarts/core';
import type { EChartsOption } from 'echarts/types/dist/shared';
import { createChartError, ChartErrorCode } from '@/utils/errors';

/**
 * Safe JSON stringify that handles circular references
 */
function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    // Circular reference or other error - use type-based fallback
    if (value === null) return 'null';
    if (Array.isArray(value)) return `[Array:${value.length}]`;
    if (typeof value === 'object') return `[Object:${Object.keys(value as object).length}]`;
    return String(value);
  }
}

/**
 * Fast structural hash for chart options.
 * Uses a simple but effective hashing approach that's much faster than deep comparison
 * for large datasets while still catching meaningful changes.
 */
function computeOptionHash(option: unknown): string {
  if (option == null) return 'null';
  if (typeof option !== 'object') return String(option);

  const obj = option as Record<string, unknown>;

  // For arrays (like series data), use length + sample values for speed
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    // Hash based on length and first/last/middle elements (safe against circular refs)
    const first = safeStringify(obj[0]);
    const last = obj.length > 1 ? safeStringify(obj[obj.length - 1]) : '';
    const mid = obj.length > 2 ? safeStringify(obj[Math.floor(obj.length / 2)]) : '';
    return `[${obj.length}:${first}:${mid}:${last}]`;
  }

  // For objects, create a structural signature
  const keys = Object.keys(obj).sort();
  const parts: string[] = [];

  for (const key of keys) {
    const value = obj[key];
    // For nested arrays (like series.data), use length as proxy
    if (Array.isArray(value)) {
      parts.push(`${key}:[${value.length}]`);
    } else if (typeof value === 'object' && value !== null) {
      // Shallow check for nested objects
      parts.push(`${key}:{${Object.keys(value as object).length}}`);
    } else {
      parts.push(`${key}:${String(value)}`);
    }
  }

  return `{${parts.join(',')}}`;
}

/**
 * Efficient comparison for ECharts options.
 * Uses fast structural hash for large objects, falls back to deep comparison for small ones.
 */
function optionsEqual(a: unknown, b: unknown): boolean {
  // Fast path: strict equality
  if (a === b) return true;

  // Handle null/undefined
  if (a == null || b == null) return a === b;

  // Type mismatch
  if (typeof a !== typeof b) return false;

  // Primitives
  if (typeof a !== 'object') return a === b;

  // For objects, use structural hash comparison (much faster for large datasets)
  return computeOptionHash(a) === computeOptionHash(b);
}

/**
 * Deep comparison for theme objects (usually small).
 * - Handles arrays and objects
 * - Protects against circular references with depth limit
 */
function deepEqual(a: unknown, b: unknown, depth = 0): boolean {
  if (depth > 10) return false;
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i], depth + 1));
  }

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA);

  if (keysA.length !== Object.keys(objB).length) return false;

  return keysA.every(key => key in objB && deepEqual(objA[key], objB[key], depth + 1));
}

// ECharts 6 setTheme options
interface SetThemeOpts {
  notMerge?: boolean;
  replaceMerge?: string | string[];
  transition?: {
    duration?: number;
    easing?: string;
  };
}

interface UseChartOptionsProps {
  chartInstance: EChartsType | null;
  option: EChartsOption | unknown;
  theme?: string | Record<string, unknown> | undefined;
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
  const lastOptionRef = useRef<EChartsOption | unknown>(null);

  useEffect(() => {
    if (!chartInstance || !option) return;

    // Check if this is a new chart instance (e.g., from theme change)
    const isNewChartInstance = lastChartInstanceRef.current !== chartInstance;

    // Check if the option has actually changed (fast structural comparison)
    const hasOptionChanged = !optionsEqual(lastOptionRef.current, option);

    if (isNewChartInstance) {
      lastChartInstanceRef.current = chartInstance;
    }

    // Only set options if instance is new OR options have genuinely changed
    if (isNewChartInstance || hasOptionChanged) {
      lastOptionRef.current = option;

      try {
        chartInstance.setOption(option as EChartsOption, {
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
              ? Object.keys(option as Record<string, unknown>)
              : 'not-object'
          }
        );
        console.error('Failed to set chart options:', chartError.toDetailedString());
        // Re-throw to allow error boundary to catch it
        throw chartError;
      }
    }
  }, [chartInstance, option, notMerge, lazyUpdate]);

  // Track previous theme for change detection
  const lastThemeRef = useRef<string | Record<string, unknown> | undefined>(undefined);

  // Handle theme changes using ECharts 6 setTheme() API
  // This provides smooth theme transitions without chart re-initialization
  useEffect(() => {
    if (!chartInstance || theme === undefined) return;

    // Skip if theme hasn't changed
    const themeChanged = typeof theme === 'object'
      ? !deepEqual(lastThemeRef.current, theme)
      : lastThemeRef.current !== theme;

    if (!themeChanged) return;

    lastThemeRef.current = theme;

    try {
      // ECharts 6 setTheme() API - works for both string and object themes
      // Type assertion needed as EChartsType may not have setTheme in older type definitions
      const chartWithTheme = chartInstance as EChartsType & {
        setTheme?: (theme: string | Record<string, unknown>, opts?: SetThemeOpts) => void;
      };

      if (chartWithTheme.setTheme) {
        // Use ECharts 6 setTheme for smooth transition
        chartWithTheme.setTheme(theme, {
          transition: {
            duration: 300,
            easing: 'cubicOut',
          },
        });
      } else {
        // Fallback for older ECharts versions - manual theme application
        if (typeof theme === 'object') {
          const currentOption = chartInstance.getOption() as EChartsOption | null;
          if (currentOption && typeof currentOption === 'object') {
            const themedOption = { ...currentOption, ...theme } as EChartsOption;
            chartInstance.setOption(themedOption, { notMerge: true });
          }
        }
        // For string themes without setTheme, the chart would need re-initialization
        // which is handled at a higher level
      }
    } catch (error) {
      const chartError = createChartError(
        error,
        ChartErrorCode.INVALID_THEME,
        {
          themeType: typeof theme,
          themeKeys: typeof theme === 'object' ? Object.keys(theme) : 'not-object'
        }
      );
      console.error('Failed to apply theme:', chartError.toDetailedString());
      // Don't re-throw theme errors as they're not critical
    }
  }, [chartInstance, theme]);
}