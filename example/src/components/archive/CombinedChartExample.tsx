import React, { useState } from 'react';
import { CombinedChart } from 'aqc-charts';

interface ExampleData {
  month: string;
  sales: number;
  temperature: number;
  efficiency: number;
}

interface RevenueData {
  quarter: string;
  revenue: number;
  growth: number;
}

interface ProductionData {
  week: string;
  actual: number;
  target: number;
  efficiency: number;
}

interface ProfitLossData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number; // Can be negative
}

const salesTempData: ExampleData[] = [
  { month: 'Jan', sales: 120, temperature: 15, efficiency: 85 },
  { month: 'Feb', sales: 200, temperature: 18, efficiency: 92 },
  { month: 'Mar', sales: 150, temperature: 22, efficiency: 78 },
  { month: 'Apr', sales: 80, temperature: 28, efficiency: 88 },
  { month: 'May', sales: 170, temperature: 32, efficiency: 95 },
  { month: 'Jun', sales: 160, temperature: 35, efficiency: 90 },
];

const revenueGrowthData: RevenueData[] = [
  { quarter: 'Q1 2023', revenue: 1200, growth: 0 },
  { quarter: 'Q2 2023', revenue: 1450, growth: 20.8 },
  { quarter: 'Q3 2023', revenue: 1380, growth: -4.8 },
  { quarter: 'Q4 2023', revenue: 1680, growth: 21.7 },
  { quarter: 'Q1 2024', revenue: 1850, growth: 10.1 },
  { quarter: 'Q2 2024', revenue: 1650, growth: -10.8 }, // Added more negative data
];

const productionData: ProductionData[] = [
  { week: 'Week 1', actual: 85, target: 100, efficiency: 85 },
  { week: 'Week 2', actual: 92, target: 100, efficiency: 92 },
  { week: 'Week 3', actual: 78, target: 100, efficiency: 78 },
  { week: 'Week 4', actual: 95, target: 100, efficiency: 95 },
  { week: 'Week 5', actual: 88, target: 100, efficiency: 88 },
];

// New example data that clearly shows positive and negative values
const profitLossData: ProfitLossData[] = [
  { month: 'Jan', revenue: 5000, expenses: 4200, profit: 800 },
  { month: 'Feb', revenue: 4800, expenses: 5200, profit: -400 },
  { month: 'Mar', revenue: 6200, expenses: 4800, profit: 1400 },
  { month: 'Apr', revenue: 4500, expenses: 5800, profit: -1300 },
  { month: 'May', revenue: 7100, expenses: 4900, profit: 2200 },
  { month: 'Jun', revenue: 5200, expenses: 6100, profit: -900 },
];

export const CombinedChartExample: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<'sales' | 'revenue' | 'production' | 'profit'>('sales');

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          marginBottom: '10px',
          color: '#1f2937'
        }}>
          🎯 Combined Chart Examples
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280', 
          marginBottom: '20px' 
        }}>
          Demonstrating mixed line and bar visualizations in a single chart
        </p>
        
        {/* Example Selector */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setSelectedExample('sales')}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: selectedExample === 'sales' ? '2px solid #3b82f6' : '1px solid #d1d5db',
              backgroundColor: selectedExample === 'sales' ? '#3b82f6' : 'white',
              color: selectedExample === 'sales' ? 'white' : '#374151',
              cursor: 'pointer',
              fontWeight: selectedExample === 'sales' ? 'bold' : 'normal',
            }}
          >
            📊 Sales & Temperature
          </button>
          <button
            onClick={() => setSelectedExample('revenue')}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: selectedExample === 'revenue' ? '2px solid #3b82f6' : '1px solid #d1d5db',
              backgroundColor: selectedExample === 'revenue' ? '#3b82f6' : 'white',
              color: selectedExample === 'revenue' ? 'white' : '#374151',
              cursor: 'pointer',
              fontWeight: selectedExample === 'revenue' ? 'bold' : 'normal',
            }}
          >
            💰 Revenue & Growth
          </button>
          <button
            onClick={() => setSelectedExample('production')}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: selectedExample === 'production' ? '2px solid #3b82f6' : '1px solid #d1d5db',
              backgroundColor: selectedExample === 'production' ? '#3b82f6' : 'white',
              color: selectedExample === 'production' ? 'white' : '#374151',
              cursor: 'pointer',
              fontWeight: selectedExample === 'production' ? 'bold' : 'normal',
            }}
          >
            🏭 Production & Efficiency
          </button>
          <button
            onClick={() => setSelectedExample('profit')}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: selectedExample === 'profit' ? '2px solid #3b82f6' : '1px solid #d1d5db',
              backgroundColor: selectedExample === 'profit' ? '#3b82f6' : 'white',
              color: selectedExample === 'profit' ? 'white' : '#374151',
              cursor: 'pointer',
              fontWeight: selectedExample === 'profit' ? 'bold' : 'normal',
            }}
          >
            📈 Profit/Loss Analysis
          </button>
        </div>
      </div>

      {/* Sales & Temperature Example */}
      {selectedExample === 'sales' && (
        <div style={{ 
          marginBottom: '40px',
          padding: '25px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'semibold', 
            marginBottom: '15px',
            color: '#1f2937'
          }}>
            📊 Sales & Temperature Analysis
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            marginBottom: '20px' 
          }}>
            Monthly sales data as bars with temperature as a line chart, using dual Y-axes for different scales.
          </p>
          
          <div style={{ 
            backgroundColor: '#dbeafe',
            border: '1px solid #3b82f6',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '20px',
            fontSize: '13px'
          }}>
            <strong>🎯 Try the Legend Double-Click Feature:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '16px', lineHeight: '1.5' }}>
              <li><strong>Single click</strong> legend items to show/hide series (normal behavior)</li>
              <li><strong>Double click</strong> any legend item to show ONLY that series (hides all others)</li>
              <li>Perfect for charts with many series to focus on individual data!</li>
            </ul>
          </div>
          
          <CombinedChart
            data={salesTempData}
            xField="month"
            series={[
              { 
                field: 'sales', 
                type: 'bar', 
                name: 'Sales (Units)', 
                color: '#3b82f6',
                yAxisIndex: 0
              },
              { 
                field: 'temperature', 
                type: 'line', 
                name: 'Temperature (°C)', 
                color: '#ef4444',
                yAxisIndex: 1,
                smooth: true,
                strokeWidth: 3,
                showPoints: true,
                pointSize: 6
              }
            ]}
            yAxis={[
              { 
                name: 'Sales (Units)', 
                position: 'left',
                type: 'value'
              },
              { 
                name: 'Temperature (°C)', 
                position: 'right',
                type: 'value'
              }
            ]}
            title="Monthly Sales vs Temperature"
            width="100%"
            height={400}
            zoom
            tooltip={{
              trigger: 'axis',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: '#e5e7eb'
            }}
            legend={{
              show: true,
              position: 'top'
            }}
            enableLegendDoubleClickSelection={true}
          />
          
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            fontSize: '13px',
            fontFamily: 'monospace'
          }}>
            <strong>Code:</strong>
            <pre style={{ margin: '10px 0 0 0', overflow: 'auto' }}>
{`<CombinedChart
  data={salesTempData}
  xField="month"
  series={[
    { field: 'sales', type: 'bar', name: 'Sales (Units)', yAxisIndex: 0 },
    { field: 'temperature', type: 'line', name: 'Temperature (°C)', yAxisIndex: 1 }
  ]}
  yAxis={[
    { name: 'Sales (Units)', position: 'left' },
    { name: 'Temperature (°C)', position: 'right' }
  ]}
  // NEW: Legend double-click functionality
  enableLegendDoubleClickSelection={true}
/>`}
            </pre>
          </div>
        </div>
      )}

      {/* Revenue & Growth Example */}
      {selectedExample === 'revenue' && (
        <div style={{ 
          marginBottom: '40px',
          padding: '25px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'semibold', 
            marginBottom: '15px',
            color: '#1f2937'
          }}>
            💰 Revenue & Growth Rate
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            marginBottom: '20px' 
          }}>
            Quarterly revenue as bars with growth rate percentage as a smooth line chart with area fill.
          </p>
          
          <CombinedChart
            data={revenueGrowthData}
            xField="quarter"
            series={[
              { 
                field: 'revenue', 
                type: 'bar', 
                name: 'Revenue ($K)', 
                color: '#10b981'
              },
              { 
                field: 'growth', 
                type: 'line', 
                name: 'Growth Rate (%)', 
                color: '#f59e0b',
                smooth: true,
                showPoints: true,
                pointSize: 8,
                showArea: true,
                areaOpacity: 0.3,
                strokeWidth: 3
              }
            ]}
            title="Quarterly Revenue & Growth Rate"
            width="100%"
            height={400}
            animate
            animationDuration={1000}
            tooltip={{
              trigger: 'axis'
            }}
            legend={{
              show: true,
              position: 'top'
            }}
          />
          
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            fontSize: '13px',
            fontFamily: 'monospace'
          }}>
            <strong>Code:</strong>
            <pre style={{ margin: '10px 0 0 0', overflow: 'auto' }}>
{`<CombinedChart
  data={revenueGrowthData}
  xField="quarter"
  series={[
    { field: 'revenue', type: 'bar', name: 'Revenue ($K)' },
    { 
      field: 'growth', 
      type: 'line', 
      name: 'Growth Rate (%)',
      smooth: true,
      showArea: true,
      areaOpacity: 0.3
    }
  ]}
/>`}
            </pre>
          </div>
        </div>
      )}

      {/* Production & Efficiency Example */}
      {selectedExample === 'production' && (
        <div style={{ 
          marginBottom: '40px',
          padding: '25px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'semibold', 
            marginBottom: '15px',
            color: '#1f2937'
          }}>
            🏭 Production & Efficiency
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            marginBottom: '20px' 
          }}>
            Actual vs target production as stacked bars with efficiency percentage as a line with area fill.
          </p>
          
          <CombinedChart
            data={productionData}
            xField="week"
            series={[
              { 
                field: 'actual', 
                type: 'bar', 
                name: 'Actual Production', 
                color: '#3b82f6',
                stack: 'production'
              },
              { 
                field: 'target', 
                type: 'bar', 
                name: 'Target Production', 
                color: '#d1d5db',
                stack: 'production'
              },
              { 
                field: 'efficiency', 
                type: 'line', 
                name: 'Efficiency %', 
                color: '#10b981',
                strokeWidth: 4,
                smooth: true,
                showArea: true,
                areaOpacity: 0.2,
                showPoints: true,
                pointSize: 8
              }
            ]}
            title="Weekly Production vs Target & Efficiency"
            width="100%"
            height={400}
            tooltip={{
              trigger: 'axis'
            }}
            legend={{
              show: true,
              position: 'top'
            }}
            zoom
            pan
          />
          
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            fontSize: '13px',
            fontFamily: 'monospace'
          }}>
            <strong>Code:</strong>
            <pre style={{ margin: '10px 0 0 0', overflow: 'auto' }}>
{`<CombinedChart
  data={productionData}
  xField="week"
  series={[
    { field: 'actual', type: 'bar', name: 'Actual Production', stack: 'production' },
    { field: 'target', type: 'bar', name: 'Target Production', stack: 'production' },
    { 
      field: 'efficiency', 
      type: 'line', 
      name: 'Efficiency %',
      showArea: true,
      areaOpacity: 0.2
    }
  ]}
  zoom
  pan
/>`}
            </pre>
          </div>
        </div>
      )}

      {/* Profit/Loss Analysis Example - Demonstrates negative value handling */}
      {selectedExample === 'profit' && (
        <div style={{ 
          marginBottom: '40px',
          padding: '25px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'semibold', 
            marginBottom: '15px',
            color: '#1f2937'
          }}>
            📈 Profit/Loss Analysis
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            marginBottom: '20px' 
          }}>
            <strong>Demonstrates negative value handling:</strong> Revenue and expenses as bars with profit/loss line that crosses the zero baseline. 
            Notice how losses (negative values) are displayed below zero with proper axis scaling.
          </p>
          
          <CombinedChart
            data={profitLossData}
            xField="month"
            series={[
              { 
                field: 'revenue', 
                type: 'bar', 
                name: 'Revenue ($)', 
                color: '#10b981'
              },
              { 
                field: 'expenses', 
                type: 'bar', 
                name: 'Expenses ($)', 
                color: '#f59e0b'
              },
              { 
                field: 'profit', 
                type: 'line', 
                name: 'Profit/Loss ($)', 
                color: '#3b82f6',
                strokeWidth: 4,
                smooth: false,
                showPoints: true,
                pointSize: 8,
                showArea: false
              }
            ]}
            title="Monthly Profit/Loss Analysis"
            width="100%"
            height={400}
            tooltip={{
              trigger: 'axis',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: '#e5e7eb'
            }}
            legend={{
              show: true,
              position: 'top'
            }}
            zoom
          />
          
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#fef3c7',
            borderRadius: '6px',
            fontSize: '14px',
            border: '1px solid #f59e0b'
          }}>
            <strong>🎯 Key Features Demonstrated:</strong>
            <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>Zero Baseline:</strong> The chart automatically creates a zero line that profit/loss values cross</li>
              <li><strong>Negative Value Support:</strong> Loss months (Feb, Apr, Jun) are properly displayed below zero</li>
              <li><strong>Automatic Scaling:</strong> Y-axis automatically adjusts to include both positive and negative ranges</li>
              <li><strong>Visual Clarity:</strong> Different colors help distinguish between revenue, expenses, and profit/loss</li>
            </ul>
          </div>
          
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            fontSize: '13px',
            fontFamily: 'monospace'
          }}>
            <strong>Code:</strong>
            <pre style={{ margin: '10px 0 0 0', overflow: 'auto' }}>
{`// Data with negative values
const profitLossData = [
  { month: 'Jan', revenue: 5000, expenses: 4200, profit: 800 },
  { month: 'Feb', revenue: 4800, expenses: 5200, profit: -400 }, // Negative!
  { month: 'Mar', revenue: 6200, expenses: 4800, profit: 1400 },
  { month: 'Apr', revenue: 4500, expenses: 5800, profit: -1300 }, // Negative!
  // ...
];

<CombinedChart
  data={profitLossData}
  xField="month"
  series={[
    { field: 'revenue', type: 'bar', name: 'Revenue ($)' },
    { field: 'expenses', type: 'bar', name: 'Expenses ($)' },
    { field: 'profit', type: 'line', name: 'Profit/Loss ($)' } // Crosses zero!
  ]}
/>`}
            </pre>
          </div>
        </div>
      )}

      {/* Features Summary */}
      <div style={{ 
        marginTop: '40px',
        padding: '25px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#f8fafc'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: 'semibold', 
          marginBottom: '15px',
          color: '#1f2937'
        }}>
          ✨ CombinedChart Features
        </h3>
        <ul style={{ 
          fontSize: '14px', 
          color: '#4b5563',
          lineHeight: '1.6',
          margin: 0,
          paddingLeft: '20px'
        }}>
          <li><strong>Mixed Series Types:</strong> Combine line and bar charts seamlessly</li>
          <li><strong>Dual Y-Axes:</strong> Different scales for different data types</li>
          <li><strong>Negative Value Support:</strong> Automatic handling of positive/negative data with zero baseline</li>
          <li><strong>Flexible Styling:</strong> Custom colors, stroke styles, and area fills</li>
          <li><strong>Bar Stacking:</strong> Stack related bar series together</li>
          <li><strong>Interactive Features:</strong> Zoom, pan, tooltips, and legends</li>
          <li><strong>Smooth Lines:</strong> Curved line interpolation options</li>
          <li><strong>Area Charts:</strong> Fill areas under line series</li>
          <li><strong>Custom Points:</strong> Configurable point sizes and shapes</li>
          <li><strong>Smart Axis Scaling:</strong> Automatic range detection with proper padding</li>
        </ul>
      </div>
    </div>
  );
};