import React from 'react';
import { BarChart } from 'aqc-charts';

// Sample datasets for bar chart demonstrations
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

// New dataset demonstrating negative values (profit/loss scenario)
const profitLossData = [
  { month: 'Jan', revenue: 5200, expenses: 4100, netIncome: 1100 },
  { month: 'Feb', revenue: 4800, expenses: 5300, netIncome: -500 },
  { month: 'Mar', revenue: 6200, expenses: 4900, netIncome: 1300 },
  { month: 'Apr', revenue: 4500, expenses: 5800, netIncome: -1300 },
  { month: 'May', revenue: 7100, expenses: 5200, netIncome: 1900 },
  { month: 'Jun', revenue: 5400, expenses: 6100, netIncome: -700 },
];

// Market performance data with negative growth rates
const marketData = [
  { sector: 'Technology', growth: 15.8, volatility: 8.2 },
  { sector: 'Healthcare', growth: 8.3, volatility: 5.1 },
  { sector: 'Energy', growth: -12.4, volatility: 15.6 },
  { sector: 'Finance', growth: 4.7, volatility: 9.8 },
  { sector: 'Retail', growth: -8.9, volatility: 12.3 },
  { sector: 'Manufacturing', growth: 6.2, volatility: 7.4 },
];

interface BarChartExampleProps {
  theme: 'light' | 'dark';
  colorPalette: readonly string[];
  onInteraction?: (data: string) => void;
}

export function BarChartExample({ theme, colorPalette, onInteraction }: BarChartExampleProps) {
  return (
    <>
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
            colorPalette={[colorPalette[0]]}
            orientation="vertical"
            borderRadius={4}
            tooltip={{
              show: true,
              trigger: 'item'
            }}
            onDataPointClick={(data) => {
              onInteraction?.(`Clicked on ${data.name}: $${data.value?.toLocaleString()}`);
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
            colorPalette={[colorPalette[1]]}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
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
            colorPalette={colorPalette}
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
            colorPalette={colorPalette}
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
              onInteraction?.(`${data.seriesName} in ${data.name}: $${data.value?.toLocaleString()}`);
            }}
          />
        </div>
      </div>

      {/* Label Visibility Examples */}
      <div style={{ marginBottom: '25px' }}>
        <h5 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '15px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          🏷️ Label Visibility Controls - Sales Data with Different Label Options
        </h5>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          {/* Absolute Values Only */}
          <div>
            <h6 style={{ color: theme === 'dark' ? '#ccc' : '#666', fontSize: '14px', marginBottom: '10px' }}>
              Absolute Values Only
            </h6>
            <BarChart
              data={salesData.slice(0, 4)}
              categoryField="month"
              valueField={['sales', 'profit']}
              title="Sales with Absolute Labels"
              height={250}
              theme={theme}
              colorPalette={colorPalette}
              orientation="vertical"
              stack={true}
              showAbsoluteValues={true}
              borderRadius={3}
              legend={{ show: true, position: 'top' }}
            />
          </div>

          {/* Percentage Labels Only */}
          <div>
            <h6 style={{ color: theme === 'dark' ? '#ccc' : '#666', fontSize: '14px', marginBottom: '10px' }}>
              Percentage Labels Only (Stacked)
            </h6>
            <BarChart
              data={salesData.slice(0, 4)}
              categoryField="month"
              valueField={['sales', 'profit']}
              title="Sales with Percentage Labels"
              height={250}
              theme={theme}
              colorPalette={colorPalette}
              orientation="vertical"
              stack={true}
              showPercentageLabels={true}
              borderRadius={3}
              legend={{ show: true, position: 'top' }}
            />
          </div>

          {/* Both Absolute and Percentage */}
          <div>
            <h6 style={{ color: theme === 'dark' ? '#ccc' : '#666', fontSize: '14px', marginBottom: '10px' }}>
              Both Absolute and Percentage
            </h6>
            <BarChart
              data={salesData.slice(0, 4)}
              categoryField="month"
              valueField={['sales', 'profit']}
              title="Sales with Both Labels"
              height={250}
              theme={theme}
              colorPalette={colorPalette}
              orientation="vertical"
              stack={true}
              showAbsoluteValues={true}
              showPercentageLabels={true}
              borderRadius={3}
              legend={{ show: true, position: 'top' }}
            />
          </div>

          {/* No Labels (Clean) */}
          <div>
            <h6 style={{ color: theme === 'dark' ? '#ccc' : '#666', fontSize: '14px', marginBottom: '10px' }}>
              No Labels (Clean for Busy Charts)
            </h6>
            <BarChart
              data={salesData.slice(0, 4)}
              categoryField="month"
              valueField={['sales', 'profit', 'expenses']}
              title="Clean Stacked Chart"
              height={250}
              theme={theme}
              colorPalette={colorPalette}
              orientation="vertical"
              stack={true}
              borderRadius={3}
              legend={{ show: true, position: 'top' }}
              tooltip={{
                show: true,
                trigger: 'axis',
              }}
            />
          </div>
        </div>
      </div>

      {/* Percentage Example Section */}
      <div>
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
          colorPalette={colorPalette}
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
            onInteraction?.(`${data.seriesName} contributed ${Math.round(data.value * 100)}% of total revenue in ${data.name}`);
          }}
        />
      </div>

      {/* Negative Values Example 1: Net Income with Losses */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📊 Net Income Analysis (with Losses)
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          <strong>Demonstrates negative value support:</strong> Monthly net income that includes loss months.
          Notice how losses (Feb, Apr, Jun) are displayed as bars extending downward below the zero line.
        </p>
        <BarChart
          data={profitLossData}
          categoryField="month"
          valueField="netIncome"
          title="Monthly Net Income ($)"
          subtitle="Profit and loss analysis with negative values"
          height={350}
          theme={theme}
          colorPalette={['#10b981']}
          orientation="vertical"
          showLabels
          borderRadius={4}
          legend={{ show: false }}
          tooltip={{
            show: true,
            trigger: 'item',
            format: (params: any) => {
              const value = params.value;
              const status = value >= 0 ? 'Profit' : 'Loss';
              const color = value >= 0 ? '#10b981' : '#ef4444';
              return `
                <div style="padding: 8px;">
                  <strong>${params.name}</strong><br/>
                  Net Income: $${Math.abs(value).toLocaleString()}<br/>
                  <span style="color: ${color}; font-weight: bold;">${status}</span>
                </div>
              `;
            }
          }}
          xAxis={{
            label: 'Month'
          }}
          yAxis={{
            label: 'Net Income ($)',
            format: '${value:,.0f}',
            grid: true
          }}
          onDataPointClick={(data) => {
            const status = data.value >= 0 ? 'profit' : 'loss';
            onInteraction?.(`${data.name}: $${Math.abs(data.value).toLocaleString()} ${status}`);
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
          <strong>🎯 Key Feature:</strong> The chart automatically creates a zero baseline and displays negative values 
          (losses) as bars extending downward, while positive values (profits) extend upward.
        </div>
      </div>

      {/* Negative Values Example 2: Market Growth Comparison */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📈 Market Sector Performance
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          <strong>Real-world scenario:</strong> Market sector growth rates showing both positive and negative performance.
          Energy and Retail sectors show negative growth (decline), while others show positive growth.
        </p>
        <BarChart
          data={marketData}
          categoryField="sector"
          valueField="growth"
          title="Market Sector Growth Rates (%)"
          subtitle="Annual performance comparison across industries"
          height={380}
          theme={theme}
          colorPalette={['#3b82f6']}
          orientation="horizontal"
          showLabels
          showAbsoluteValues
          borderRadius={6}
          legend={{ show: false }}
          tooltip={{
            show: true,
            trigger: 'item',
            format: (params: any) => {
              const growth = params.value;
              const sector = marketData.find(d => d.sector === params.name);
              const trend = growth >= 0 ? '📈 Growth' : '📉 Decline';
              return `
                <div style="padding: 8px;">
                  <strong>${params.name}</strong><br/>
                  Growth Rate: ${growth}%<br/>
                  Volatility: ${sector?.volatility}%<br/>
                  ${trend}
                </div>
              `;
            }
          }}
          xAxis={{
            label: 'Growth Rate (%)',
            format: '{value}%',
            grid: true
          }}
          yAxis={{
            label: 'Market Sector'
          }}
          onDataPointClick={(data) => {
            const trend = data.value >= 0 ? 'growing' : 'declining';
            onInteraction?.(`${data.name} sector: ${data.value}% (${trend})`);
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
          <strong>📊 Analysis:</strong> Energy (-12.4%) and Retail (-8.9%) sectors show negative growth, 
          indicating market contractions, while Technology leads with 15.8% growth.
        </div>
      </div>

      {/* Example 8: Multiple Y-Axes */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📊 Multiple Y-Axes - Revenue & Employee Count
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Demonstrates multiple y-axes in bar charts. Revenue uses the left axis ($) while employee count uses the right axis (#).
          Each series can be assigned to different y-axes using yAxisIndex.
        </p>
        <BarChart
          series={[
            {
              name: 'Revenue',
              data: [
                { category: 'Q1', value: 150000 },
                { category: 'Q2', value: 180000 },
                { category: 'Q3', value: 165000 },
                { category: 'Q4', value: 195000 },
              ],
              color: '#3b82f6',
              yAxisIndex: 0, // Left y-axis
            },
            {
              name: 'Employees',
              data: [
                { category: 'Q1', value: 25 },
                { category: 'Q2', value: 32 },
                { category: 'Q3', value: 28 },
                { category: 'Q4', value: 35 },
              ],
              color: '#ef4444',
              yAxisIndex: 1, // Right y-axis
            }
          ]}
          categoryField="category"
          valueField="value"
          title="Quarterly Revenue vs Employee Count"
          subtitle="Dual y-axis bar chart showing revenue and headcount"
          height={400}
          theme={theme}
          yAxis={[
            {
              name: 'Revenue ($)',
              position: 'left',
              label: 'Revenue',
              format: '${value:,.0f}',
              grid: true,
            },
            {
              name: 'Employees (#)',
              position: 'right',
              label: 'Employee Count',
              format: '{value}',
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
            const axis = data.seriesName === 'Revenue' ? 'left' : 'right';
            const unit = data.seriesName === 'Revenue' ? '$' : '';
            onInteraction?.(`Clicked ${data.seriesName} on ${axis} y-axis: ${unit}${data.value}`);
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
          <strong>🎯 Multiple Y-Axes:</strong> Revenue scale ($0 to $200k) on left, Employee count (0 to 40) on right.
          This enables comparison of metrics with vastly different scales on the same chart.
        </div>
      </div>
    </>
  );
}