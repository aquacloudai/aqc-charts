# 🤖 Claude AI Development Guide

> Instructions for AI tools working with the AQC Charts repository

## 🎯 Project Overview

AQC Charts is a modern React charting library built with TypeScript, using cutting-edge Rust-based tooling for maximum performance. This guide helps AI tools understand and work effectively with the codebase.

## 🏗️ Repository Structure

```
aqc-charts/
├── src/                          # Main source code
│   ├── components/               # React components
│   │   ├── BaseChart.tsx        # Core chart component
│   │   ├── LineChart.tsx        # Line chart implementation
│   │   ├── BarChart.tsx         # Bar chart implementation
│   │   ├── PieChart.tsx         # Pie chart implementation
│   │   └── __tests__/           # Component tests
│   ├── hooks/                   # Custom React hooks
│   │   └── useECharts.ts        # Main chart hook
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts             # Exported types
│   ├── utils/                   # Utility functions
│   │   ├── EChartsLoader.ts     # Dynamic ECharts loading
│   │   └── themes.ts            # Theme definitions
│   └── index.ts                 # Main export file
├── example/                     # Example application
├── dist/                        # Built library (generated)
├── package.json                 # Bun package configuration
├── bunfig.toml                  # Bun configuration
├── rolldown.config.js           # Build configuration
├── vitest.config.ts             # Test configuration
├── oxlintrc.json               # Linting rules
├── dprint.json                 # Formatting rules
└── tsconfig.json               # TypeScript configuration
```

## ⚡ Toolchain & Commands

### Package Manager: Bun (NOT npm/yarn)
```bash
# Install dependencies
bun install

# Add dependencies
bun add <package>
bun add -d <package>  # dev dependency

# Remove dependencies
bun remove <package>
```

### Development Commands
```bash
bun run dev          # Watch mode development
bun run build        # Production build
bun run test         # Run tests
bun run test:watch   # Watch mode tests
bun run test:ui      # Test UI interface
bun run lint         # Lint with Oxlint
bun run lint:fix     # Auto-fix linting issues
bun run format       # Format with dprint
bun run typecheck    # TypeScript checking
bun run example      # Run example app
```

### Build Tools
- **Bundler**: Rolldown (Rust-based, NOT Rollup/Webpack)
- **Linter**: Oxlint (Rust-based, NOT ESLint)
- **Formatter**: dprint (Rust-based, NOT Prettier)
- **Tests**: Vitest (NOT Jest)

## 📝 Code Patterns & Conventions

### TypeScript Patterns
```typescript
// Use readonly for immutable data
interface ChartSeries {
  readonly name: string;
  readonly type: 'line' | 'bar' | 'pie';
  readonly data: readonly (number | ChartDataPoint)[];
}

// Use unknown instead of any
option?: unknown;

// Proper React component typing
const Component = forwardRef<ChartRef, ComponentProps>(({ ... }, ref) => {
  // Implementation
});
```

### React Patterns
```typescript
// Custom hooks for logic
const useECharts = (containerRef, option, theme) => {
  // Hook implementation with cleanup
};

// Memoization for performance
const chartOption = useMemo(() => {
  // Complex calculations
}, [dependencies]);

// Refs for imperative API
const chartRef = useRef<EChartsInstance | null>(null);
```

### Component Structure
```typescript
// 1. Imports
import React, { forwardRef, useMemo } from 'react';
import type { ComponentProps, ChartRef } from '@/types';

// 2. Interface definition
export interface ComponentProps extends BaseProps {
  readonly specificProp?: boolean;
}

// 3. Component implementation
export const Component = forwardRef<ChartRef, ComponentProps>(({
  // Destructure props with defaults
  prop = defaultValue,
  ...restProps
}, ref) => {
  // 4. Hooks and state
  const memoizedValue = useMemo(() => {}, [deps]);
  
  // 5. JSX return
  return <BaseChart {...restProps} />;
});

// 6. Display name
Component.displayName = 'Component';
```

## 🔧 Key Technologies

### Core Dependencies
```json
{
  "react": "^18.2.0",           # React framework
  "react-dom": "^18.2.0",      # React DOM
  "echarts": "^5.6.0",         # Apache ECharts
  "echarts-stat": "^1.2.0"     # ECharts statistical extensions
}
```

### Build Dependencies
```json
{
  "@rolldown/rolldown": "^0.6.2",  # Bundler
  "oxlint": "^0.3.0",              # Linter
  "dprint": "^0.45.0",             # Formatter
  "vitest": "^1.2.0",              # Test runner
  "typescript": "^5.3.3"           # TypeScript
}
```

## 📋 Development Guidelines

### When Adding New Chart Types
1. Create new component in `src/components/`
2. Extend from `BaseChart` component
3. Define specific props interface
4. Add to main exports in `src/index.ts`
5. Write tests in `__tests__/` directory
6. Update TypeScript types

### File Naming Conventions
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Types: `index.ts` (exported from types folder)
- Tests: `ComponentName.test.tsx`

### Import/Export Patterns
```typescript
// Use @ alias for internal imports
import { BaseChart } from '@/components/BaseChart';
import type { ChartRef } from '@/types';

// Named exports (no default exports except for components)
export { BaseChart, LineChart, BarChart };
export type { ChartRef, ChartSeries };
```

## 🧪 Testing

### Test Structure
```typescript
// src/components/__tests__/Component.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Component } from '../Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component data={mockData} />);
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });
});
```

### Mock ECharts
```typescript
// Already configured in src/setupTests.ts
global.window.echarts = {
  init: vi.fn(() => mockChart),
  dispose: vi.fn()
};
```

## 🎨 Styling & Themes

### CSS Classes
- `.aqc-charts-container` - Main container
- `.aqc-charts-loading` - Loading overlay
- `.aqc-charts-error` - Error state
- `.aqc-charts-spinner` - Loading spinner

### Theme System
```typescript
// Built-in themes
import { lightTheme, darkTheme } from '@/utils/themes';

// Custom theme
const customTheme: ChartTheme = {
  backgroundColor: '#ffffff',
  color: ['#ff0000', '#00ff00'],
  textStyle: { color: '#333333' }
};
```

## 🔍 Common Operations

### Adding a New Chart Component
1. Create `src/components/NewChart.tsx`
2. Define props interface extending `BaseChartProps`
3. Implement using `BaseChart` with specific options
4. Add tests
5. Export from `src/index.ts`

### Statistical Charts (ecStat Integration)
The library includes advanced statistical charts powered by echarts-stat:

#### ClusterChart
- Uses `ecStat:clustering` transform for K-means clustering
- Automatic color mapping via visual map
- Configurable cluster count and visualization

#### RegressionChart  
- Uses `ecStat:regression` transform for regression analysis
- Supports linear, exponential, logarithmic, and polynomial regression
- Automatic equation display and R² calculation

### Updating Dependencies
```bash
# Check outdated packages
bun outdated

# Update specific package
bun add package@latest

# Update all packages
bun update
```

### Debugging
```bash
# Type checking
bun run typecheck

# Linting issues
bun run lint

# Test failures
bun run test --reporter=verbose

# Build issues
bun run build --debug
```

## 📊 Performance Considerations

### Bundle Analysis
- Library targets ~15KB gzipped
- ECharts is peer dependency (not bundled)
- Tree-shaking enabled via ES modules

### Runtime Performance
- Use `useMemo` for complex calculations
- Use `useCallback` for event handlers
- Proper cleanup in `useEffect`
- Refs for direct chart access

## 🚨 Common Issues & Solutions

### Build Failures
```bash
# Clear cache and rebuild
rm -rf dist node_modules bun.lockb
bun install
bun run build
```

### Type Errors
```bash
# Generate fresh type declarations
bun run build:types
```

### Test Failures
```bash
# Run specific test
bun run test Component.test.tsx

# Update snapshots
bun run test --update-snapshots
```

## 🔗 External Integrations

### ECharts API
- Charts automatically load latest ECharts from CDN
- Access instance via `chartRef.current?.getEChartsInstance()`
- Supports all ECharts configuration options

### React Integration
- Supports React 18+ with concurrent features
- SSR compatible (with proper hydration)
- Works with Next.js, Vite, Create React App

## 📝 Quick Reference

### Essential Files to Understand
1. `src/types/index.ts` - All TypeScript definitions
2. `src/hooks/useECharts.ts` - Core chart logic
3. `src/components/BaseChart.tsx` - Foundation component
4. `package.json` - Scripts and dependencies
5. `rolldown.config.js` - Build configuration

### Key Commands for AI Tools
```bash
bun install           # Setup dependencies
bun run typecheck     # Validate TypeScript
bun run test          # Run test suite
bun run build         # Build library
bun run example       # Test with example app
```

### Paths & Aliases
- `@/*` maps to `src/*`
- Main entry: `src/index.ts`
- Types: `src/types/index.ts`
- Components: `src/components/`