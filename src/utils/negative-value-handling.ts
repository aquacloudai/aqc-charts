import type { DataPoint } from '@/types';

export interface DataRange {
  min: number;
  max: number;
  hasNegative: boolean;
}

/**
 * Analyzes data to detect negative values and calculate appropriate axis ranges
 */
export function analyzeDataRange(
  data: readonly DataPoint[], 
  fields: readonly string[]
): Record<string, DataRange> {
  const ranges: Record<string, DataRange> = {};
  
  fields.forEach(field => {
    let min = Infinity;
    let max = -Infinity;
    let hasNegative = false;
    
    data.forEach(item => {
      const value = (item as any)[field];
      if (typeof value === 'number' && !isNaN(value)) {
        min = Math.min(min, value);
        max = Math.max(max, value);
        if (value < 0) hasNegative = true;
      }
    });
    
    // If we have valid data, calculate appropriate range with some padding
    if (min !== Infinity && max !== -Infinity) {
      const range = max - min;
      const padding = range * 0.1; // 10% padding
      
      // If we have negative values, ensure the range includes zero
      if (hasNegative) {
        min = Math.min(min - padding, 0);
        max = Math.max(max + padding, 0);
      } else {
        min = Math.max(0, min - padding); // Don't go below zero for positive-only data
        max = max + padding;
      }
      
      ranges[field] = { min, max, hasNegative };
    }
  });
  
  return ranges;
}

/**
 * Analyzes array data for negative values (for simple array-based charts)
 */
export function analyzeArrayDataRange(data: readonly (readonly number[])[]): DataRange {
  let min = Infinity;
  let max = -Infinity;
  let hasNegative = false;
  
  data.forEach(row => {
    row.forEach(value => {
      if (typeof value === 'number' && !isNaN(value)) {
        min = Math.min(min, value);
        max = Math.max(max, value);
        if (value < 0) hasNegative = true;
      }
    });
  });
  
  if (min !== Infinity && max !== -Infinity) {
    const range = max - min;
    const padding = range * 0.1;
    
    if (hasNegative) {
      min = Math.min(min - padding, 0);
      max = Math.max(max + padding, 0);
    } else {
      min = Math.max(0, min - padding);
      max = max + padding;
    }
    
    return { min, max, hasNegative };
  }
  
  return { min: 0, max: 100, hasNegative: false };
}

/**
 * Enhances axis configuration with proper negative value support
 */
export function enhanceAxisForNegativeValues(axisConfig: any, hasNegative: boolean): any {
  if (!hasNegative) return axisConfig;
  
  return {
    ...axisConfig,
    axisLine: {
      ...axisConfig.axisLine,
      onZero: true,
      lineStyle: {
        color: '#666666',
        ...axisConfig.axisLine?.lineStyle,
      }
    },
    splitLine: {
      ...axisConfig.splitLine,
      show: true,
      lineStyle: {
        color: ['#e6e6e6'],
        width: 1,
        type: 'solid',
        ...axisConfig.splitLine?.lineStyle,
      }
    }
  };
}