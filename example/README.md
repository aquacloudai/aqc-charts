# AQC Charts Examples

This directory contains comprehensive examples showcasing both the classic and new ergonomic APIs of AQC Charts.

## 🚀 New Ergonomic API

The star of this example collection is the **Ergonomic Components** example, which demonstrates our revolutionary new chart API that makes creating beautiful, interactive charts incredibly simple.

### Running the Examples

```bash
# Install dependencies
bun install

# Start the development server
bun run dev
```

Open your browser to `http://localhost:5173` to view the examples.

### Navigation

The example app includes two main sections:

1. **🚀 New Ergonomic API** - Showcases the new intuitive chart components
2. **📊 Classic Examples** - Demonstrates the traditional option-based API

## 🎯 Key Features Demonstrated

### Ergonomic API Highlights

#### 1. **Intuitive Data Binding**
```tsx
// Instead of complex data transformation
<ErgonomicLineChart
  data={[
    { month: 'Jan', sales: 4200, profit: 820 },
    { month: 'Feb', sales: 4800, profit: 1100 }
  ]}
  xField="month"
  yField={['sales', 'profit']}
  title="Business Metrics"
/>
```

#### 2. **Smart Defaults**
- Automatic data type detection (numeric, categorical, time)
- Intelligent color palette selection
- Responsive design by default
- Optimized performance settings

#### 3. **Multiple Data Formats**
- **Object Arrays**: `{ month: 'Jan', value: 100 }`
- **Coordinate Arrays**: `[[x1, y1], [x2, y2]]`
- **Multiple Series**: Explicit series configuration
- **Grouped Data**: Automatic grouping by field

#### 4. **Interactive Features**
- Click and hover event handlers
- Zoom and pan capabilities
- Data highlighting
- Real-time data updates

#### 5. **Theme System**
- Built-in theme switching (light/dark)
- Multiple color palettes
- Custom styling options
- Consistent design language

### Examples Included

1. **📊 Business Metrics Overview**
   - Multi-metric line charts
   - Object data with field mapping
   - Area charts with opacity
   - Interactive tooltips

2. **🌡️ Weather Data Visualization**
   - Time-series data
   - Multiple series configuration
   - Different styling per series
   - Time axis handling

3. **📈 Stock Price Movement**
   - Financial data visualization
   - Custom point styling
   - Interactive highlighting
   - Formatted tooltips

4. **🏢 Department Performance**
   - Grouped data visualization
   - Automatic series creation
   - Advanced tooltip formatting
   - Zoom and pan features

5. **✨ Advanced Styling**
   - Custom backgrounds
   - Gradient effects
   - Animation configuration
   - Responsive design

### API Comparison

The example includes a side-by-side comparison showing:

- **70% less code** with the new API
- **Better type safety** and IntelliSense
- **More intuitive** data binding
- **Easier composition** and reuse

## 🎨 Interactive Features

### Theme Switching
Try switching between light and dark themes to see how charts adapt automatically.

### Color Palettes
Explore different built-in color schemes:
- **Default**: Professional blue-green palette
- **Vibrant**: Bold, energetic colors
- **Pastel**: Soft, gentle tones
- **Business**: Corporate-friendly colors
- **Earth**: Natural, organic tones

### Real-time Interaction
- Click on data points to see detailed information
- Hover over charts for contextual tooltips
- Use zoom and pan on supported charts
- Watch real-time feedback in the interaction panel

## 🔧 Development

### File Structure

```
example/
├── src/
│   ├── App.tsx                     # Main app with view switcher
│   ├── ErgonomicComponentsExample.tsx  # New API showcase
│   ├── TemperatureExample.tsx      # Classic API examples
│   ├── ApiIntegrationExample.tsx   # API patterns
│   ├── ScatterExample.tsx          # Scatter chart demos
│   ├── RegressionExample.tsx       # Statistical analysis
│   └── AdvancedScatterExample.tsx  # Advanced features
├── package.json
├── vite.config.ts
└── README.md
```

### Building for Production

```bash
# Build the example
bun run build

# Preview the built example
bun run preview
```

## 📚 Learning Path

1. **Start with the Ergonomic API** - See how simple chart creation can be
2. **Explore data formats** - Try different ways to structure your data
3. **Experiment with styling** - Test themes, colors, and custom options
4. **Add interactivity** - Implement click handlers and real-time updates
5. **Compare with classic API** - Understand the improvements made

## 🤝 Contributing

Found an issue or want to add a new example? Contributions are welcome! Please:

1. Keep examples focused and educational
2. Include comments explaining key concepts
3. Follow the existing code style
4. Test in both light and dark themes

## 📖 Documentation

For comprehensive documentation, visit the main project README or explore the inline comments in each example file.

---

**Happy charting!** 🎉