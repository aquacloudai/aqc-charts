import type { DataPoint } from '@/types';
export interface DataRange {
    min: number;
    max: number;
    hasNegative: boolean;
}
/**
 * Analyzes data to detect negative values and calculate appropriate axis ranges
 */
export declare function analyzeDataRange(data: readonly DataPoint[], fields: readonly string[]): Record<string, DataRange>;
/**
 * Analyzes array data for negative values (for simple array-based charts)
 */
export declare function analyzeArrayDataRange(data: readonly (readonly number[])[]): DataRange;
/**
 * Enhances axis configuration with proper negative value support
 */
export declare function enhanceAxisForNegativeValues(axisConfig: any, hasNegative: boolean): any;
//# sourceMappingURL=negative-value-handling.d.ts.map