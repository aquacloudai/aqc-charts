import type { DataPoint } from '@/types';
export declare function isObjectData(data: readonly any[]): data is readonly DataPoint[];
export declare function groupDataByField(data: readonly DataPoint[], field: string): Record<string, DataPoint[]>;
export declare function detectDataType(values: (string | number | Date | null | undefined)[]): 'numeric' | 'categorical' | 'time';
export declare function mapStrokeStyleToECharts(strokeStyle?: 'solid' | 'dashed' | 'dotted'): 'solid' | 'dashed' | 'dotted';
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
export declare function alignSeriesData(seriesDataList: readonly SeriesDataForAlignment[]): {
    readonly xAxisData: readonly any[];
    readonly alignedSeries: readonly AlignedSeriesData[];
};
export {};
//# sourceMappingURL=data-processing.d.ts.map