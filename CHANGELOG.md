# Changelog

All notable changes to AQC Charts will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **DOM Prop Filtering**: Fixed React warnings about unknown DOM properties being passed to HTML elements
  - Created `filterDOMProps` utility in `src/utils/domProps.ts` to filter chart-specific props from DOM elements
  - Applied fix to all chart components: BarChart, LineChart, PieChart, ScatterChart, CombinedChart, GanttChart, ClusterChart, CalendarHeatmapChart, and RegressionChart
  - Chart props like `data`, `theme`, `colorPalette`, `onDataPointClick`, etc. are now properly filtered out before being passed to DOM elements
  - Preserves valid HTML attributes (`id`, `className`, `style`, `data-*`, `aria-*`, standard DOM events)

- **Zero Dimensions Handling**: Improved chart initialization when containers have zero dimensions
  - Added 50ms delay in chart initialization to allow CSS layout to complete
  - Added minimum dimension fallbacks to all chart components
  - `minWidth: '300px'` when width is percentage-based to prevent collapsed containers
  - `minHeight: '300px'` always applied as a safety fallback
  - Updated warning messages to provide more helpful suggestions
  - Applied to: BarChart, LineChart, PieChart, ScatterChart components

### Added
- **New Utility**: `src/utils/domProps.ts` - Filters chart-specific props from DOM elements
  - Prevents React warnings about unknown DOM properties
  - Maintains separation between chart configuration and DOM attributes
  - Supports all standard HTML attributes and events

### Technical Details
- **Chart Components**: All ergonomic chart components now use `filterDOMProps()` utility
- **Dimension Safety**: Charts now have minimum dimension fallbacks to prevent rendering issues
- **Initialization**: Improved chart initialization timing to handle dynamic container sizing
- **Type Safety**: All changes maintain existing TypeScript interfaces and prop contracts

### Breaking Changes
None - all changes are backward compatible.

### Migration Guide
No migration required. All existing code will continue to work as before, but with improved error handling and cleaner console output.