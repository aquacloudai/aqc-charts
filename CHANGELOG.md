# Changelog

All notable changes to AQC Charts will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-01-08

### Added
- **ECharts 6 Dynamic Theme Switching**: Leverage the new `setTheme()` API for smooth runtime theme transitions
  - Themes now switch without chart re-initialization
  - Animated transitions with configurable duration and easing
  - Preserves chart state during theme changes

- **System Dark Mode Auto-Detection**: New hooks for automatic dark mode support
  - `useSystemTheme()` - Returns current system theme ('light' | 'dark')
  - `useResolvedTheme(theme)` - Resolves 'auto' theme to system preference
  - `usePrefersDarkMode()` - Boolean hook for dark mode detection
  - Uses `useSyncExternalStore` for React 18+ concurrent mode compatibility

- **'auto' Theme Support**: All chart components now support `theme="auto"`
  - Automatically follows system `prefers-color-scheme` preference
  - Real-time updates when system theme changes
  - Works with both built-in and custom themes

- **Scatter Jittering (Beeswarm Charts)**: New ECharts 6 jitter support for scatter series
  - `jitter` prop: Enable with `true` or configure with `{ width?: number; height?: number }`
  - `jitterOverlap` prop: Prevents overlapping points while maintaining axis accuracy
  - Perfect for visualizing categorical data with many overlapping points

- **Separate Legacy Entry Point**: Legacy components now available via dedicated import
  - Import from `@aquacloud_ai/aqc-charts/legacy` for deprecated Old* components
  - Main bundle no longer includes legacy components for smaller size
  - Better tree-shaking support

### Changed
- **Updated Peer Dependency**: ECharts peer dependency now requires `>=6.0.0`
  - Ensures all ECharts 6 features are available
  - Previous `>=5.4.0` no longer supported

- **Performance: Optimized Option Comparison**: Replaced deep equality with structural hashing
  - O(1) hash comparison instead of O(n) deep traversal
  - Samples array boundaries and mid-points for fast change detection
  - Significant performance improvement for large datasets

- **Performance: Consolidated Event Handlers**: Reduced effect re-runs in BaseChart
  - Event handlers stored in refs to prevent unnecessary re-registration
  - Effect dependencies reduced from 13 to 3
  - Unified click handling for better consistency

- **Bundle Size Reduction**: ~34% smaller main bundle
  - Legacy components moved to separate entry point
  - Main bundle reduced from ~198KB to ~131KB (minified)
  - Tree-shaking improvements for unused features

### Fixed
- **Theme Switching Performance**: Theme changes no longer require full chart re-initialization
- **Event Handler Memory Leaks**: Proper cleanup of all event listeners on unmount
- **Example App Theme**: All example components now properly support 'auto' theme

### Technical Details
- New file: `src/hooks/useSystemTheme.ts` - System theme detection hooks
- New file: `src/legacy.ts` - Separate entry point for legacy components
- Modified: `src/hooks/echarts/useChartOptions.ts` - setTheme() API and structural hashing
- Modified: `src/components/BaseChart.tsx` - Event handler refs pattern
- Modified: `src/components/ScatterChart.tsx` - Jitter prop support
- Modified: `rolldown.config.js` - Multiple entry points

### Migration Guide
**From 0.1.x to 0.2.0:**

1. **ECharts Peer Dependency**: Ensure you have ECharts 6.0.0 or later installed:
   ```bash
   npm install echarts@^6.0.0
   # or
   bun add echarts@^6.0.0
   ```

2. **Legacy Components** (if using Old* components): Update imports:
   ```typescript
   // Before
   import { OldLineChart } from '@aquacloud_ai/aqc-charts';

   // After
   import { OldLineChart } from '@aquacloud_ai/aqc-charts/legacy';
   ```

3. **Auto Theme** (optional): Take advantage of automatic dark mode:
   ```typescript
   // Automatically follows system preference
   <LineChart theme="auto" data={data} />
   ```

4. **Scatter Jittering** (optional): Enable for overlapping data points:
   ```typescript
   <ScatterChart data={data} jitter={true} />
   // or with custom config
   <ScatterChart data={data} jitter={{ width: 0.5 }} />
   ```

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