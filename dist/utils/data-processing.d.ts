import type { DataPoint } from '@/types';
export declare function isObjectData(data: readonly any[]): data is readonly DataPoint[];
export declare function groupDataByField(data: readonly DataPoint[], field: string): Record<string, DataPoint[]>;
export declare function detectDataType(values: (string | number | Date | null | undefined)[]): 'numeric' | 'categorical' | 'time';
export declare function mapStrokeStyleToECharts(strokeStyle?: 'solid' | 'dashed' | 'dotted'): 'solid' | 'dashed' | 'dotted';
//# sourceMappingURL=data-processing.d.ts.map