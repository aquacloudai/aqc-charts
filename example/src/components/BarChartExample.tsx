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
    </>
  );
}