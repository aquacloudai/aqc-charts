/**
 * Tests for error handling utilities
 */

import { describe, it, expect } from 'vitest';
import {
  ChartError,
  EChartsLoadError,
  ChartInitError,
  DataValidationError,
  // ChartRenderError,
  // TransformError,
  ChartErrorCode,
  createChartError,
  isChartError,
  isRecoverableError,
  safeAsync,
  safeSync
} from '../errors';

describe('ChartError', () => {
  it('should create a basic chart error', () => {
    const error = new ChartError({
      code: ChartErrorCode.UNKNOWN_ERROR,
      message: 'Test error',
      recoverable: true
    });

    expect(error.code).toBe(ChartErrorCode.UNKNOWN_ERROR);
    expect(error.message).toBe('Test error');
    expect(error.recoverable).toBe(true);
    expect(error.name).toBe('ChartError');
  });

  it('should format user message correctly', () => {
    const error = new ChartError({
      code: ChartErrorCode.INVALID_DATA_FORMAT,
      message: 'Invalid data',
      suggestions: ['Check data format', 'Verify required fields']
    });

    const userMessage = error.toUserMessage();
    expect(userMessage).toContain('Invalid data');
    expect(userMessage).toContain('• Check data format');
    expect(userMessage).toContain('• Verify required fields');
  });

  it('should format detailed string correctly', () => {
    const error = new ChartError({
      code: ChartErrorCode.CHART_RENDER_FAILED,
      message: 'Render failed',
      context: { width: 400, height: 300 },
      cause: new Error('Original error')
    });

    const detailed = error.toDetailedString();
    expect(detailed).toContain('ChartError [CHART_RENDER_FAILED]');
    expect(detailed).toContain('Render failed');
    expect(detailed).toContain('"width": 400');
    expect(detailed).toContain('Caused by: Original error');
  });
});

describe('Specific Error Classes', () => {
  it('should create EChartsLoadError with proper defaults', () => {
    const error = new EChartsLoadError();
    
    expect(error.code).toBe(ChartErrorCode.ECHARTS_LOAD_FAILED);
    expect(error.recoverable).toBe(true);
    expect(error.suggestions).toContain('Check your internet connection');
  });

  it('should create ChartInitError with context', () => {
    const error = new ChartInitError(
      new Error('Init failed'),
      { containerWidth: 0 }
    );
    
    expect(error.code).toBe(ChartErrorCode.CHART_INIT_FAILED);
    expect(error.context.containerWidth).toBe(0);
    expect(error.cause?.message).toBe('Init failed');
  });

  it('should create DataValidationError with suggestions', () => {
    const error = new DataValidationError(
      'Missing required field',
      { field: 'x' },
      ['Add the required field']
    );
    
    expect(error.code).toBe(ChartErrorCode.INVALID_DATA_FORMAT);
    expect(error.message).toContain('Missing required field');
    expect(error.suggestions).toContain('Add the required field');
  });
});

describe('Error Utilities', () => {
  it('should identify ChartError instances', () => {
    const chartError = new ChartError({
      code: ChartErrorCode.UNKNOWN_ERROR,
      message: 'Test'
    });
    const regularError = new Error('Regular error');

    expect(isChartError(chartError)).toBe(true);
    expect(isChartError(regularError)).toBe(false);
    expect(isChartError('string')).toBe(false);
    expect(isChartError(null)).toBe(false);
  });

  it('should identify recoverable errors', () => {
    const recoverableError = new ChartError({
      code: ChartErrorCode.ECHARTS_LOAD_FAILED,
      message: 'Load failed',
      recoverable: true
    });
    const nonRecoverableError = new ChartError({
      code: ChartErrorCode.UNKNOWN_ERROR,
      message: 'Unknown',
      recoverable: false
    });
    const regularError = new Error('Regular');

    expect(isRecoverableError(recoverableError)).toBe(true);
    expect(isRecoverableError(nonRecoverableError)).toBe(false);
    expect(isRecoverableError(regularError)).toBe(false);
  });

  it('should create ChartError from unknown error', () => {
    const error1 = createChartError('String error');
    expect(error1).toBeInstanceOf(ChartError);
    expect(error1.message).toBe('String error');

    const error2 = createChartError(new Error('Regular error'));
    expect(error2).toBeInstanceOf(ChartError);
    expect(error2.cause?.message).toBe('Regular error');

    const chartError = new ChartError({
      code: ChartErrorCode.CHART_RENDER_FAILED,
      message: 'Already chart error'
    });
    const error3 = createChartError(chartError);
    expect(error3).toBe(chartError); // Should return the same instance
  });
});

describe('Safe Wrappers', () => {
  it('should handle successful async operations', async () => {
    const result = await safeAsync(
      async () => 'success',
      ChartErrorCode.UNKNOWN_ERROR
    );
    expect(result).toBe('success');
  });

  it('should wrap async errors', async () => {
    await expect(
      safeAsync(
        async () => { throw new Error('Async error'); },
        ChartErrorCode.CHART_RENDER_FAILED,
        { context: 'test' }
      )
    ).rejects.toThrow(ChartError);
  });

  it('should handle successful sync operations', () => {
    const result = safeSync(
      () => 'success',
      ChartErrorCode.UNKNOWN_ERROR
    );
    expect(result).toBe('success');
  });

  it('should wrap sync errors', () => {
    expect(() => 
      safeSync(
        () => { throw new Error('Sync error'); },
        ChartErrorCode.CHART_RENDER_FAILED,
        { context: 'test' }
      )
    ).toThrow(ChartError);
  });
});