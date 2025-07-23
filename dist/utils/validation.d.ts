/**
 * Validation utilities for AQC Charts
 * Provides runtime validation with helpful error messages
 */
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
export declare function createValidationResult(isValid?: boolean, errors?: string[], warnings?: string[]): ValidationResult;
/**
 * Combine multiple validation results
 */
export declare function combineValidationResults(...results: ValidationResult[]): ValidationResult;
/**
 * Validate that a value is not null or undefined
 */
export declare function validateRequired<T>(value: T, fieldName: string): ValidationResult;
/**
 * Validate array data
 */
export declare function validateArray<T>(value: unknown, fieldName: string, options?: {
    minLength?: number;
    maxLength?: number;
    itemValidator?: (item: T, index: number) => ValidationResult;
}): ValidationResult;
/**
 * Validate object data
 */
export declare function validateObject(value: unknown, fieldName: string, requiredFields?: string[]): ValidationResult;
/**
 * Validate string value
 */
export declare function validateString(value: unknown, fieldName: string, options?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    allowEmpty?: boolean;
}): ValidationResult;
/**
 * Validate number value
 */
export declare function validateNumber(value: unknown, fieldName: string, options?: {
    min?: number;
    max?: number;
    integer?: boolean;
}): ValidationResult;
/**
 * Validate chart data for basic requirements
 */
export declare function validateChartData(data: unknown): ValidationResult;
/**
 * Validate field mapping for ergonomic charts
 */
export declare function validateFieldMapping(data: unknown[], fieldName: string, fieldValue: string | string[] | undefined): ValidationResult;
/**
 * Validate dimensions (width/height)
 */
export declare function validateDimensions(width: string | number | undefined, height: string | number | undefined): ValidationResult;
/**
 * Validate theme value
 */
export declare function validateTheme(theme: unknown): ValidationResult;
/**
 * Main validation function for chart props
 */
export declare function validateChartProps(props: Record<string, unknown>): ValidationResult;
/**
 * Utility function to throw DataValidationError if validation fails
 */
export declare function assertValidation(result: ValidationResult, context?: Record<string, unknown>): void;
/**
 * Development mode validator that logs detailed information
 */
export declare function validateInDevelopment<T>(value: T, validator: Validator<T>, context?: string): T;
//# sourceMappingURL=validation.d.ts.map