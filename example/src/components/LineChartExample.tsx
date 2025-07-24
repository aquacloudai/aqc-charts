import React from 'react';
import { LineChart } from 'aqc-charts';

// Sample datasets for line chart demonstrations
const salesData = [
  { month: 'Jan', sales: 4200, profit: 820, expenses: 3380, customers: 245 },
  { month: 'Feb', sales: 4800, profit: 1100, expenses: 3700, customers: 287 },
  { month: 'Mar', sales: 3900, profit: 750, expenses: 3150, customers: 198 },
  { month: 'Apr', sales: 5200, profit: 1350, expenses: 3850, customers: 315 },
  { month: 'May', sales: 3600, profit: 600, expenses: 3000, customers: 182 },
  { month: 'Jun', sales: 6100, profit: 1680, expenses: 4420, customers: 398 },
  { month: 'Jul', sales: 5800, profit: 1520, expenses: 4280, customers: 372 },
  { month: 'Aug', sales: 5500, profit: 1430, expenses: 4070, customers: 356 },
  { month: 'Sep', sales: 4700, profit: 1050, expenses: 3650, customers: 289 },
  { month: 'Oct', sales: 5300, profit: 1380, expenses: 3920, customers: 324 },
  { month: 'Nov', sales: 5900, profit: 1590, expenses: 4310, customers: 367 },
  { month: 'Dec', sales: 6800, profit: 1870, expenses: 4930, customers: 425 },
];

const temperatureData = [
  { date: '2024-01-01', temperature: 2.5, humidity: 65, precipitation: 0 },
  { date: '2024-01-02', temperature: 4.1, humidity: 68, precipitation: 2.3 },
  { date: '2024-01-03', temperature: 1.8, humidity: 72, precipitation: 5.1 },
  { date: '2024-01-04', temperature: -0.5, humidity: 58, precipitation: 0 },
  { date: '2024-01-05', temperature: -2.8, humidity: 54, precipitation: 0 },
  { date: '2024-01-06', temperature: -4.2, humidity: 48, precipitation: 0 },
  { date: '2024-01-07', temperature: -1.5, humidity: 52, precipitation: 1.2 },
  { date: '2024-01-08', temperature: 1.2, humidity: 61, precipitation: 2.8 },
  { date: '2024-01-09', temperature: 3.8, humidity: 67, precipitation: 0.5 },
  { date: '2024-01-10', temperature: 6.5, humidity: 72, precipitation: 3.1 },
];

// New dataset to demonstrate financial performance with negative values
const performanceData = [
  { quarter: 'Q1 2023', growth: 15.2, margin: 8.5, satisfaction: 7.8 },
  { quarter: 'Q2 2023', growth: 22.8, margin: 12.1, satisfaction: 8.2 },
  { quarter: 'Q3 2023', growth: -8.4, margin: -2.3, satisfaction: 6.9 },
  { quarter: 'Q4 2023', growth: -15.6, margin: -7.8, satisfaction: 6.1 },
  { quarter: 'Q1 2024', growth: 5.3, margin: 2.1, satisfaction: 7.3 },
  { quarter: 'Q2 2024', growth: 18.9, margin: 9.7, satisfaction: 8.0 },
];

const stockData = [
  { time: '09:30', price: 150.25, volume: 1250000 },
  { time: '10:00', price: 152.10, volume: 980000 },
  { time: '10:30', price: 148.75, volume: 1420000 },
  { time: '11:00', price: 151.50, volume: 1100000 },
  { time: '11:30', price: 153.20, volume: 890000 },
  { time: '12:00', price: 152.80, volume: 750000 },
  { time: '12:30', price: 154.10, volume: 920000 },
  { time: '13:00', price: 155.75, volume: 1350000 },
  { time: '13:30', price: 154.90, volume: 1050000 },
  { time: '14:00', price: 156.30, volume: 1180000 },
  { time: '14:30', price: 157.45, volume: 1320000 },
  { time: '15:00', price: 158.20, volume: 1450000 },
];

const departmentData = [
  { quarter: 'Q1 2023', department: 'Engineering', revenue: 450000, employees: 45 },
  { quarter: 'Q1 2023', department: 'Marketing', revenue: 230000, employees: 25 },
  { quarter: 'Q1 2023', department: 'Sales', revenue: 340000, employees: 35 },
  { quarter: 'Q2 2023', department: 'Engineering', revenue: 520000, employees: 48 },
  { quarter: 'Q2 2023', department: 'Marketing', revenue: 280000, employees: 28 },
  { quarter: 'Q2 2023', department: 'Sales', revenue: 390000, employees: 38 },
  { quarter: 'Q3 2023', department: 'Engineering', revenue: 480000, employees: 46 },
  { quarter: 'Q3 2023', department: 'Marketing', revenue: 250000, employees: 24 },
  { quarter: 'Q3 2023', department: 'Sales', revenue: 410000, employees: 41 },
  { quarter: 'Q4 2023', department: 'Engineering', revenue: 580000, employees: 52 },
  { quarter: 'Q4 2023', department: 'Marketing', revenue: 320000, employees: 31 },
  { quarter: 'Q4 2023', department: 'Sales', revenue: 450000, employees: 44 },
];

interface LineChartExampleProps {
  theme: 'light' | 'dark';
  colorPalette: readonly string[];
  onInteraction?: (data: string) => void;
}

export function LineChartExample({ theme, colorPalette, onInteraction }: LineChartExampleProps) {
  return (
    <>
      {/* Example 1: Simple Business Metrics */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📊 Business Metrics Overview
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Single dataset with multiple metrics displayed as separate lines. Uses object data with field mapping for intuitive data binding.
        </p>
        <LineChart
          data={salesData}
          xField="month"
          yField={['sales', 'profit', 'expenses']}
          title="Monthly Business Performance"
          subtitle="Sales, Profit & Expenses Tracking"
          height={400}
          theme={theme}
          colorPalette={colorPalette}
          smooth
          xAxis={{
            boundaryGap: false, // Line starts exactly at the axis
          }}
          showArea
          areaOpacity={0.15}
          legend={{ show: true, position: 'right', align: 'center' }}
          tooltip={{
            show: true,
            trigger: 'axis'
          }}
          onDataPointClick={(data) => {
            onInteraction?.(`Clicked on ${data.name} at ${data.axisValue}: ${data.value}`);
          }}
          zoom
          responsive
        />
      </div>

      {/* Example 2: Line Styles Demo */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          🎨 Line Style Demonstration
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Simple demo showing solid, dashed, and dotted line styles working correctly with different colors and widths.
        </p>
        <LineChart
          data={[
            { x: 'Jan', solid: 10, dashed: 15, dotted: 8 },
            { x: 'Feb', solid: 22, dashed: 18, dotted: 15 },
            { x: 'Mar', solid: 28, dashed: 32, dotted: 20 },
            { x: 'Apr', solid: 23, dashed: 28, dotted: 18 },
            { x: 'May', solid: 19, dashed: 25, dotted: 22 },
            { x: 'Jun', solid: 25, dashed: 30, dotted: 16 },
          ]}
          series={[
            {
              name: 'Solid Line',
              data: [
                { x: 'Jan', y: 10 },
                { x: 'Feb', y: 22 },
                { x: 'Mar', y: 28 },
                { x: 'Apr', y: 23 },
                { x: 'May', y: 19 },
                { x: 'Jun', y: 25 },
              ],
              color: '#ff6b6b',
              strokeStyle: 'solid',
              strokeWidth: 3,
              smooth: false,
              showPoints: true,
            },
            {
              name: 'Dashed Line',
              data: [
                { x: 'Jan', y: 15 },
                { x: 'Feb', y: 18 },
                { x: 'Mar', y: 32 },
                { x: 'Apr', y: 28 },
                { x: 'May', y: 25 },
                { x: 'Jun', y: 30 },
              ],
              color: '#4ecdc4',
              strokeStyle: 'dashed',
              strokeWidth: 3,
              smooth: false,
              showPoints: true,
            },
            {
              name: 'Dotted Line',
              data: [
                { x: 'Jan', y: 8 },
                { x: 'Feb', y: 15 },
                { x: 'Mar', y: 20 },
                { x: 'Apr', y: 18 },
                { x: 'May', y: 22 },
                { x: 'Jun', y: 16 },
              ],
              color: '#45b7d1',
              strokeStyle: 'dotted',
              strokeWidth: 3,
              smooth: false,
              showPoints: true,
              pointShape: 'diamond',
              pointSize: 8,
            },
          ]}
          xField="x"
          yField="y"
          title="Line Style Test - Solid, Dashed, Dotted"
          height={350}
          theme={theme}
          legend={{ show: true, position: 'bottom' }}
          tooltip={{
            show: true,
            trigger: 'axis'
          }}
          responsive
        />
      </div>

      {/* Example 3: Stock Price with Volume */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📈 Stock Price Movement
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Financial data visualization with emphasis styling. Shows price movement with interactive highlighting and custom point styling.
        </p>
        <LineChart
          data={stockData}
          xField="time"
          yField="price"
          title="AAPL Stock Price - Intraday"
          subtitle="Real-time price movement with volume data"
          height={350}
          theme={theme}
          colorPalette={[colorPalette[3]]}
          smooth={false}
          strokeWidth={2.5}
          pointSize={6}
          pointShape="circle"
          showPoints
          legend={{ show: false }}
          tooltip={{
            show: true,
            trigger: 'item',
            format: (params: any) => `
              <div style="padding: 8px;">
                <strong>${params.axisValue}</strong><br/>
                Price: $${params.value}<br/>
                Volume: ${stockData[params.dataIndex]?.volume?.toLocaleString()}
              </div>
            `,
          }}
          xAxis={{
            type: 'category',
            label: 'Time',
            rotate: 45
          }}
          yAxis={{
            label: 'Price ($)',
            format: '${value}',
            grid: true
          }}
          onDataPointHover={(data) => {
            onInteraction?.(`Hovering over price at ${data.axisValue}: $${data.value}`);
          }}
          responsive
        />
      </div>

      {/* Example 4: Department Revenue Grouped */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          🏢 Department Performance Analysis
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Grouped data by department field. Automatically creates multiple series from a single dataset using the seriesField prop for data grouping.
        </p>
        <LineChart
          data={departmentData}
          xField="quarter"
          yField="revenue"
          seriesField="department"
          title="Revenue by Department"
          subtitle="Quarterly performance across departments"
          height={380}
          theme={theme}
          colorPalette={colorPalette}
          smooth
          showPoints
          pointSize={5}
          legend={{
            show: true,
            position: 'top',
            orientation: 'horizontal',
            align: 'center'
          }}
          tooltip={{
            show: true,
            trigger: 'axis'
          }}
          yAxis={{
            label: 'Revenue ($)',
            format: '${value:,.0f}',
            grid: true
          }}
          zoom
          pan
          onDataPointClick={(data) => {
            const dept = departmentData.find(d =>
              d.quarter === data.axisValue &&
              d.department === data.seriesName
            );
            onInteraction?.(
              `${data.seriesName} Q${data.axisValue}: $${data.value?.toLocaleString()} revenue, ${dept?.employees} employees`
            );
          }}
          responsive
        />
      </div>

      {/* Example 5: Individual Series Styling with seriesConfig */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          🎨 Individual Series Styling (seriesConfig)
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Demonstrates the new seriesConfig prop for styling each line individually. Each series can have unique colors, stroke styles, point shapes, and area settings.
        </p>
        <LineChart
          data={salesData}
          xField="month"
          yField={['sales', 'profit', 'expenses']}
          title="Business Metrics with Individual Series Styling"
          subtitle="Each line has unique styling via seriesConfig"
          height={400}
          theme={theme}
          seriesConfig={{
            'sales': {
              color: '#ff6b6b',
              strokeStyle: 'solid',
              strokeWidth: 3,
              pointShape: 'circle',
              pointSize: 6,
              showArea: true,
              areaOpacity: 0.2,
            },
            'profit': {
              color: '#4ecdc4',
              strokeStyle: 'dashed',
              strokeWidth: 2,
              pointShape: 'diamond',
              pointSize: 8,
              showArea: false,
            },
            'expenses': {
              color: '#45b7d1',
              strokeStyle: 'dotted',
              strokeWidth: 2,
              pointShape: 'square',
              pointSize: 5,
              showArea: true,
              areaOpacity: 0.1,
            }
          }}
          smooth
          legend={{ show: true, position: 'right', align: 'center' }}
          tooltip={{
            show: true,
            trigger: 'axis'
          }}
          onDataPointClick={(data) => {
            onInteraction?.(`Clicked on ${data.name} at ${data.axisValue}: ${data.value}`);
          }}
          zoom
          responsive
        />
      </div>

      {/* Example 6: Advanced Styling and Animation */}
      <div>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          ✨ Advanced Styling & Animation
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Showcase of advanced styling options including custom colors, gradient areas, animation effects, and responsive design features.
        </p>
        <LineChart
          data={salesData}
          xField="month"
          yField="customers"
          title="Customer Growth Trend"
          titlePosition="left"
          height={300}
          theme={theme}
          backgroundColor={theme === 'dark' ? '#1a1a1a' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
          colorPalette={['#ffffff']}
          smooth
          strokeWidth={4}
          pointSize={8}
          pointShape="diamond"
          showArea
          areaOpacity={0.4}
          areaGradient
          animate
          animationDuration={2000}
          legend={{ show: false }}
          tooltip={{
            show: true,
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#fff',
            textColor: '#fff'
          }}
          xAxis={{
            grid: false,
            label: 'Month'
          }}
          yAxis={{
            grid: true,
            gridColor: 'rgba(255, 255, 255, 0.2)',
            label: 'Customers',
            format: '{value}'
          }}
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: `2px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
          }}
          responsive
          maintainAspectRatio
        />
      </div>

      {/* Example 7: Negative Temperature Values */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          🌡️ Temperature with Negative Values
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          <strong>Demonstrates negative value support:</strong> Temperature data that goes below zero (freezing point).
          Notice how the chart automatically creates a zero baseline that the temperature line crosses.
        </p>
        <LineChart
          data={temperatureData}
          xField="date"
          yField="temperature"
          title="Daily Temperature (°C)"
          subtitle="Winter temperature readings with freezing days"
          height={350}
          theme={theme}
          colorPalette={['#ef4444']}
          smooth
          strokeWidth={3}
          showPoints
          pointSize={6}
          showArea
          areaOpacity={0.2}
          legend={{ show: false }}
          tooltip={{
            show: true,
            trigger: 'item',
            format: (params: any) => `
              <div style="padding: 8px;">
                <strong>${params.axisValue}</strong><br/>
                Temperature: ${params.value}°C<br/>
                ${params.value < 0 ? '❄️ Below Freezing' : '🌡️ Above Freezing'}
              </div>
            `,
          }}
          xAxis={{
            type: 'category',
            label: 'Date',
            rotate: 45
          }}
          yAxis={{
            label: 'Temperature (°C)',
            format: '{value}°C',
            grid: true
          }}
          onDataPointClick={(data) => {
            const status = data.value < 0 ? 'freezing' : 'above freezing';
            onInteraction?.(`Temperature on ${data.axisValue}: ${data.value}°C (${status})`);
          }}
          responsive
        />
        <div style={{ 
          marginTop: '15px',
          padding: '12px',
          backgroundColor: theme === 'dark' ? '#2d1b69' : '#e0e7ff',
          borderRadius: '6px',
          fontSize: '13px',
          border: `1px solid ${theme === 'dark' ? '#4c1d95' : '#c7d2fe'}`
        }}>
          <strong>🎯 Notice:</strong> The chart automatically detects negative values and creates a zero baseline.
          Days 4-7 show below-freezing temperatures properly displayed below the zero line.
        </div>
      </div>

      {/* Example 8: Business Performance with Negative Growth */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📉 Performance Metrics with Negative Growth
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          <strong>Real business scenario:</strong> Company performance during challenging periods showing negative growth and margins.
          All three metrics can cross the zero line independently.
        </p>
        <LineChart
          data={performanceData}
          xField="quarter"
          yField={['growth', 'margin']}
          seriesConfig={{
            growth: {
              color: '#3b82f6',
              strokeWidth: 3,
              smooth: true,
              showPoints: true,
              pointSize: 7,
            },
            margin: {
              color: '#ef4444',
              strokeWidth: 3,
              strokeStyle: 'dashed',
              smooth: true,
              showPoints: true,
              pointSize: 7,
            }
          }}
          title="Business Performance Analysis"
          subtitle="Growth Rate & Profit Margin Trends (%)"
          height={380}
          theme={theme}
          legend={{
            show: true,
            position: 'top',
            orientation: 'horizontal'
          }}
          tooltip={{
            show: true,
            trigger: 'axis',
            format: (params: any) => {
              const data = performanceData.find(d => d.quarter === params[0].axisValue);
              return `
                <div style="padding: 8px;">
                  <strong>${params[0].axisValue}</strong><br/>
                  Growth Rate: ${data?.growth}%<br/>
                  Profit Margin: ${data?.margin}%<br/>
                  Satisfaction: ${data?.satisfaction}/10
                </div>
              `;
            }
          }}
          xAxis={{
            type: 'category',
            label: 'Quarter'
          }}
          yAxis={{
            label: 'Percentage (%)',
            format: '{value}%',
            grid: true
          }}
          zoom
          pan
          onDataPointClick={(data) => {
            const trend = data.value > 0 ? 'positive' : 'negative';
            onInteraction?.(`${data.seriesName} in ${data.axisValue}: ${data.value}% (${trend} trend)`);
          }}
          responsive
        />
        <div style={{ 
          marginTop: '15px',
          padding: '12px',
          backgroundColor: theme === 'dark' ? '#7f1d1d' : '#fef2f2',
          borderRadius: '6px',
          fontSize: '13px',
          border: `1px solid ${theme === 'dark' ? '#dc2626' : '#fecaca'}`
        }}>
          <strong>📊 Analysis:</strong> Q3-Q4 2023 show negative growth and margins, representing a challenging period.
          The chart clearly visualizes the recovery starting in Q1 2024.
        </div>
      </div>

      {/* Example 9: Multiple Y-Axes */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📊 Multiple Y-Axes - Temperature & Sales
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Demonstrates multiple y-axes functionality. Temperature uses the left axis (°C) while sales use the right axis ($).
          Each series can be assigned to different y-axes using yAxisIndex.
        </p>
        <LineChart
          data={[
            { month: 'Jan', temperature: -2.5, sales: 12500 },
            { month: 'Feb', temperature: 1.2, sales: 15800 },
            { month: 'Mar', temperature: 8.7, sales: 18300 },
            { month: 'Apr', temperature: 15.3, sales: 22100 },
            { month: 'May', temperature: 22.1, sales: 28900 },
            { month: 'Jun', temperature: 28.4, sales: 35200 },
            { month: 'Jul', temperature: 31.2, sales: 42100 },
            { month: 'Aug', temperature: 29.8, sales: 38700 },
            { month: 'Sep', temperature: 24.6, sales: 31500 },
            { month: 'Oct', temperature: 16.9, sales: 25800 },
            { month: 'Nov', temperature: 8.3, sales: 19200 },
            { month: 'Dec', temperature: 2.1, sales: 16900 },
          ]}
          xField="month"
          yField={['temperature', 'sales']}
          seriesConfig={{
            temperature: {
              color: '#ef4444',
              strokeWidth: 3,
              smooth: true,
              showPoints: true,
              pointSize: 6,
              yAxisIndex: 0, // Left y-axis
            },
            sales: {
              color: '#22c55e',
              strokeWidth: 3,
              smooth: true,
              showPoints: true,
              pointSize: 6,
              yAxisIndex: 1, // Right y-axis
            }
          }}
          title="Temperature vs Sales Correlation"
          subtitle="Dual y-axis chart showing temperature and sales data"
          height={400}
          theme={theme}
          yAxis={[
            {
              name: 'Temperature (°C)',
              position: 'left',
              label: 'Temperature',
              format: '{value}°C',
              grid: true,
            },
            {
              name: 'Sales ($)',
              position: 'right',
              label: 'Sales',
              format: '${value:,.0f}',
              grid: false,
            }
          ]}
          legend={{
            show: true,
            position: 'top',
            orientation: 'horizontal'
          }}
          tooltip={{
            show: true,
            trigger: 'axis'
          }}
          onDataPointClick={(data) => {
            const axis = data.seriesName === 'temperature' ? 'left' : 'right';
            onInteraction?.(`Clicked ${data.seriesName} on ${axis} y-axis: ${data.value}`);
          }}
          responsive
        />
        <div style={{ 
          marginTop: '15px',
          padding: '12px',
          backgroundColor: theme === 'dark' ? '#1e3a8a' : '#eff6ff',
          borderRadius: '6px',
          fontSize: '13px',
          border: `1px solid ${theme === 'dark' ? '#3b82f6' : '#bfdbfe'}`
        }}>
          <strong>🎯 Multiple Y-Axes:</strong> Temperature scale (-10°C to 40°C) on left, Sales scale ($0 to $50k) on right.
          This allows comparing metrics with different scales on the same chart.
        </div>
      </div>
    </>
  );
}