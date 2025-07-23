/**
 * Date formatting utilities for chart data
 * Provides safe date handling to prevent unwanted time-series parsing
 */
export type DateFormatType = 'month' | 'week' | 'day' | 'quarter' | 'year' | 'monthYear';
/**
 * Detects if a value looks like a date string that might be incorrectly parsed as time-series
 */
export declare const looksLikeDate: (value: unknown) => boolean;
/**
 * Safely formats date strings for categorical display in charts
 */
export declare const formatDateForChart: (dateString: string, format?: DateFormatType) => string;
/**
 * Detects the appropriate axis type for data values
 */
export declare const detectAxisType: (data: readonly any[], field: string) => "category" | "linear" | "time";
/**
 * Preprocesses data to ensure safe categorical display of date-like values
 */
export declare const preprocessDateFields: <T extends Record<string, any>>(data: readonly T[], xField: string, dateFormat?: DateFormatType) => T[];
//# sourceMappingURL=dateFormatting.d.ts.map