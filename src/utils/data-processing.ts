import type { DataPoint } from '@/types';

// Utility functions for data processing
export function isObjectData(data: readonly any[]): data is readonly DataPoint[] {
  return data.length > 0 && typeof data[0] === 'object' && !Array.isArray(data[0]);
}


export function groupDataByField(data: readonly DataPoint[], field: string): Record<string, DataPoint[]> {
  return data.reduce((groups, item) => {
    const key = String(item[field] ?? 'Unknown');
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {} as Record<string, DataPoint[]>);
}

export function detectDataType(values: (string | number | Date | null | undefined)[]): 'numeric' | 'categorical' | 'time' {
  const nonNullValues = values.filter(v => v != null);
  if (nonNullValues.length === 0) return 'categorical';
  
  // Check if all values are numbers
  if (nonNullValues.every(v => typeof v === 'number' || !isNaN(Number(v)))) {
    return 'numeric';
  }
  
  // Check if values look like dates
  if (nonNullValues.some(v => v instanceof Date || (typeof v === 'string' && !isNaN(Date.parse(v))))) {
    return 'time';
  }
  
  return 'categorical';
}

// Helper function to map stroke styles to ECharts lineStyle.type
export function mapStrokeStyleToECharts(strokeStyle?: 'solid' | 'dashed' | 'dotted'): 'solid' | 'dashed' | 'dotted' {
  switch (strokeStyle) {
    case 'dashed':
      return 'dashed';
    case 'dotted':
      return 'dotted';
    case 'solid':
    default:
      return 'solid';
  }
}

interface SeriesDataForAlignment {
  readonly name: string;
  readonly data: readonly DataPoint[];
  readonly xField: string;
  readonly yField: string;
}

interface AlignedSeriesData {
  readonly name: string;
  readonly alignedData: readonly (number | null)[];
}

/**
 * Aligns multiple series data to ensure all series have data points for every x-axis value.
 * Missing data points are filled with null values to maintain proper alignment.
 * 
 * @param seriesDataList - Array of series data to align
 * @returns Object containing unified x-axis values and aligned series data
 */
export function alignSeriesData(seriesDataList: readonly SeriesDataForAlignment[]): {
  readonly xAxisData: readonly any[];
  readonly alignedSeries: readonly AlignedSeriesData[];
} {
  if (seriesDataList.length === 0) {
    return { xAxisData: [], alignedSeries: [] };
  }

  // Collect all unique x-axis values from all series and preserve their order
  const allXValues = new Map<any, number>(); // value -> first occurrence index
  let indexCounter = 0;

  seriesDataList.forEach(seriesData => {
    seriesData.data.forEach(item => {
      const xValue = item[seriesData.xField];
      if (xValue != null && !allXValues.has(xValue)) {
        allXValues.set(xValue, indexCounter++);
      }
    });
  });

  // Sort by first occurrence to maintain natural order
  const sortedXValues = Array.from(allXValues.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([value]) => value);

  // Create aligned data for each series
  const alignedSeries: AlignedSeriesData[] = seriesDataList.map(seriesData => {
    // Create a map of x-value to y-value for this series
    const dataMap = new Map<any, number>();
    seriesData.data.forEach(item => {
      const xValue = item[seriesData.xField];
      const yValue = item[seriesData.yField];
      if (xValue != null && yValue != null) {
        dataMap.set(xValue, yValue as number);
      }
    });

    // Create aligned array with null for missing values
    const alignedData = sortedXValues.map(xValue => dataMap.get(xValue) ?? null);

    return {
      name: seriesData.name,
      alignedData,
    };
  });

  return {
    xAxisData: sortedXValues,
    alignedSeries,
  };
}