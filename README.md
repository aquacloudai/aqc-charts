# 📊 AQC Charts

> Modern Apache ECharts React components with TypeScript, built for performance and developer experience

[![npm version](https://badge.fury.io/js/aqc-charts.svg)](https://badge.fury.io/js/aqc-charts)
[![CI](https://github.com/yourusername/aqc-charts/workflows/CI/badge.svg)](https://github.com/yourusername/aqc-charts/actions)
[![Coverage Status](https://coveralls.io/repos/github/yourusername/aqc-charts/badge.svg?branch=main)](https://coveralls.io/github/yourusername/aqc-charts?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)

AQC Charts is a production-ready React charting library built on Apache ECharts. Designed with modern patterns, TypeScript-first architecture, and an extensible foundation for enterprise applications.

## ✨ Why AQC Charts?

- 🏗️ **Modern React Patterns**: Built with hooks, refs, and proper lifecycle management
- 📘 **TypeScript First**: Complete type safety with comprehensive interfaces and generics
- ⚡ **Performance Optimized**: Smart memoization, efficient re-renders, and minimal bundle size
- 🎨 **Flexible Theming**: Built-in light/dark themes plus custom theme object support
- 🔧 **Extensible Architecture**: Easy to add new chart types and data transformations
- 📱 **Responsive by Default**: Automatic resizing and responsive behavior
- 🚀 **Latest ECharts**: Always compatible with the newest Apache ECharts features
- 🛡️ **Production Ready**: Comprehensive error handling, loading states, and edge cases
- 🧪 **Well Tested**: High test coverage with modern testing tools

## 🚀 Quick Start

### Installation

```bash
# npm
npm install aqc-charts

# yarn  
yarn add aqc-charts

# pnpm
pnpm add aqc-charts

# bun
bun add aqc-charts
```

### Basic Usage

```tsx
import React from 'react';
import { LineChart, BarChart, PieChart } from 'aqc-charts';

const App = () => {
  const salesData = [
    {
      name: 'Revenue',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210],
      color: '#5470c6'
    },
    {
      name: 'Profit',
      type: 'line', 
      data: [220, 182, 191, 234, 290, 330, 310],
      color: '#91cc75'
    }
  ];

  return (
    <div>
      <LineChart
        data={salesData}
        xAxis={{ data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }}
        title="Weekly Performance"
        subtitle="Revenue vs Profit Analysis"
        height={400}
        smooth={true}
        area={true}
        onClick={(params, chart) => {
          console.log('Data point clicked:', params);
        }}
      />
    </div>
  );
};

export default App;
```

## 📖 Components

### 📈 LineChart

Perfect for showing trends, time series data, and continuous relationships.

```tsx
<LineChart
  data={[
    {
      name: 'Temperature',
      type: 'line',
      data: [22, 24, 26, 28, 25, 23, 21],
      color: '#ff6b6b'
    }
  ]}
  xAxis={{ data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }}
  title="Weekly Temperature"
  smooth={true}
  area={true}
  symbol={true}
  connectNulls={false}
  theme="light"
/>
```

**Props:**
- `data` - Array of chart series with type definitions
- `smooth` - Enable smooth curve interpolation
- `area` - Fill area under the line(s)
- `stack` - Stack multiple series
- `symbol` - Show/hide data point markers
- `symbolSize` - Size of data point markers
- `connectNulls` - Connect lines across null data points

### 📊 BarChart

Ideal for comparing categories, rankings, and discrete data sets.

```tsx
<BarChart
  data={[
    {
      name: 'Sales',
      type: 'bar',
      data: [320, 332, 301, 334, 390],
      color: '#fac858'
    },
    {
      name: 'Target',
      type: 'bar',
      data: [300, 320, 280, 340, 380],
      color: '#91cc75'
    }
  ]}
  xAxis={{ data: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'] }}
  title="Quarterly Sales vs Target"
  horizontal={false}
  stack={false}
  showValues={true}
  barWidth="60%"
/>
```

**Props:**
- `horizontal` - Render bars horizontally
- `stack` - Stack multiple bar series
- `showValues` - Display values on bars
- `barWidth` - Custom bar width (string or number)
- `barMaxWidth` - Maximum bar width constraint

### 🍰 PieChart

Great for showing proportions, market share, and part-to-whole relationships.

```tsx
<PieChart
  data={[
    { name: 'Desktop', value: 1048 },
    { name: 'Mobile', value: 735 },
    { name: 'Tablet', value: 580 },
    { name: 'Other', value: 484 }
  ]}
  title="Device Usage Statistics"
  radius={['40%', '70%']}
  center={['50%', '50%']}
  roseType={false}
  showLabels={true}
  showLegend={true}
/>
```

**Props:**
- `radius` - Inner and outer radius (donut chart support)
- `center` - Chart center position
- `roseType` - Rose chart type (`'radius'` | `'area'` | `false`)
- `showLabels` - Show/hide slice labels
- `showLegend` - Show/hide legend

### ⚙️ BaseChart

Low-level component for advanced customization and custom chart types.

```tsx
<BaseChart
  option={{
    title: { text: 'Custom Visualization' },
    xAxis: { type: 'category', data: ['A', 'B', 'C', 'D'] },
    yAxis: { type: 'value' },
    series: [{
      type: 'scatter',
      data: [[0, 10], [1, 15], [2, 8], [3, 20]],
      symbolSize: 8
    }]
  }}
  theme="dark"
  renderer="svg"
  width="100%"
  height={400}
  onChartReady={(chart) => {
    // Access full ECharts API
    console.log('Chart initialized:', chart);
  }}
/>
```

## 🎨 Theming System

### Built-in Themes

```tsx
// Light theme (default)
<LineChart data={data} theme="light" />

// Dark theme
<LineChart data={data} theme="dark" />
```

### Custom Themes

```tsx
const customTheme = {
  backgroundColor: '#1a1a1a',
  textStyle: { 
    color: '#ffffff',
    fontFamily: 'Inter, sans-serif'
  },
  color: [
    '#ff6b6b', '#4ecdc4', '#45b7d1', 
    '#96ceb4', '#feca57', '#ff9ff3'
  ],
  grid: {
    borderColor: '#333333'
  }
};

<LineChart data={data} theme={customTheme} />
```

### Theme Variables

```tsx
import { lightTheme, darkTheme } from 'aqc-charts';

// Extend existing themes
const myTheme = {
  ...darkTheme,
  color: ['#your', '#custom', '#colors'],
  backgroundColor: '#your-bg-color'
};
```

## 🔧 Advanced Usage

### Chart Instance Access

```tsx
import { useRef } from 'react';
import { LineChart, ChartRef } from 'aqc-charts';

const MyComponent = () => {
  const chartRef = useRef<ChartRef>(null);

  const exportChart = () => {
    const chart = chartRef.current?.getEChartsInstance();
    const dataURL = chart?.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'chart.png';
    link.href = dataURL;
    link.click();
  };

  const refreshChart = () => {
    chartRef.current?.refresh();
  };

  return (
    <div>
      <button onClick={exportChart}>Export as PNG</button>
      <button onClick={refreshChart}>Refresh Chart</button>
      
      <LineChart
        ref={chartRef}
        data={data}
        onChartReady={(chart) => {
          console.log('Chart ready!', chart);
        }}
      />
    </div>
  );
};
```

### Event Handling

```tsx
<LineChart
  data={data}
  onClick={(params, chart) => {
    console.log('Data point clicked:', {
      seriesName: params.seriesName,
      dataIndex: params.dataIndex,
      value: params.value
    });
  }}
  onMouseOver={(params, chart) => {
    // Custom hover behavior
    chart.getEChartsInstance()?.dispatchAction({
      type: 'highlight',
      seriesIndex: params.seriesIndex,
      dataIndex: params.dataIndex
    });
  }}
  onDataZoom={(params, chart) => {
    console.log('Zoom changed:', params);
  }}
/>
```

### Loading States

```tsx
const [isLoading, setIsLoading] = useState(false);
const [chartData, setChartData] = useState([]);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const response = await api.getChartData();
    setChartData(response.data);
  } finally {
    setIsLoading(false);
  }
};

return (
  <LineChart
    data={chartData}
    loading={isLoading}
    height={400}
  />
);
```

### Responsive Design

```tsx
// Responsive chart that adapts to container
<div style={{ width: '100%', height: '50vh' }}>
  <LineChart
    data={data}
    width="100%"
    height="100%"
    // Chart automatically resizes when container changes
  />
</div>
```

## 📚 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type { 
  ChartSeries, 
  ChartDataPoint, 
  ChartTheme,
  LineChartProps,
  BarChartProps,
  PieChartProps 
} from 'aqc-charts';

// Strongly typed chart data
const typedData: ChartSeries[] = [
  {
    name: 'Sales',
    type: 'line',
    data: [100, 200, 300], // Type-checked
    color: '#5470c6'
  }
];

// Strongly typed pie chart data
const pieData: ChartDataPoint[] = [
  { name: 'Category A', value: 335 },
  { name: 'Category B', value: 310 }
];

// Custom theme with type safety
const customTheme: ChartTheme = {
  backgroundColor: '#ffffff',
  color: ['#ff0000', '#00ff00', '#0000ff']
};
```

## 🎯 Examples

### Real-time Data

```tsx
import { useEffect, useState } from 'react';
import { LineChart } from 'aqc-charts';

const RealTimeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => [
        ...prevData.slice(-50), // Keep last 50 points
        { 
          name: 'Live Data',
          type: 'line',
          data: [...prevData[0]?.data.slice(-50) || [], Math.random() * 100]
        }
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LineChart
      data={data}
      title="Real-time Data Stream"
      smooth={true}
      height={400}
    />
  );
};
```

### Multi-axis Charts

```tsx
<LineChart
  data={[
    {
      name: 'Temperature',
      type: 'line',
      data: [22, 24, 26, 28, 25],
      yAxisIndex: 0,
      color: '#ff6b6b'
    },
    {
      name: 'Humidity',
      type: 'line', 
      data: [65, 70, 68, 72, 69],
      yAxisIndex: 1,
      color: '#4ecdc4'
    }
  ]}
  xAxis={{ data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }}
  yAxis={[
    { type: 'value', name: 'Temperature (°C)', position: 'left' },
    { type: 'value', name: 'Humidity (%)', position: 'right' }
  ]}
  title="Temperature & Humidity"
/>
```

### Dashboard Layout

```tsx
const Dashboard = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
    <LineChart
      data={revenueData}
      title="Revenue Trend"
      height={300}
    />
    <BarChart
      data={salesData}
      title="Sales by Region"
      height={300}
    />
    <PieChart
      data={userSegmentData}
      title="User Segments"
      height={300}
    />
    <LineChart
      data={performanceData}
      title="Performance Metrics"
      height={300}
    />
  </div>
);
```

## 🧪 Testing

AQC Charts comes with comprehensive test utilities:

```tsx
import { render, screen } from '@testing-library/react';
import { LineChart } from 'aqc-charts';

test('renders chart with title', () => {
  render(
    <LineChart
      data={[{ name: 'Test', type: 'line', data: [1, 2, 3] }]}
      title="Test Chart"
    />
  );
  
  expect(screen.getByText('Test Chart')).toBeInTheDocument();
});
```

## 🛠️ Development

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- React 18+
- TypeScript 5+

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/aqc-charts.git
cd aqc-charts

# Install dependencies
bun install

# Start development
bun run dev

# Run tests
bun run test

# Run example app
bun run example
```

### Scripts

```bash
bun run dev          # Development mode with hot reload
bun run build        # Build library for production
bun run test         # Run test suite
bun run test:ui      # Run tests with UI
bun run test:watch   # Run tests in watch mode
bun run lint         # Lint code with Oxlint
bun run format       # Format code with dprint
bun run typecheck    # Type checking with TypeScript
bun run example      # Run example application
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure tests pass: `bun run test`
5. Lint and format: `bun run lint && bun run format`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Development Guidelines

- Write TypeScript with strict mode
- Add tests for new features
- Follow the existing code style
- Update documentation for API changes
- Use conventional commit messages

## 📊 Performance

AQC Charts is built for performance:

- **Bundle Size**: ~15KB gzipped (excluding ECharts)
- **Render Performance**: Optimized with React.memo and useMemo
- **Memory Usage**: Proper cleanup and disposal
- **Tree Shaking**: Full ES modules support
- **Development Speed**: Ultra-fast with modern Rust tooling

## 🔒 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- iOS Safari 14+
- Android Chrome 88+

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Apache ECharts](https://echarts.apache.org/) - The powerful charting library that powers this component
- [React](https://reactjs.org/) - The UI library
- [TypeScript](https://www.typescriptlang.org/) - For type safety and developer experience
- Modern Rust tooling: [Bun](https://bun.sh/), [Rolldown](https://rolldown.rs/), [Oxlint](https://oxc-project.github.io/), [dprint](https://dprint.dev/)

## 🔗 Links

- [Documentation](https://yourusername.github.io/aqc-charts)
- [Examples](https://yourusername.github.io/aqc-charts/examples)
- [API Reference](https://yourusername.github.io/aqc-charts/api)
- [npm Package](https://www.npmjs.com/package/aqc-charts)
- [GitHub Repository](https://github.com/yourusername/aqc-charts)
- [Issue Tracker](https://github.com/yourusername/aqc-charts/issues)

---

<div align="center">

**[⭐ Star us on GitHub](https://github.com/yourusername/aqc-charts) | [📖 Read the Docs](https://yourusername.github.io/aqc-charts) | [💬 Join Discussions](https://github.com/yourusername/aqc-charts/discussions)**

Made with ❤️ by the AQC Charts team

</div>