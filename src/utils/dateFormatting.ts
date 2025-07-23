/**
 * Date formatting utilities for chart data
 * Provides safe date handling to prevent unwanted time-series parsing
 */

export type DateFormatType = 'month' | 'week' | 'day' | 'quarter' | 'year' | 'monthYear';

/**
 * Detects if a value looks like a date string that might be incorrectly parsed as time-series
 */
export const looksLikeDate = (value: unknown): boolean => {
  if (typeof value !== 'string') return false;
  
  // Common date patterns that might cause issues
  const datePatterns = [
    /^\d{4}-\d{2}(-\d{2})?/, // 2023-01 or 2023-01-15
    /^\d{4}\/\d{2}(\/\d{2})?/, // 2023/01 or 2023/01/15
    /^W\d{2}$/, // W01, W02 (week format)
    /^Q[1-4]$/, // Q1, Q2 (quarter format)
    /^[A-Z][a-z]{2} \d{2,4}$/, // Jan 23, Jan 2023
  ];
  
  return datePatterns.some(pattern => pattern.test(value));
};

/**
 * Safely formats date strings for categorical display in charts
 */
export const formatDateForChart = (
  dateString: string, 
  format: DateFormatType = 'month'
): string => {
  try {
    // Handle special formats first
    if (format === 'week' && /^W\d{2}$/.test(dateString)) {
      return dateString; // Already in desired format
    }
    
    if (format === 'quarter' && /^Q[1-4]$/.test(dateString)) {
      return dateString; // Already in desired format
    }
    
    // Parse the date
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if can't parse
    }
    
    switch (format) {
      case 'month':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          year: '2-digit' 
        });
      
      case 'monthYear':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
      
      case 'week':
        // Convert to week format (simplified)
        const week = Math.ceil(date.getDate() / 7);
        return `W${week.toString().padStart(2, '0')}`;
      
      case 'day':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      
      case 'quarter':
        const quarter = Math.ceil((date.getMonth() + 1) / 3);
        return `Q${quarter}`;
      
      case 'year':
        return date.getFullYear().toString();
      
      default:
        return dateString;
    }
  } catch (error) {
    // If anything goes wrong, return the original string
    return dateString;
  }
};

/**
 * Detects the appropriate axis type for data values
 */
export const detectAxisType = (data: readonly any[], field: string): 'category' | 'linear' | 'time' => {
  if (!data.length) return 'category';
  
  const sample = data[0]?.[field];
  
  // If it looks like a date string that should be categorical, force category
  if (looksLikeDate(sample)) {
    return 'category';
  }
  
  // If it's a number, use linear
  if (typeof sample === 'number') {
    return 'linear';
  }
  
  // Default to category for strings and other types
  return 'category';
};

/**
 * Preprocesses data to ensure safe categorical display of date-like values
 */
export const preprocessDateFields = <T extends Record<string, any>>(
  data: readonly T[],
  xField: string,
  dateFormat: DateFormatType = 'month'
): T[] => {
  if (!data.length) return [...data];
  
  const sample = data[0]?.[xField];
  
  // Only process if the field looks like a date
  if (!looksLikeDate(sample)) {
    return [...data];
  }
  
  // Transform the data
  return data.map(item => ({
    ...item,
    [xField]: formatDateForChart(item[xField], dateFormat)
  }));
};