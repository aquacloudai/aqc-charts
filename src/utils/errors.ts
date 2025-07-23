/**
 * Custom error types for AQC Charts library
 * Provides specific error classes with helpful context for debugging
 */

export enum ChartErrorCode {
  // Initialization errors
  ECHARTS_LOAD_FAILED = 'ECHARTS_LOAD_FAILED',
  CHART_INIT_FAILED = 'CHART_INIT_FAILED',
  CONTAINER_NOT_FOUND = 'CONTAINER_NOT_FOUND',
  
  // Data errors
  INVALID_DATA_FORMAT = 'INVALID_DATA_FORMAT',
  EMPTY_DATA = 'EMPTY_DATA',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Configuration errors
  INVALID_CHART_OPTION = 'INVALID_CHART_OPTION',
  INVALID_THEME = 'INVALID_THEME',
  UNSUPPORTED_CHART_TYPE = 'UNSUPPORTED_CHART_TYPE',
  
  // Runtime errors
  CHART_RENDER_FAILED = 'CHART_RENDER_FAILED',
  CHART_UPDATE_FAILED = 'CHART_UPDATE_FAILED',
  CHART_RESIZE_FAILED = 'CHART_RESIZE_FAILED',
  
  // Transform errors
  ECSTAT_TRANSFORM_FAILED = 'ECSTAT_TRANSFORM_FAILED',
  DATA_TRANSFORM_FAILED = 'DATA_TRANSFORM_FAILED',
  
  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
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
export class ChartError extends Error {
  public readonly code: ChartErrorCode;
  public readonly context: Record<string, unknown>;
  public readonly cause?: Error | undefined;
  public readonly recoverable: boolean;
  public readonly suggestions: string[];

  constructor(details: ChartErrorDetails) {
    super(details.message);
    this.name = 'ChartError';
    this.code = details.code;
    this.context = details.context ?? {};
    this.cause = details.cause;
    this.recoverable = details.recoverable ?? false;
    this.suggestions = details.suggestions ?? [];

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ChartError);
    }
  }

  /**
   * Convert error to a user-friendly format
   */
  toUserMessage(): string {
    const baseMessage = this.message;
    const suggestions = this.suggestions.length > 0 
      ? `\n\nSuggestions:\n${this.suggestions.map(s => `• ${s}`).join('\n')}`
      : '';
    
    return `${baseMessage}${suggestions}`;
  }

  /**
   * Convert error to detailed format for debugging
   */
  toDetailedString(): string {
    const details = [
      `ChartError [${this.code}]: ${this.message}`,
      `Recoverable: ${this.recoverable}`,
    ];

    if (Object.keys(this.context).length > 0) {
      details.push(`Context: ${JSON.stringify(this.context, null, 2)}`);
    }

    if (this.suggestions.length > 0) {
      details.push(`Suggestions:\n${this.suggestions.map(s => `  • ${s}`).join('\n')}`);
    }

    if (this.cause) {
      details.push(`Caused by: ${this.cause.message}`);
    }

    return details.join('\n');
  }
}

/**
 * Specific error class for ECharts loading failures
 */
export class EChartsLoadError extends ChartError {
  constructor(cause?: Error | undefined, context?: Record<string, unknown> | undefined) {
    super({
      code: ChartErrorCode.ECHARTS_LOAD_FAILED,
      message: 'Failed to load ECharts library from CDN',
      context,
      cause,
      recoverable: true,
      suggestions: [
        'Check your internet connection',
        'Verify that CDN is accessible',
        'Try refreshing the page',
        'Consider using a local ECharts build'
      ]
    });
    this.name = 'EChartsLoadError';
  }
}

/**
 * Specific error class for chart initialization failures
 */
export class ChartInitError extends ChartError {
  constructor(cause?: Error | undefined, context?: Record<string, unknown> | undefined) {
    super({
      code: ChartErrorCode.CHART_INIT_FAILED,
      message: 'Failed to initialize chart instance',
      context,
      cause,
      recoverable: true,
      suggestions: [
        'Ensure the container element exists',
        'Verify container has non-zero dimensions',
        'Check if ECharts is properly loaded'
      ]
    });
    this.name = 'ChartInitError';
  }
}

/**
 * Specific error class for data validation failures
 */
export class DataValidationError extends ChartError {
  constructor(message: string, context?: Record<string, unknown> | undefined, suggestions?: string[] | undefined) {
    super({
      code: ChartErrorCode.INVALID_DATA_FORMAT,
      message: `Data validation failed: ${message}`,
      context,
      recoverable: true,
      suggestions: suggestions || [
        'Check the data format matches the expected structure',
        'Ensure required fields are present',
        'Verify data types are correct'
      ]
    });
    this.name = 'DataValidationError';
  }
}

/**
 * Specific error class for chart rendering failures
 */
export class ChartRenderError extends ChartError {
  constructor(cause?: Error | undefined, context?: Record<string, unknown> | undefined) {
    super({
      code: ChartErrorCode.CHART_RENDER_FAILED,
      message: 'Failed to render chart',
      context,
      cause,
      recoverable: true,
      suggestions: [
        'Check if the chart options are valid',
        'Verify the data format is correct',
        'Ensure the container is properly sized'
      ]
    });
    this.name = 'ChartRenderError';
  }
}

/**
 * Specific error class for transform failures
 */
export class TransformError extends ChartError {
  constructor(transformType: string, cause?: Error | undefined, context?: Record<string, unknown> | undefined) {
    super({
      code: ChartErrorCode.DATA_TRANSFORM_FAILED,
      message: `Failed to apply ${transformType} transform`,
      context,
      cause,
      recoverable: true,
      suggestions: [
        'Check if the data is compatible with the transform',
        'Verify transform parameters are correct',
        'Ensure ecStat is properly loaded'
      ]
    });
    this.name = 'TransformError';
  }
}

/**
 * Utility function to create ChartError from unknown error
 */
export function createChartError(
  error: unknown, 
  code: ChartErrorCode = ChartErrorCode.UNKNOWN_ERROR,
  context?: Record<string, unknown> | undefined
): ChartError {
  if (error instanceof ChartError) {
    return error;
  }

  if (error instanceof Error) {
    return new ChartError({
      code,
      message: error.message,
      context,
      cause: error,
      recoverable: true
    });
  }

  return new ChartError({
    code,
    message: String(error) || 'An unknown error occurred',
    context,
    recoverable: false
  });
}

/**
 * Utility function to safely handle async operations with proper error wrapping
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  errorCode: ChartErrorCode,
  context?: Record<string, unknown> | undefined
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw createChartError(error, errorCode, context);
  }
}

/**
 * Utility function to safely handle sync operations with proper error wrapping
 */
export function safeSync<T>(
  operation: () => T,
  errorCode: ChartErrorCode,
  context?: Record<string, unknown> | undefined
): T {
  try {
    return operation();
  } catch (error) {
    throw createChartError(error, errorCode, context);
  }
}

/**
 * Type guard to check if an error is a ChartError
 */
export function isChartError(error: unknown): error is ChartError {
  return error instanceof ChartError;
}

/**
 * Type guard to check if an error is recoverable
 */
export function isRecoverableError(error: unknown): boolean {
  return isChartError(error) && error.recoverable;
}