/**
 * Validation utilities for AQC Charts
 * Provides runtime validation with helpful error messages
 */

import { DataValidationError } from './errors';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Base validator function type
 */
export type Validator<T> = (value: T) => ValidationResult;

/**
 * Create a validation result
 */
export function createValidationResult(
  isValid: boolean = true,
  errors: string[] = [],
  warnings: string[] = []
): ValidationResult {
  return { isValid, errors, warnings };
}

/**
 * Combine multiple validation results
 */
export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let isValid = true;

  for (const result of results) {
    if (!result.isValid) {
      isValid = false;
    }
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  return { isValid, errors, warnings };
}

/**
 * Validate that a value is not null or undefined
 */
export function validateRequired<T>(value: T, fieldName: string): ValidationResult {
  if (value === null || value === undefined) {
    return createValidationResult(false, [`${fieldName} is required`]);
  }
  return createValidationResult();
}

/**
 * Validate array data
 */
export function validateArray<T>(
  value: unknown,
  fieldName: string,
  options: {
    minLength?: number;
    maxLength?: number;
    itemValidator?: (item: T, index: number) => ValidationResult;
  } = {}
): ValidationResult {
  if (!Array.isArray(value)) {
    return createValidationResult(false, [`${fieldName} must be an array`]);
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check length constraints
  if (options.minLength !== undefined && value.length < options.minLength) {
    errors.push(`${fieldName} must have at least ${options.minLength} items`);
  }

  if (options.maxLength !== undefined && value.length > options.maxLength) {
    warnings.push(`${fieldName} has more than ${options.maxLength} items, performance may be affected`);
  }

  // Validate individual items
  if (options.itemValidator) {
    value.forEach((item, index) => {
      const itemResult = options.itemValidator!(item as T, index);
      if (!itemResult.isValid) {
        errors.push(...itemResult.errors.map(err => `${fieldName}[${index}]: ${err}`));
      }
      warnings.push(...itemResult.warnings.map(warn => `${fieldName}[${index}]: ${warn}`));
    });
  }

  return createValidationResult(errors.length === 0, errors, warnings);
}

/**
 * Validate object data
 */
export function validateObject(
  value: unknown,
  fieldName: string,
  requiredFields: string[] = []
): ValidationResult {
  if (typeof value !== 'object' || value === null) {
    return createValidationResult(false, [`${fieldName} must be an object`]);
  }

  const errors: string[] = [];
  const obj = value as Record<string, unknown>;

  // Check required fields
  for (const field of requiredFields) {
    if (!(field in obj) || obj[field] === undefined) {
      errors.push(`${fieldName} is missing required field: ${field}`);
    }
  }

  return createValidationResult(errors.length === 0, errors);
}

/**
 * Validate string value
 */
export function validateString(
  value: unknown,
  fieldName: string,
  options: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    allowEmpty?: boolean;
  } = {}
): ValidationResult {
  if (typeof value !== 'string') {
    return createValidationResult(false, [`${fieldName} must be a string`]);
  }

  const errors: string[] = [];

  if (!options.allowEmpty && value.length === 0) {
    errors.push(`${fieldName} cannot be empty`);
  }

  if (options.minLength !== undefined && value.length < options.minLength) {
    errors.push(`${fieldName} must be at least ${options.minLength} characters long`);
  }

  if (options.maxLength !== undefined && value.length > options.maxLength) {
    errors.push(`${fieldName} must be at most ${options.maxLength} characters long`);
  }

  if (options.pattern && !options.pattern.test(value)) {
    errors.push(`${fieldName} does not match the required pattern`);
  }

  return createValidationResult(errors.length === 0, errors);
}

/**
 * Validate number value
 */
export function validateNumber(
  value: unknown,
  fieldName: string,
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}
): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return createValidationResult(false, [`${fieldName} must be a valid number`]);
  }

  const errors: string[] = [];

  if (options.min !== undefined && value < options.min) {
    errors.push(`${fieldName} must be at least ${options.min}`);
  }

  if (options.max !== undefined && value > options.max) {
    errors.push(`${fieldName} must be at most ${options.max}`);
  }

  if (options.integer && !Number.isInteger(value)) {
    errors.push(`${fieldName} must be an integer`);
  }

  return createValidationResult(errors.length === 0, errors);
}

/**
 * Validate chart data for basic requirements
 */
export function validateChartData(data: unknown): ValidationResult {
  const result = validateRequired(data, 'data');
  if (!result.isValid) {
    return result;
  }

  if (!Array.isArray(data)) {
    return createValidationResult(false, ['data must be an array']);
  }

  if (data.length === 0) {
    return createValidationResult(false, ['data cannot be empty']);
  }

  const warnings: string[] = [];

  // Check for large datasets
  if (data.length > 10000) {
    warnings.push('Large dataset detected (>10k items), consider data aggregation for better performance');
  }

  // Check data consistency
  const firstItem = data[0];
  const firstItemType = typeof firstItem;
  
  for (let i = 1; i < Math.min(data.length, 100); i++) {
    if (typeof data[i] !== firstItemType) {
      warnings.push('Inconsistent data types detected in dataset');
      break;
    }
  }

  return createValidationResult(true, [], warnings);
}

/**
 * Validate field mapping for ergonomic charts
 */
export function validateFieldMapping(
  data: unknown[],
  fieldName: string,
  fieldValue: string | string[] | undefined
): ValidationResult {
  if (!fieldValue) {
    return createValidationResult();
  }

  const errors: string[] = [];
  const fields = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
  
  // Check if data is array of objects
  if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    const sampleObject = data[0] as Record<string, unknown>;
    
    for (const field of fields) {
      if (!(field in sampleObject)) {
        errors.push(`Field '${field}' not found in data objects. Available fields: ${Object.keys(sampleObject).join(', ')}`);
      }
    }
  }

  return createValidationResult(errors.length === 0, errors);
}

/**
 * Validate dimensions (width/height)
 */
export function validateDimensions(
  width: string | number | undefined,
  height: string | number | undefined
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate width
  if (width !== undefined) {
    if (typeof width === 'number' && width <= 0) {
      errors.push('Width must be a positive number');
    } else if (typeof width === 'string' && width !== '100%' && !width.match(/^\d+(?:px|%|em|rem|vw|vh)$/)) {
      warnings.push('Width should be a valid CSS dimension (e.g., "100%", "400px")');
    }
  }

  // Validate height
  if (height !== undefined) {
    if (typeof height === 'number' && height <= 0) {
      errors.push('Height must be a positive number');
    } else if (typeof height === 'string' && !height.match(/^\d+(?:px|%|em|rem|vw|vh)$/)) {
      warnings.push('Height should be a valid CSS dimension (e.g., "400px", "50vh")');
    }
  }

  return createValidationResult(errors.length === 0, errors, warnings);
}

/**
 * Validate theme value
 */
export function validateTheme(theme: unknown): ValidationResult {
  if (theme === undefined || theme === null) {
    return createValidationResult();
  }

  if (typeof theme === 'string') {
    const validThemes = ['light', 'dark'];
    if (!validThemes.includes(theme)) {
      return createValidationResult(
        false, 
        [`Invalid theme '${theme}'. Valid themes: ${validThemes.join(', ')}`]
      );
    }
  } else if (typeof theme === 'object') {
    // Custom theme object - basic validation
    const themeObj = theme as Record<string, unknown>;
    const warnings: string[] = [];
    
    if (!themeObj.backgroundColor) {
      warnings.push('Custom theme is missing backgroundColor property');
    }
    
    if (!themeObj.color) {
      warnings.push('Custom theme is missing color palette');
    }

    return createValidationResult(true, [], warnings);
  } else {
    return createValidationResult(false, ['Theme must be a string or object']);
  }

  return createValidationResult();
}

/**
 * Main validation function for chart props
 */
export function validateChartProps(props: Record<string, unknown>): ValidationResult {
  const results: ValidationResult[] = [];

  // Validate basic props
  if ('data' in props) {
    results.push(validateChartData(props.data));
  }

  if ('width' in props || 'height' in props) {
    results.push(validateDimensions(
      props.width as string | number | undefined,
      props.height as string | number | undefined
    ));
  }

  if ('theme' in props) {
    results.push(validateTheme(props.theme));
  }

  return combineValidationResults(...results);
}

/**
 * Utility function to throw DataValidationError if validation fails
 */
export function assertValidation(result: ValidationResult, context?: Record<string, unknown>): void {
  if (!result.isValid) {
    throw new DataValidationError(
      result.errors.join('; '),
      context,
      ['Check the data format and required fields', 'Refer to the documentation for examples']
    );
  }

  // Log warnings if any
  if (result.warnings.length > 0) {
    console.warn('AQC Charts validation warnings:', result.warnings);
  }
}

/**
 * Development mode validator that logs detailed information
 */
export function validateInDevelopment<T>(
  value: T,
  validator: Validator<T>,
  context: string = 'component'
): T {
  if (process.env.NODE_ENV === 'development') {
    const result = validator(value);
    
    if (!result.isValid) {
      console.error(`AQC Charts validation failed in ${context}:`, result.errors);
    }
    
    if (result.warnings.length > 0) {
      console.warn(`AQC Charts validation warnings in ${context}:`, result.warnings);
    }
  }
  
  return value;
}