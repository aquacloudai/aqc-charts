import { describe, expect, it } from 'vitest';
import { extractUniqueValues, extractUniqueValuesOrdered } from '../data-processing';

describe('data-processing', () => {
  const testData = [
    { date: '2024-01-03', value: 10 },
    { date: '2024-01-01', value: 15 },
    { date: '2024-01-05', value: 8 },
    { date: '2024-01-02', value: 12 },
    { date: '2024-01-04', value: 14 },
    { date: '2024-01-03', value: 20 }, // Duplicate date
  ];

  describe('extractUniqueValues', () => {
    it('should extract unique values but may not preserve order', () => {
      const result = extractUniqueValues(testData, 'date');
      expect(result).toHaveLength(5);
      expect(result).toContain('2024-01-01');
      expect(result).toContain('2024-01-02');
      expect(result).toContain('2024-01-03');
      expect(result).toContain('2024-01-04');
      expect(result).toContain('2024-01-05');
    });
  });

  describe('extractUniqueValuesOrdered', () => {
    it('should extract unique values while preserving first occurrence order', () => {
      const result = extractUniqueValuesOrdered(testData, 'date');
      expect(result).toEqual([
        '2024-01-03',
        '2024-01-01', 
        '2024-01-05',
        '2024-01-02',
        '2024-01-04'
      ]);
    });

    it('should handle null and undefined values', () => {
      const dataWithNulls = [
        { date: '2024-01-01', value: 10 },
        { date: null, value: 15 },
        { date: '2024-01-02', value: 20 },
        { date: undefined, value: 25 },
        { date: '2024-01-01', value: 30 }, // Duplicate
      ];
      
      const result = extractUniqueValuesOrdered(dataWithNulls, 'date');
      expect(result).toEqual(['2024-01-01', '2024-01-02']);
    });

    it('should work with different data types', () => {
      const numericData = [
        { id: 3, value: 10 },
        { id: 1, value: 15 },
        { id: 5, value: 8 },
        { id: 2, value: 12 },
        { id: 3, value: 20 }, // Duplicate
      ];
      
      const result = extractUniqueValuesOrdered(numericData, 'id');
      expect(result).toEqual([3, 1, 5, 2]);
    });
  });
});