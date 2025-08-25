# AQC Charts Type System Refactoring TODO

## Overview
Refactor the AQC Charts type system to improve type safety, remove legacy naming patterns, and create a more intuitive developer experience.

## 1. Consolidate Chart Props Interfaces
**Goal**: Remove duplication between ergonomic and legacy base types

### Subtasks:
- [ ] Merge `BaseErgonomicChartProps` and `BaseChartProps` into single unified interface
- [ ] Ensure all chart-specific props extend from unified base
- [ ] Remove duplicate prop definitions across interfaces
- [ ] Standardize prop naming conventions (remove "ergonomic" prefix)
- [ ] Update theme and styling props to be consistent
- [ ] Consolidate event handler prop definitions

## 2. Unify Chart Reference Types
**Goal**: Single, comprehensive chart ref interface with better type safety

### Subtasks:
- [ ] Analyze differences between `ErgonomicChartRef` and `ChartRef`
- [ ] Create unified `ChartRef` interface with all functionality
- [ ] Add proper generic typing for chart instances
- [ ] Include all export/image methods with strict typing
- [ ] Add chart manipulation methods (highlight, resize, etc.)
- [ ] Remove deprecated `ErgonomicChartRef` interface
- [ ] Update forwardRef generic types in components

## 3. Remove Legacy Naming Patterns
**Goal**: Make current "ergonomic" types the primary interface

### Subtasks:
- [ ] Rename all "ergonomic" types to remove prefix (e.g., `BaseErgonomicChartProps` → `BaseChartProps`)
- [ ] Update file names to remove "ergonomic" references
- [ ] Move legacy types to dedicated legacy folder/files
- [ ] Create type aliases for backward compatibility
- [ ] Update component imports to use new type names
- [ ] Update documentation examples with new names

## 4. Enhance Data Types with Better Generics
**Goal**: Stricter, more type-safe data point and series interfaces

### Subtasks:
- [ ] Create generic `DataPoint<T>` interface for strongly typed data
- [ ] Add generic series interfaces with proper value types
- [ ] Create field mapping types that ensure type safety
- [ ] Add union types for chart-specific data shapes
- [ ] Implement proper date/time typing for time series
- [ ] Add validation types for required vs optional fields
- [ ] Create helper types for common data transformations

## 5. Optimize Export Structure
**Goal**: Clean, intuitive type export organization

### Subtasks:
- [ ] Group exports by functionality (core, charts, utils, legacy)
- [ ] Remove duplicate exports from different modules
- [ ] Create barrel exports for easier imports
- [ ] Separate ECharts re-exports from custom types
- [ ] Add JSDoc comments to all exported types
- [ ] Create type-only export sections
- [ ] Minimize type pollution in main index

## 6. Update Component Imports
**Goal**: Ensure all components use new consolidated types

### Subtasks:
- [ ] Update `BaseChart.tsx` to use unified base props
- [ ] Update all chart components (`LineChart`, `BarChart`, etc.)
- [ ] Update legacy components to use compatibility types
- [ ] Fix all forwardRef generic parameters
- [ ] Update hook type definitions
- [ ] Verify utility function type signatures
- [ ] Update test files with new type imports

## 7. Test Refactored Types
**Goal**: Verify TypeScript compilation and functionality

### Subtasks:
- [ ] Run `bun run typecheck` to verify no TypeScript errors
- [ ] Test example app compilation with new types
- [ ] Verify all component props are properly typed
- [ ] Test that autocomplete/IntelliSense works correctly
- [ ] Run unit tests to ensure no runtime issues
- [ ] Verify backward compatibility with legacy types
- [ ] Test tree-shaking works with new export structure

## 8. Documentation and Cleanup
**Goal**: Update documentation to reflect new type system

### Subtasks:
- [ ] Update README with new type examples
- [ ] Update component JSDoc comments
- [ ] Create migration guide for breaking changes
- [ ] Update CLAUDE.md with new type patterns
- [ ] Remove unused type definitions
- [ ] Clean up import statements across codebase
- [ ] Update package.json type exports if needed

## Priority Order
1. **High Priority**: Tasks 1, 2, 3 (Core type consolidation)
2. **Medium Priority**: Tasks 4, 5, 6 (Enhancement and updates)
3. **Low Priority**: Tasks 7, 8 (Testing and documentation)

## Breaking Changes
- `ErgonomicChartRef` → `ChartRef`
- `BaseErgonomicChartProps` → `BaseChartProps`
- Some import paths may change
- Legacy types moved to separate namespace

## Backward Compatibility
- Type aliases provided for major breaking changes
- Legacy components remain functional
- Deprecation warnings for old patterns