import React from 'react';
import { LineChart } from '@/components/LineChart';

// Sample data for demonstrations
const salesData = [
  { month: 'Jan', sales: 120, profit: 25, expenses: 95 },
  { month: 'Feb', sales: 132, profit: 30, expenses: 102 },
  { month: 'Mar', sales: 101, profit: 18, expenses: 83 },
  { month: 'Apr', sales: 134, profit: 28, expenses: 106 },
  { month: 'May', sales: 90, profit: 12, expenses: 78 },
  { month: 'Jun', sales: 230, profit: 55, expenses: 175 },
  { month: 'Jul', sales: 210, profit: 48, expenses: 162 },
  { month: 'Aug', sales: 214, profit: 52, expenses: 162 },
  { month: 'Sep', sales: 155, profit: 35, expenses: 120 },
  { month: 'Oct', sales: 178, profit: 42, expenses: 136 },
  { month: 'Nov', sales: 189, profit: 45, expenses: 144 },
  { month: 'Dec', sales: 203, profit: 48, expenses: 155 },
];

const timeSeriesData = [
  { date: '2023-01-01', temperature: 15, humidity: 65 },
  { date: '2023-01-02', temperature: 18, humidity: 70 },
  { date: '2023-01-03', temperature: 12, humidity: 60 },
  { date: '2023-01-04', temperature: 20, humidity: 75 },
  { date: '2023-01-05', temperature: 22, humidity: 80 },
  { date: '2023-01-06', temperature: 19, humidity: 68 },
  { date: '2023-01-07', temperature: 16, humidity: 62 },
];

const departmentData = [
  { quarter: 'Q1', department: 'Engineering', revenue: 450 },
  { quarter: 'Q1', department: 'Marketing', revenue: 230 },
  { quarter: 'Q1', department: 'Sales', revenue: 340 },
  { quarter: 'Q2', department: 'Engineering', revenue: 520 },
  { quarter: 'Q2', department: 'Marketing', revenue: 280 },
  { quarter: 'Q2', department: 'Sales', revenue: 390 },
  { quarter: 'Q3', department: 'Engineering', revenue: 480 },
  { quarter: 'Q3', department: 'Marketing', revenue: 250 },
  { quarter: 'Q3', department: 'Sales', revenue: 410 },
  { quarter: 'Q4', department: 'Engineering', revenue: 580 },
  { quarter: 'Q4', department: 'Marketing', revenue: 320 },
  { quarter: 'Q4', department: 'Sales', revenue: 450 },
];

export function ErgonomicLineChartExamples() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h1>Ergonomic LineChart Examples</h1>
      
      {/* Example 1: Simple single line chart */}
      <div style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>1. Simple Single Line Chart</h2>
        <p>Basic line chart showing sales over time with object data and field mapping.</p>
        <LineChart
          data={salesData}
          xField="month"
          yField="sales"
          title="Monthly Sales"
          height={300}
          smooth
          showPoints
          colorPalette={['#1890ff']}
        />
      </div>

      {/* Example 2: Multiple lines (multiple y fields) */}
      <div style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>2. Multiple Lines from Single Dataset</h2>
        <p>Multiple metrics displayed as separate lines using yField array.</p>
        <LineChart
          data={salesData}
          xField="month"
          yField={['sales', 'profit', 'expenses']}
          title="Sales, Profit & Expenses"
          subtitle="Monthly breakdown"
          height={350}
          smooth
          showArea
          areaOpacity={0.2}
          legend={{ show: true, position: 'top' }}
          tooltip={{ show: true, trigger: 'axis' }}
          colorPalette={['#1890ff', '#52c41a', '#ff4d4f']}
        />
      </div>

      {/* Example 3: Grouped data by series field */}
      <div style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>3. Grouped Data by Department</h2>
        <p>Data grouped by department field to create multiple series.</p>
        <LineChart
          data={departmentData}
          xField="quarter"
          yField="revenue"
          seriesField="department"
          title="Revenue by Department"
          height={350}
          smooth
          showPoints
          pointSize={6}
          legend={{ show: true, position: 'top' }}
          tooltip={{ show: true, trigger: 'axis' }}
          colorPalette={['#722ed1', '#13c2c2', '#fa8c16']}
        />
      </div>

      {/* Example 4: Explicit series configuration */}
      <div style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>4. Explicit Series Configuration</h2>
        <p>Using explicit series array for fine-grained control.</p>
        <LineChart
          data={timeSeriesData}
          series={[
            {
              name: 'Temperature',
              data: timeSeriesData,
              color: '#ff7875',
              smooth: true,
              showArea: true,
            },
            {
              name: 'Humidity',
              data: timeSeriesData,
              color: '#36cfc9',
              smooth: false,
              showArea: false,
            },
          ]}
          xField="date"
          yField="temperature" // For first series
          title="Weather Data"
          height={350}
          legend={{ show: true, position: 'bottom' }}
          xAxis={{ 
            type: 'time',
            label: 'Date' 
          }}
          yAxis={{ 
            label: 'Value',
            grid: true 
          }}
          tooltip={{ 
            show: true, 
            trigger: 'axis',
            format: '{b}<br/>{a}: {c}'
          }}
        />
      </div>

      {/* Example 5: Interactive features */}
      <div style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>5. Interactive Features</h2>
        <p>Chart with zoom, pan, and interaction capabilities.</p>
        <LineChart
          data={salesData}
          xField="month"
          yField={['sales', 'profit']}
          title="Interactive Sales Chart"
          height={350}
          zoom
          pan
          brush
          smooth
          showArea
          colorPalette={['#9c88ff', '#ffc53d']}
          legend={{ show: true, position: 'top' }}
          tooltip={{ show: true, trigger: 'axis' }}
          onDataPointClick={(data, event) => {
            console.log('Data point clicked:', data, event);
          }}
          onDataPointHover={(data, event) => {
            console.log('Data point hovered:', data, event);
          }}
        />
      </div>

      {/* Example 6: Custom styling and themes */}
      <div style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>6. Custom Styling</h2>
        <p>Custom colors, styling, and theme options.</p>
        <LineChart
          data={salesData}
          xField="month"
          yField="sales"
          title="Styled Sales Chart"
          height={300}
          theme="dark"
          backgroundColor="#1f1f1f"
          smooth
          strokeWidth={3}
          pointSize={8}
          pointShape="diamond"
          showArea
          areaOpacity={0.4}
          colorPalette={['#ff6b6b']}
          titlePosition="left"
          style={{
            border: '2px solid #333',
            borderRadius: '12px',
          }}
        />
      </div>

      {/* Comparison with old API */}
      <div style={{ marginBottom: '40px', backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
        <h2>API Comparison</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3>❌ Old API (Complex)</h3>
            <pre style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px', fontSize: '12px' }}>
{`<LineChart
  data={{
    categories: ['Jan', 'Feb', 'Mar'],
    series: [{
      name: 'Sales',
      data: [120, 132, 101],
      smooth: true,
      area: true
    }]
  }}
  option={{
    title: { text: 'Sales' },
    legend: { show: true },
    tooltip: { trigger: 'axis' }
  }}
/>`}
            </pre>
          </div>
          <div>
            <h3>✅ New API (Intuitive)</h3>
            <pre style={{ backgroundColor: '#f6ffed', padding: '15px', borderRadius: '4px', fontSize: '12px' }}>
{`<ErgonomicLineChart
  data={[
    { month: 'Jan', sales: 120 },
    { month: 'Feb', sales: 132 },
    { month: 'Mar', sales: 101 }
  ]}
  xField="month"
  yField="sales"
  title="Sales"
  smooth
  showArea
  legend={{ show: true }}
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}