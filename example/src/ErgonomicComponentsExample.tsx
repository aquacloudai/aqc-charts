import React, { useState } from 'react';
import { LineChart, BarChart, PieChart } from 'aqc-charts';

// Sample datasets for demonstration
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
  { date: '2024-01-05', temperature: 3.2, humidity: 63, precipitation: 1.2 },
  { date: '2024-01-06', temperature: 6.8, humidity: 75, precipitation: 3.4 },
  { date: '2024-01-07', temperature: 8.1, humidity: 71, precipitation: 0.8 },
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

const platformData = [
  { platform: 'Desktop', users: 45600, revenue: 342000 },
  { platform: 'Mobile', users: 38200, revenue: 287000 },
  { platform: 'Tablet', users: 12400, revenue: 93000 },
  { platform: 'Smart TV', users: 3800, revenue: 28500 },
];

const marketShareData = [
  { company: 'Apple', share: 28.4, color: '#007AFF' },
  { company: 'Samsung', share: 22.1, color: '#1428A0' },
  { company: 'Xiaomi', share: 11.8, color: '#FF6900' },
  { company: 'OPPO', share: 10.9, color: '#1BAA3A' },
  { company: 'Vivo', share: 9.2, color: '#5856D6' },
  { company: 'Others', share: 17.6, color: '#8E8E93' },
];

const performanceData = [
  { department: 'Engineering', score: 89, budget: 2400000 },
  { department: 'Marketing', score: 76, budget: 800000 },
  { department: 'Sales', score: 94, budget: 1200000 },
  { department: 'HR', score: 82, budget: 400000 },
  { department: 'Finance', score: 88, budget: 600000 },
  { department: 'Operations', score: 85, budget: 900000 },
];

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

export function ErgonomicComponentsExample() {
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

      {/* Example 1: Simple Business Metrics */}
      <ChartCard
        title="📊 Business Metrics Overview"
        description="Single dataset with multiple metrics displayed as separate lines. Uses object data with field mapping for intuitive data binding."
        theme={theme}
      >
        <LineChart
          data={salesData}
          xField="month"
          yField={['sales', 'profit', 'expenses']}
          title="Monthly Business Performance"
          subtitle="Sales, Profit & Expenses Tracking"
          height={400}
          theme={theme}
          colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
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
            setInteractionData(`Clicked on ${data.name} at ${data.axisValue}: ${data.value}`);
          }}
          zoom
          responsive
        />
      </ChartCard>

      {/* Example 2: Weather Time Series */}
      <ChartCard
        title="🌡️ Weather Data Visualization"
        description="Time-based data with multiple series configuration. Demonstrates smooth curves, different styling per series, and time axis handling."
        theme={theme}
      >
        <LineChart
          data={temperatureData}
          series={[
            {
              name: 'Temperature (°C)',
              data: temperatureData,
              color: colorPalettes[palette as keyof typeof colorPalettes][0],
              smooth: true,
              showArea: true,
            },
            {
              name: 'Humidity (%)',
              data: temperatureData,
              color: colorPalettes[palette as keyof typeof colorPalettes][1],
              smooth: false,
              showArea: false,
            },
          ]}
          xField="date"
          yField="temperature" // Used for first series, others use their own field mapping
          title="Daily Weather Conditions"
          height={350}
          theme={theme}
          legend={{ show: true, position: 'bottom' }}
          xAxis={{
            type: 'time',
            label: 'Date',
            grid: true,
            gridColor: theme === 'dark' ? '#333' : '#f0f0f0',
            boundaryGap: false // Line starts exactly at the axis
          }}
          yAxis={{
            label: 'Value',
            grid: true,
            gridColor: theme === 'dark' ? '#333' : '#f0f0f0'
          }}
          tooltip={{
            show: true,
            trigger: 'axis'
          }}
          responsive
        />
      </ChartCard>

      {/* Example 3: Stock Price with Volume */}
      <ChartCard
        title="📈 Stock Price Movement"
        description="Financial data visualization with emphasis styling. Shows price movement with interactive highlighting and custom point styling."
        theme={theme}
      >
        <LineChart
          data={stockData}
          xField="time"
          yField="price"
          title="AAPL Stock Price - Intraday"
          subtitle="Real-time price movement with volume data"
          height={350}
          theme={theme}
          colorPalette={[colorPalettes[palette as keyof typeof colorPalettes][3]]}
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
            setInteractionData(`Hovering over price at ${data.axisValue}: $${data.value}`);
          }}
          responsive
        />
      </ChartCard>

      {/* Example 4: Department Revenue Grouped */}
      <ChartCard
        title="🏢 Department Performance Analysis"
        description="Grouped data by department field. Automatically creates multiple series from a single dataset using the seriesField prop for data grouping."
        theme={theme}
      >
        <LineChart
          data={departmentData}
          xField="quarter"
          yField="revenue"
          seriesField="department"
          title="Revenue by Department"
          subtitle="Quarterly performance across departments"
          height={380}
          theme={theme}
          colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
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
            setInteractionData(
              `${data.seriesName} Q${data.axisValue}: $${data.value?.toLocaleString()} revenue, ${dept?.employees} employees`
            );
          }}
          responsive
        />
      </ChartCard>

      {/* Example 5: Advanced Styling and Animation */}
      <ChartCard
        title="✨ Advanced Styling & Animation"
        description="Showcase of advanced styling options including custom colors, gradient areas, animation effects, and responsive design features."
        theme={theme}
      >
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
      </ChartCard>

      {/* Example 6: Bar Chart Variations */}
      <ChartCard
        title="📊 Bar Chart Showcase"
        description="Demonstrate different bar chart configurations: vertical bars, horizontal bars, stacked bars, and grouped data visualization."
        theme={theme}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
          {/* Vertical Bar Chart */}
          <div>
            <h5 style={{
              color: theme === 'dark' ? '#fff' : '#333',
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              📈 Vertical Bars - Monthly Sales
            </h5>
            <BarChart
              data={salesData.slice(0, 6)} // First 6 months
              categoryField="month"
              valueField="sales"
              title="Q1-Q2 Sales"
              height={280}
              theme={theme}
              colorPalette={[colorPalettes[palette as keyof typeof colorPalettes][0]]}
              orientation="vertical"
              borderRadius={4}
              tooltip={{
                show: true,
                trigger: 'item'
              }}
              onDataPointClick={(data) => {
                setInteractionData(`Clicked on ${data.name}: $${data.value?.toLocaleString()}`);
              }}
            />
          </div>

          {/* Horizontal Bar Chart */}
          <div>
            <h5 style={{
              color: theme === 'dark' ? '#fff' : '#333',
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              📊 Horizontal Bars - Department Revenue
            </h5>
            <BarChart
              data={departmentData.filter(d => d.quarter === 'Q4 2023')}
              categoryField="department"
              valueField="revenue"
              title="Q4 2023 Revenue"
              height={280}
              theme={theme}
              colorPalette={[colorPalettes[palette as keyof typeof colorPalettes][1]]}
              orientation="horizontal"
              borderRadius={6}
              tooltip={{
                show: true,
                trigger: 'item',
                format: (params: any) => `
                  <div style="padding: 8px;">
                    <strong>${params.name}</strong><br/>
                    Revenue: $${params.value?.toLocaleString()}<br/>
                    Employees: ${departmentData.find(d => d.department === params.name && d.quarter === 'Q4 2023')?.employees}
                  </div>
                `,
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          {/* Multiple Series Bar Chart */}
          <div>
            <h5 style={{
              color: theme === 'dark' ? '#fff' : '#333',
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              📊 Grouped Bars - Multi-Metric
            </h5>
            <BarChart
              data={salesData.slice(0, 6)}
              categoryField="month"
              valueField={['sales', 'profit']}
              title="Sales vs Profit"
              height={280}
              theme={theme}
              colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
              orientation="vertical"
              barGap="20%"
              borderRadius={3}
              legend={{ show: true, position: 'top' }}
              tooltip={{
                show: true,
                trigger: 'axis',
              }}
            />
          </div>

          {/* Stacked Bar Chart */}
          <div>
            <h5 style={{
              color: theme === 'dark' ? '#fff' : '#333',
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              📚 Stacked Bars - Department by Quarter
            </h5>
            <BarChart
              data={departmentData}
              categoryField="quarter"
              valueField="revenue"
              seriesField="department"
              title="Revenue by Quarter"
              height={280}
              theme={theme}
              colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
              orientation="vertical"
              stack={true}
              stackType="normal"
              borderRadius={2}
              legend={{ show: true, position: 'top' }}
              tooltip={{
                show: true,
                trigger: 'axis',
              }}
              onDataPointClick={(data) => {
                setInteractionData(`${data.seriesName} in ${data.name}: $${data.value?.toLocaleString()}`);
              }}
            />
          </div>
        </div>

        {/* Percentage Example Section */}
        <div style={{ marginTop: '25px' }}>
          <h5 style={{
            color: theme === 'dark' ? '#fff' : '#333',
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            📊 Percentage Stacked Bars - Market Share Analysis
          </h5>
          <BarChart
            data={departmentData}
            categoryField="quarter"
            valueField="revenue"
            seriesField="department"
            title="Market Share by Department (%)"
            subtitle="Quarterly breakdown showing relative department contributions"
            height={350}
            theme={theme}
            colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
            orientation="vertical"
            stack={true}
            showPercentage={true}
            borderRadius={3}
            legend={{ show: true, position: 'top' }}
            tooltip={{
              show: true,
              trigger: 'axis',
            }}
            yAxis={{
              label: 'Percentage of Total',
            }}
            onDataPointClick={(data) => {
              setInteractionData(`${data.seriesName} contributed ${Math.round(data.value * 100)}% of total revenue in ${data.name}`);
            }}
          />
        </div>
      </ChartCard>

      {/* Example 7: Pie Chart Showcase */}
      <ChartCard
        title="🥧 Pie Chart Showcase"
        description="Demonstrate different pie chart configurations: basic pie, donut chart, rose chart, and custom styling with market data visualization."
        theme={theme}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
          {/* Basic Pie Chart */}
          <div>
            <h5 style={{
              color: theme === 'dark' ? '#fff' : '#333',
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              🔵 Basic Pie Chart - Platform Users
            </h5>
            <PieChart
              data={platformData}
              nameField="platform"
              valueField="users"
              title="User Distribution"
              height={300}
              theme={theme}
              colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
              showPercentages
              labelPosition="outside"
              tooltip={{
                show: true,
                trigger: 'item',
                format: (params: any) => `
                  <div style="padding: 8px;">
                    <strong>${params.name}</strong><br/>
                    Users: ${params.value?.toLocaleString()}<br/>
                    Percentage: ${params.percent}%
                  </div>
                `,
              }}
              onDataPointClick={(data: any) => {
                setInteractionData(`${data.name}: ${data.value?.toLocaleString()} users (${data.percent}%)`);
              }}
            />
          </div>

          {/* Donut Chart */}
          <div>
            <h5 style={{
              color: theme === 'dark' ? '#fff' : '#333',
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              🍩 Donut Chart - Revenue Distribution
            </h5>
            <PieChart
              data={platformData}
              nameField="platform"
              valueField="revenue"
              title="Revenue by Platform"
              height={300}
              theme={theme}
              colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
              radius={[40, 80]}
              showPercentages
              labelPosition="outside"
              legend={{ show: true, position: 'bottom' }}
              tooltip={{
                show: true,
                trigger: 'item',
                format: (params: any) => `
                  <div style="padding: 8px;">
                    <strong>${params.name}</strong><br/>
                    Revenue: $${params.value?.toLocaleString()}<br/>
                    Share: ${params.percent}%
                  </div>
                `,
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          {/* Market Share with Custom Colors */}
          <div>
            <h5 style={{
              color: theme === 'dark' ? '#fff' : '#333',
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              📊 Market Share - Custom Colors
            </h5>
            <PieChart
              data={marketShareData}
              nameField="company"
              valueField="share"
              title="Mobile Market Share"
              subtitle="Q4 2023 Global Data"
              height={300}
              theme={theme}
              colorPalette={marketShareData.map(item => item.color)}
              showPercentages
              labelPosition="inside"
              selectedMode="single"
              tooltip={{
                show: true,
                trigger: 'item',
              }}
              onDataPointClick={(data: any) => {
                setInteractionData(`${data.name} has ${data.value}% market share`);
              }}
            />
          </div>

          {/* Rose/Nightingale Chart */}
          <div>
            <h5 style={{
              color: theme === 'dark' ? '#fff' : '#333',
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              🌹 Rose Chart - Performance Scores
            </h5>
            <PieChart
              data={performanceData}
              nameField="department"
              valueField="score"
              title="Department Performance"
              subtitle="Annual Review Scores"
              height={300}
              theme={theme}
              colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
              roseType
              showLabels
              showPercentages={false}
              showValues
              labelPosition="outside"
              legend={{ show: true, position: 'right', align: 'center' }}
              tooltip={{
                show: true,
                trigger: 'item',
                format: (params: any) => `
                  <div style="padding: 8px;">
                    <strong>${params.name}</strong><br/>
                    Score: ${params.value}/100<br/>
                    Budget: $${performanceData.find(d => d.department === params.name)?.budget?.toLocaleString()}
                  </div>
                `,
              }}
              onDataPointHover={(data: any) => {
                setInteractionData(`${data.name}: ${data.value}/100 performance score`);
              }}
            />
          </div>
        </div>
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