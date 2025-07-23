/**
 * Custom error types for AQC Charts library
 * Provides specific error classes with helpful context for debugging
 */
export declare enum ChartErrorCode {
    ECHARTS_LOAD_FAILED = "ECHARTS_LOAD_FAILED",
    CHART_INIT_FAILED = "CHART_INIT_FAILED",
    CONTAINER_NOT_FOUND = "CONTAINER_NOT_FOUND",
    INVALID_DATA_FORMAT = "INVALID_DATA_FORMAT",
    EMPTY_DATA = "EMPTY_DATA",
    MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",
    INVALID_CHART_OPTION = "INVALID_CHART_OPTION",
    INVALID_THEME = "INVALID_THEME",
    UNSUPPORTED_CHART_TYPE = "UNSUPPORTED_CHART_TYPE",
    CHART_RENDER_FAILED = "CHART_RENDER_FAILED",
    CHART_UPDATE_FAILED = "CHART_UPDATE_FAILED",
    CHART_RESIZE_FAILED = "CHART_RESIZE_FAILED",
    ECSTAT_TRANSFORM_FAILED = "ECSTAT_TRANSFORM_FAILED",
    DATA_TRANSFORM_FAILED = "DATA_TRANSFORM_FAILED",
    UNKNOWN_ERROR = "UNKNOWN_ERROR"
}
export interface ChartErrorDetails {
    code: ChartErrorCode;
    message: string;
    context?: Record<string, unknown> | undefined;
    cause?: Error | undefined;
    recoverable?: boolean | undefined;
    suggestions?: string[] | undefined;
}
/**
 * Base class for all chart-related errors
 */
export declare class ChartError extends Error {
    readonly code: ChartErrorCode;
    readonly context: Record<string, unknown>;
    readonly cause?: Error | undefined;
    readonly recoverable: boolean;
    readonly suggestions: string[];
    constructor(details: ChartErrorDetails);
    /**
     * Convert error to a user-friendly format
     */
    toUserMessage(): string;
    /**
     * Convert error to detailed format for debugging
     */
    toDetailedString(): string;
}
/**
 * Specific error class for ECharts loading failures
 */
export declare class EChartsLoadError extends ChartError {
    constructor(cause?: Error | undefined, context?: Record<string, unknown> | undefined);
}
/**
 * Specific error class for chart initialization failures
 */
export declare class ChartInitError extends ChartError {
    constructor(cause?: Error | undefined, context?: Record<string, unknown> | undefined);
}
/**
 * Specific error class for data validation failures
 */
export declare class DataValidationError extends ChartError {
    constructor(message: string, context?: Record<string, unknown> | undefined, suggestions?: string[] | undefined);
}
/**
 * Specific error class for chart rendering failures
 */
export declare class ChartRenderError extends ChartError {
    constructor(cause?: Error | undefined, context?: Record<string, unknown> | undefined);
}
/**
 * Specific error class for transform failures
 */
export declare class TransformError extends ChartError {
    constructor(transformType: string, cause?: Error | undefined, context?: Record<string, unknown> | undefined);
}
/**
 * Utility function to create ChartError from unknown error
 */
export declare function createChartError(error: unknown, code?: ChartErrorCode, context?: Record<string, unknown> | undefined): ChartError;
/**
 * Utility function to safely handle async operations with proper error wrapping
 */
export declare function safeAsync<T>(operation: () => Promise<T>, errorCode: ChartErrorCode, context?: Record<string, unknown> | undefined): Promise<T>;
/**
 * Utility function to safely handle sync operations with proper error wrapping
 */
export declare function safeSync<T>(operation: () => T, errorCode: ChartErrorCode, context?: Record<string, unknown> | undefined): T;
/**
 * Type guard to check if an error is a ChartError
 */
export declare function isChartError(error: unknown): error is ChartError;
/**
 * Type guard to check if an error is recoverable
 */
export declare function isRecoverableError(error: unknown): boolean;
//# sourceMappingURL=errors.d.ts.map