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