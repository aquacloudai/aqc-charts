/**
 * Tests for validation utilities
 */

import { describe, it, expect, vi } from 'vitest';
import {
  validateRequired,
  validateArray,
  // validateObject,
  validateString,
  validateNumber,
  validateChartData,
  validateFieldMapping,
  validateDimensions,
  validateTheme,
  // validateChartProps,
  assertValidation,
  combineValidationResults,
  createValidationResult
} from '../validation';
import { DataValidationError } from '../errors';

describe('Basic Validators', () => {
  describe('validateRequired', () => {
    it('should pass for valid values', () => {
      expect(validateRequired('test', 'field').isValid).toBe(true);
      expect(validateRequired(0, 'field').isValid).toBe(true);
      expect(validateRequired([], 'field').isValid).toBe(true);
    });

    it('should fail for null or undefined', () => {
      expect(validateRequired(null, 'field').isValid).toBe(false);
      expect(validateRequired(undefined, 'field').isValid).toBe(false);
    });
  });

  describe('validateArray', () => {
    it('should pass for valid arrays', () => {
      expect(validateArray([1, 2, 3], 'arr').isValid).toBe(true);
    });

    it('should fail for non-arrays', () => {
      const result = validateArray('not array', 'arr');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('must be an array');
    });

    it('should validate array length constraints', () => {
      const result1 = validateArray([1], 'arr', { minLength: 2 });
      expect(result1.isValid).toBe(false);
      expect(result1.errors[0]).toContain('at least 2 items');

      const result2 = validateArray(Array.from({ length: 1001 }, () => 1), 'arr', { maxLength: 1000 });
      expect(result2.isValid).toBe(true);
      expect(result2.warnings[0]).toContain('more than 1000 items');
    });

    it('should validate array items', () => {
      const itemValidator = (item: number) => 
        item > 0 ? createValidationResult() : createValidationResult(false, ['must be positive']);

      const result = validateArray([1, -1, 2], 'arr', { itemValidator });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('arr[1]: must be positive');
    });
  });

  describe('validateString', () => {
    it('should pass for valid strings', () => {
      expect(validateString('test', 'str').isValid).toBe(true);
    });

    it('should fail for non-strings', () => {
      const result = validateString(123, 'str');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('must be a string');
    });

    it('should validate string length', () => {
      const result1 = validateString('a', 'str', { minLength: 2 });
      expect(result1.isValid).toBe(false);

      const result2 = validateString('toolong', 'str', { maxLength: 3 });
      expect(result2.isValid).toBe(false);
    });

    it('should validate patterns', () => {
      const result = validateString('abc', 'str', { pattern: /^\d+$/ });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('does not match');
    });
  });

  describe('validateNumber', () => {
    it('should pass for valid numbers', () => {
      expect(validateNumber(42, 'num').isValid).toBe(true);
    });

    it('should fail for non-numbers', () => {
      const result1 = validateNumber('42', 'num');
      expect(result1.isValid).toBe(false);

      const result2 = validateNumber(NaN, 'num');
      expect(result2.isValid).toBe(false);
    });

    it('should validate number ranges', () => {
      const result1 = validateNumber(5, 'num', { min: 10 });
      expect(result1.isValid).toBe(false);

      const result2 = validateNumber(15, 'num', { max: 10 });
      expect(result2.isValid).toBe(false);
    });

    it('should validate integer constraint', () => {
      const result = validateNumber(3.14, 'num', { integer: true });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('must be an integer');
    });
  });
});

describe('Chart-specific Validators', () => {
  describe('validateChartData', () => {
    it('should pass for valid data arrays', () => {
      const result = validateChartData([1, 2, 3]);
      expect(result.isValid).toBe(true);
    });

    it('should fail for invalid data', () => {
      expect(validateChartData(null).isValid).toBe(false);
      expect(validateChartData('not array').isValid).toBe(false);
      expect(validateChartData([]).isValid).toBe(false);
    });

    it('should warn for large datasets', () => {
      const largeData = Array.from({ length: 15000 }, () => 1);
      const result = validateChartData(largeData);
      expect(result.isValid).toBe(true);
      expect(result.warnings[0]).toContain('Large dataset detected');
    });

    it('should warn for inconsistent data types', () => {
      const mixedData = [1, 'string', 3];
      const result = validateChartData(mixedData);
      expect(result.isValid).toBe(true);
      expect(result.warnings[0]).toContain('Inconsistent data types');
    });
  });

  describe('validateFieldMapping', () => {
    const sampleData = [
      { x: 1, y: 2, name: 'A' },
      { x: 3, y: 4, name: 'B' }
    ];

    it('should pass for valid field mappings', () => {
      const result1 = validateFieldMapping(sampleData, 'x', 'x');
      expect(result1.isValid).toBe(true);

      const result2 = validateFieldMapping(sampleData, 'fields', ['x', 'y']);
      expect(result2.isValid).toBe(true);
    });

    it('should fail for missing fields', () => {
      const result = validateFieldMapping(sampleData, 'field', 'missing');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Field \'missing\' not found');
      expect(result.errors[0]).toContain('Available fields: x, y, name');
    });

    it('should handle undefined field mappings', () => {
      const result = validateFieldMapping(sampleData, 'field', undefined);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateDimensions', () => {
    it('should pass for valid dimensions', () => {
      const result1 = validateDimensions(400, 300);
      expect(result1.isValid).toBe(true);

      const result2 = validateDimensions('100%', '400px');
      expect(result2.isValid).toBe(true);
    });

    it('should fail for invalid dimensions', () => {
      const result1 = validateDimensions(-100, 300);
      expect(result1.isValid).toBe(false);
      expect(result1.errors[0]).toContain('Width must be a positive number');

      const result2 = validateDimensions(300, 0);
      expect(result2.isValid).toBe(false);
      expect(result2.errors[0]).toContain('Height must be a positive number');
    });

    it('should warn for invalid CSS dimensions', () => {
      const result = validateDimensions('invalid', '400');
      expect(result.isValid).toBe(true); // Warnings don't make it invalid
      expect(result.warnings).toHaveLength(2);
    });
  });

  describe('validateTheme', () => {
    it('should pass for valid themes', () => {
      expect(validateTheme('light').isValid).toBe(true);
      expect(validateTheme('dark').isValid).toBe(true);
      expect(validateTheme({ backgroundColor: '#fff' }).isValid).toBe(true);
      expect(validateTheme(undefined).isValid).toBe(true);
    });

    it('should fail for invalid theme strings', () => {
      const result = validateTheme('invalid');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Invalid theme \'invalid\'');
    });

    it('should warn for incomplete theme objects', () => {
      const result = validateTheme({});
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Custom theme is missing backgroundColor property');
      expect(result.warnings).toContain('Custom theme is missing color palette');
    });
  });
});

describe('Validation Utilities', () => {
  describe('combineValidationResults', () => {
    it('should combine multiple results correctly', () => {
      const result1 = createValidationResult(true, [], ['warning1']);
      const result2 = createValidationResult(false, ['error1'], ['warning2']);
      const result3 = createValidationResult(true, [], []);

      const combined = combineValidationResults(result1, result2, result3);
      
      expect(combined.isValid).toBe(false);
      expect(combined.errors).toEqual(['error1']);
      expect(combined.warnings).toEqual(['warning1', 'warning2']);
    });
  });

  describe('assertValidation', () => {
    it('should not throw for valid results', () => {
      const validResult = createValidationResult(true);
      expect(() => assertValidation(validResult)).not.toThrow();
    });

    it('should throw DataValidationError for invalid results', () => {
      const invalidResult = createValidationResult(false, ['Error message']);
      expect(() => assertValidation(invalidResult)).toThrow(DataValidationError);
    });

    it('should log warnings without throwing', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const warningResult = createValidationResult(true, [], ['Warning message']);
      
      expect(() => assertValidation(warningResult)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'AQC Charts validation warnings:', 
        ['Warning message']
      );
      
      consoleSpy.mockRestore();
    });
  });
});