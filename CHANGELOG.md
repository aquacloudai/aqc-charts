# Changelog

All notable changes to AQC Charts will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2025-09-03

### Added
- **NPM Release Pipeline**: Automated NPM publishing under `@aquacloud_ai/aqc-charts` organization
  - Added GitHub Actions workflow for automated releases on git tags
  - Configured scoped package publishing with public access
  - Added comprehensive release documentation in `RELEASE.md`
  - Updated package name to `@aquacloud_ai/aqc-charts` for organization scoping

### Changed
- **ECharts v6 Upgrade**: Updated from ECharts 5.6.0 to 6.0.0
  - Enhanced default theme with improved colors and spacing
  - Matrix coordinate system support for declarative layouts
  - Enhanced chord charts with gradient colors
  - Beeswarm charts support with jitter functionality
  - Broken axis visualization with torn-paper effects
  - Improved stock trading chart features
  - Updated CDN loader to use ECharts 6.0.0 by default
  - Maintained full backward compatibility with existing API

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

- **Code Quality Improvements**: Fixed linting issues for release readiness
  - Resolved duplicate condition warnings in if-else-if chains across chart components
  - Fixed unused variable warnings by prefixing with underscore
  - Simplified DOM prop filtering implementation
  - Maintained all functionality while improving code quality

### Breaking Changes
None - all changes are backward compatible.

### Migration Guide
No migration required. All existing code will continue to work as before, but with improved error handling and cleaner console output.