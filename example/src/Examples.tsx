import React, { useState } from 'react';
import { LineChartExample } from './components/LineChartExample';
import { BarChartExample } from './components/BarChartExample';
import { PieChartExample } from './components/PieChartExample';
import { ScatterChartExample } from './components/ScatterChartExample';
import { ClusterChartExample } from './components/ClusterChartExample';
import { CalendarHeatmapExample } from './components/CalendarHeatmapExample';
import { SankeyChartExample } from './components/SankeyChartExample';
import { GanttChartExample } from './components/GanttChartExample';
import { RegressionChartExample } from './components/RegressionChartExample';
import { CombinedChartExample } from './components/CombinedChartExample';


// Component for theme and palette selection
const ThemeSelector = ({
  theme,
  setTheme,
  palette,
  setPalette
}: {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  palette: string;
  setPalette: (palette: string) => void;
}) => (
  <div style={{
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: theme === 'dark' ? '#1f1f1f' : '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '20px',
    border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`
  }}>
    <div>
      <label style={{
        marginRight: '10px',
        fontWeight: 'bold',
        color: theme === 'dark' ? '#fff' : '#333'
      }}>
        Theme:
      </label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
        style={{
          padding: '5px 10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          color: theme === 'dark' ? '#fff' : '#333'
        }}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>

    <div>
      <label style={{
        marginRight: '10px',
        fontWeight: 'bold',
        color: theme === 'dark' ? '#fff' : '#333'
      }}>
        Color Palette:
      </label>
      <select
        value={palette}
        onChange={(e) => setPalette(e.target.value)}
        style={{
          padding: '5px 10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          color: theme === 'dark' ? '#fff' : '#333'
        }}
      >
        <option value="default">Default</option>
        <option value="vibrant">Vibrant</option>
        <option value="pastel">Pastel</option>
        <option value="business">Business</option>
        <option value="earth">Earth</option>
      </select>
    </div>
  </div>
);

// Chart card wrapper component
const ChartCard = ({
  title,
  description,
  children,
  theme
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  theme: 'light' | 'dark';
}) => (
  <div style={{
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: theme === 'dark'
      ? '0 4px 6px rgba(0, 0, 0, 0.3)'
      : '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme === 'dark' ? '#333' : '#e1e5e9'}`,
    marginBottom: '30px'
  }}>
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{
        margin: '0 0 8px 0',
        fontSize: '20px',
        fontWeight: '600',
        color: theme === 'dark' ? '#fff' : '#1a1a1a'
      }}>
        {title}
      </h3>
      <p style={{
        margin: 0,
        fontSize: '14px',
        color: theme === 'dark' ? '#ccc' : '#666',
        lineHeight: 1.5
      }}>
        {description}
      </p>
    </div>
    {children}
  </div>
);

// Simplified color palettes - no need for theme-specific variants since the library handles theme styling
const colorPalettes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
  pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFD9BA', '#E6E6FA', '#D3FFD3', '#FFCCFF'],
  business: ['#2E4057', '#048A81', '#54C6EB', '#F8B500', '#B83A4B', '#5C7A89', '#A8E6CF', '#FFB6B3'],
  earth: ['#8B4513', '#228B22', '#4682B4', '#DAA520', '#CD853F', '#32CD32', '#6495ED', '#FF8C00'],
};

export function Examples() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [palette, setPalette] = useState('default');
  const [interactionData, setInteractionData] = useState<string>('');

  // Color palettes are now theme-agnostic since the library automatically handles:
  // - Theme-aware backgrounds, text colors, axis colors, grid colors, tooltips, and legends
  // - Proper chart reinitialization on theme changes
  // This makes the example much simpler and more maintainable!

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: theme === 'dark' ? '#0f0f0f' : '#f5f7fa',
    color: theme === 'dark' ? '#fff' : '#333',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '40px',
    padding: '40px 0',
    borderBottom: `2px solid ${theme === 'dark' ? '#333' : '#e1e5e9'}`,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{
          fontSize: '36px',
          margin: '0 0 10px 0',
          fontWeight: '700',
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🚀 AQC Chart Components
        </h1>
        <p style={{
          fontSize: '18px',
          margin: 0,
          color: theme === 'dark' ? '#ccc' : '#666',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.6
        }}>
          Experience the new intuitive API for creating beautiful, interactive charts with minimal code.
          Simply pass your data and field mappings - no complex configuration objects required!
        </p>
      </div>

      {/* Theme Controls */}
      <ThemeSelector
        theme={theme}
        setTheme={setTheme}
        palette={palette}
        setPalette={setPalette}
      />

      {/* Interaction Feedback */}
      {interactionData && (
        <div style={{
          padding: '15px',
          backgroundColor: theme === 'dark' ? '#2d5016' : '#d4edda',
          border: `1px solid ${theme === 'dark' ? '#4f7c2a' : '#c3e6cb'}`,
          borderRadius: '8px',
          marginBottom: '20px',
          fontFamily: 'monospace',
          fontSize: '14px',
          color: theme === 'dark' ? '#d1e7dd' : '#155724',
        }}>
          <strong>Chart Interaction:</strong> {interactionData}
        </div>
      )}

      {/* Line Charts Showcase */}
      <ChartCard
        title="📈 Line Chart Showcase"
        description="Demonstrate different line chart configurations: simple lines, time series, multiple series, grouped data, and advanced styling with animations."
        theme={theme}
      >
        <LineChartExample
          theme={theme}
          colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
          onInteraction={(data) => setInteractionData(data)}
        />
      </ChartCard>

      {/* Bar Charts Showcase */}
      <ChartCard
        title="📊 Bar Chart Showcase"
        description="Demonstrate different bar chart configurations: vertical bars, horizontal bars, stacked bars, and grouped data visualization."
        theme={theme}
      >
        <BarChartExample
          theme={theme}
          colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
          onInteraction={(data) => setInteractionData(data)}
        />
      </ChartCard>

      {/* Combined Charts Showcase */}
      <ChartCard
        title="🎯 Combined Chart Showcase"
        description="Demonstrate mixed line and bar visualizations: dual Y-axes, sales & temperature analysis, revenue & growth tracking, and production efficiency monitoring."
        theme={theme}
      >
        <CombinedChartExample />
      </ChartCard>c

      {/* Pie Charts Showcase */}
      <ChartCard
        title="🥧 Pie Chart Showcase"
        description="Demonstrate different pie chart configurations: basic pie, donut chart, rose chart, and custom styling with market data visualization."
        theme={theme}
      >
        <PieChartExample
          theme={theme}
          colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
          onInteraction={(data) => setInteractionData(data)}
        />
      </ChartCard>

      {/* Example 8: Scatter Chart Showcase */}
      <ChartCard
        title="🔹 Scatter Chart Showcase"
        description="Demonstrate scatter plot visualizations: basic scatter plots, multiple series, bubble charts with size dimensions, and correlation analysis with trend lines."
        theme={theme}
      >
        <ScatterChartExample
          theme={theme}
          colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
          onInteraction={(data) => setInteractionData(data)}
        />
      </ChartCard>

      {/* Cluster Chart Showcase */}
      <ChartCard
        title="🔬 Cluster Chart Showcase"
        description="Demonstrate K-means clustering visualizations: automatic pattern detection, customer segmentation, performance analysis, and biological classification."
        theme={theme}
      >
        <ClusterChartExample
          theme={theme}
          colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
          onInteraction={(data) => setInteractionData(data)}
        />
      </ChartCard>

      {/* Calendar Heatmap Showcase */}
      <ChartCard
        title="📅 Calendar Heatmap Showcase"
        description="Visualize time series data with a calendar heatmap: daily, weekly, and monthly views, highlighting trends and patterns over time."
        theme={theme}
      >
        <CalendarHeatmapExample
          theme={theme}
          colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
          onInteraction={(data) => setInteractionData(data)}
        />
      </ChartCard>

      {/* Sankey Chart Showcase */}
      <ChartCard
        title="🌊 Sankey Chart Showcase"
        description="Visualize flow and relationships between categories: budget flows, energy distribution, customer journeys, and website traffic analysis with interactive node and link exploration."
        theme={theme}
      >
        <SankeyChartExample
          theme={theme}
          colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
          onInteraction={(data) => setInteractionData(data)}
        />
      </ChartCard>

      {/* Gantt Chart Showcase */}
      <ChartCard
        title="📅 Gantt Chart Showcase"
        description="Project timeline visualization: task scheduling, progress tracking, resource allocation, and dependency management with interactive timeline navigation and status monitoring."
        theme={theme}
      >
        <GanttChartExample
          theme={theme}
          colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
          onInteraction={(data) => setInteractionData(data)}
        />
      </ChartCard>

      {/* Regression Chart Showcase */}
      <ChartCard
        title="📈 Regression Chart Showcase"
        description="Statistical analysis and trend visualization: linear, polynomial, exponential, and logarithmic regression with equation display, R-squared values, and interactive method comparison."
        theme={theme}
      >
        <RegressionChartExample />
      </ChartCard>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '40px 0',
        borderTop: `2px solid ${theme === 'dark' ? '#333' : '#e1e5e9'}`,
        marginTop: '40px',
        color: theme === 'dark' ? '#666' : '#999',
        fontSize: '14px'
      }}>
        <p>🎨 Built with the new Ergonomic Chart Components API</p>
        <p>Try clicking on data points and hovering over charts to see interactive features!</p>
      </div>
    </div>
  );
}