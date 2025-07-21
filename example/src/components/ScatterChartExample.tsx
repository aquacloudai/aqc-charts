import React from 'react';
import { ScatterChart } from 'aqc-charts';

// Sample datasets for scatter chart demonstrations
const performanceData = [
  { experience: 1, salary: 45000, performance: 65, department: 'Engineering' },
  { experience: 2, salary: 52000, performance: 72, department: 'Engineering' },
  { experience: 3, salary: 58000, performance: 78, department: 'Engineering' },
  { experience: 4, salary: 65000, performance: 85, department: 'Engineering' },
  { experience: 5, salary: 72000, performance: 88, department: 'Engineering' },
  { experience: 2, salary: 48000, performance: 70, department: 'Marketing' },
  { experience: 3, salary: 55000, performance: 75, department: 'Marketing' },
  { experience: 4, salary: 61000, performance: 82, department: 'Marketing' },
  { experience: 5, salary: 68000, performance: 86, department: 'Marketing' },
  { experience: 6, salary: 74000, performance: 90, department: 'Marketing' },
  { experience: 1, salary: 42000, performance: 68, department: 'Sales' },
  { experience: 2, salary: 49000, performance: 73, department: 'Sales' },
  { experience: 3, salary: 56000, performance: 79, department: 'Sales' },
  { experience: 4, salary: 63000, performance: 84, department: 'Sales' },
  { experience: 5, salary: 70000, performance: 89, department: 'Sales' },
];

const bubbleData = [
  { profit: 20000, revenue: 150000, employees: 15, company: 'TechCorp' },
  { profit: 35000, revenue: 280000, employees: 28, company: 'DataSoft' },
  { profit: 45000, revenue: 320000, employees: 35, company: 'CloudInc' },
  { profit: 25000, revenue: 180000, employees: 22, company: 'WebFlow' },
  { profit: 60000, revenue: 450000, employees: 48, company: 'AILabs' },
  { profit: 38000, revenue: 290000, employees: 31, company: 'DevStudio' },
  { profit: 52000, revenue: 380000, employees: 42, company: 'InnoTech' },
];

const correlationData = [
  { advertising: 10000, sales: 120000 },
  { advertising: 15000, sales: 145000 },
  { advertising: 8000, sales: 105000 },
  { advertising: 25000, sales: 198000 },
  { advertising: 20000, sales: 175000 },
  { advertising: 12000, sales: 132000 },
  { advertising: 18000, sales: 165000 },
  { advertising: 30000, sales: 225000 },
  { advertising: 22000, sales: 185000 },
  { advertising: 14000, sales: 138000 },
  { advertising: 28000, sales: 210000 },
  { advertising: 16000, sales: 155000 },
];

const simpleScatterData = [
  { x: 10, y: 20 },
  { x: 15, y: 35 },
  { x: 8, y: 18 },
  { x: 25, y: 42 },
  { x: 20, y: 38 },
  { x: 12, y: 28 },
  { x: 18, y: 33 },
  { x: 30, y: 48 },
  { x: 22, y: 40 },
  { x: 14, y: 25 },
];

interface ScatterChartExampleProps {
  theme: 'light' | 'dark';
  colorPalette: readonly string[];
  onInteraction?: (data: string) => void;
}

export function ScatterChartExample({ theme, colorPalette, onInteraction }: ScatterChartExampleProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
      {/* Simple Scatter Plot */}
      <div>
        <h5 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '15px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          🔹 Simple Scatter Plot - X vs Y Correlation
        </h5>
        <ScatterChart
          data={simpleScatterData}
          xField="x"
          yField="y"
          title="Basic Scatter Plot"
          subtitle="Simple X-Y data visualization"
          height={300}
          theme={theme}
          colorPalette={[colorPalette[0]]}
          pointSize={8}
          pointShape="circle"
          pointOpacity={0.8}
          tooltip={{
            show: true,
            trigger: 'item',
            format: (params: any) => {
              if (!params.value || !Array.isArray(params.value)) {
                return `<div style="padding: 8px;"><strong>Data Point</strong><br/>Value: ${params.value}</div>`;
              }
              return `
                <div style="padding: 8px;">
                  <strong>Data Point</strong><br/>
                  X: ${params.value[0]}<br/>
                  Y: ${params.value[1]}
                </div>
              `;
            },
          }}
          xAxis={{
            label: 'X Values',
            type: 'linear',
            grid: true
          }}
          yAxis={{
            label: 'Y Values',
            type: 'linear',
            grid: true
          }}
          onDataPointClick={(data) => {
            if (data.value && Array.isArray(data.value)) {
              onInteraction?.(`Simple scatter point clicked: X=${data.value[0]}, Y=${data.value[1]}`);
            } else {
              onInteraction?.(`Simple scatter point clicked: ${JSON.stringify(data)}`);
            }
          }}
        />
      </div>

      {/* Multiple Series Scatter Plot */}
      <div>
        <h5 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '15px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          👥 Multiple Series - Employee Performance by Department
        </h5>
        <ScatterChart
          data={performanceData}
          xField="experience"
          yField="performance"
          seriesField="department"
          title="Employee Performance Analysis"
          subtitle="Performance vs Experience by Department"
          height={350}
          theme={theme}
          colorPalette={colorPalette}
          pointSize={6}
          pointShape="circle"
          pointOpacity={0.7}
          legend={{ show: true, position: 'top' }}
          tooltip={{
            show: true,
            trigger: 'item',
            format: (params: any) => {
              const point = performanceData.find(d => 
                d.experience === params.value[0] && 
                d.performance === params.value[1] &&
                d.department === params.seriesName
              );
              return `
                <div style="padding: 8px;">
                  <strong>${params.seriesName}</strong><br/>
                  Experience: ${params.value[0]} years<br/>
                  Performance: ${params.value[1]}%<br/>
                  Salary: $${point?.salary?.toLocaleString()}
                </div>
              `;
            },
          }}
          xAxis={{
            label: 'Years of Experience',
            type: 'linear',
            min: 0,
            max: 7,
            grid: true
          }}
          yAxis={{
            label: 'Performance Score (%)',
            type: 'linear',
            min: 60,
            max: 95,
            grid: true
          }}
          onDataPointClick={(data) => {
            if (data.value && Array.isArray(data.value)) {
              const point = performanceData.find(d => 
                d.experience === data.value[0] && 
                d.performance === data.value[1]
              );
              onInteraction?.(`${data.seriesName}: ${data.value[0]} years experience, ${data.value[1]}% performance, $${point?.salary?.toLocaleString()} salary`);
            } else {
              onInteraction?.(`${data.seriesName}: ${JSON.stringify(data)}`);
            }
          }}
        />
      </div>

      {/* Bubble Chart */}
      <div>
        <h5 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '15px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          💼 Bubble Chart - Company Metrics
        </h5>
        <ScatterChart
          data={bubbleData}
          xField="revenue"
          yField="profit"
          sizeField="employees"
          title="Company Performance Analysis"
          subtitle="Revenue vs Profit (bubble size = employees)"
          height={350}
          theme={theme}
          colorPalette={[colorPalette[2]]}
          pointSize={[5, 25]} // Min and max sizes
          pointShape="circle"
          pointOpacity={0.7}
          tooltip={{
            show: true,
            trigger: 'item',
            format: (params: any) => {
              const company = bubbleData[params.dataIndex];
              return `
                <div style="padding: 8px;">
                  <strong>${company?.company}</strong><br/>
                  Revenue: $${params.value[0]?.toLocaleString()}<br/>
                  Profit: $${params.value[1]?.toLocaleString()}<br/>
                  Employees: ${params.value[2]}
                </div>
              `;
            },
          }}
          xAxis={{
            label: 'Revenue ($)',
            type: 'linear',
            format: '${value:,.0f}',
            grid: true
          }}
          yAxis={{
            label: 'Profit ($)',
            type: 'linear',
            format: '${value:,.0f}',
            grid: true
          }}
          onDataPointHover={(data) => {
            if (data.value && Array.isArray(data.value)) {
              const company = bubbleData[data.dataIndex];
              onInteraction?.(`Hovering: ${company?.company} - $${data.value[0]?.toLocaleString()} revenue, $${data.value[1]?.toLocaleString()} profit, ${data.value[2]} employees`);
            } else {
              onInteraction?.(`Hovering: ${JSON.stringify(data)}`);
            }
          }}
        />
      </div>

      {/* Correlation Analysis */}
      <div>
        <h5 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '15px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          📈 Correlation Analysis - Advertising vs Sales
        </h5>
        <ScatterChart
          data={correlationData}
          xField="advertising"
          yField="sales"
          title="Marketing ROI Analysis"
          subtitle="Advertising spend vs Sales revenue correlation"
          height={350}
          theme={theme}
          colorPalette={[colorPalette[3]]}
          pointSize={8}
          pointShape="circle"
          pointOpacity={0.8}
          showTrendline={true}
          trendlineType="linear"
          tooltip={{
            show: true,
            trigger: 'item',
            format: (params: any) => `
              <div style="padding: 8px;">
                <strong>Marketing Data</strong><br/>
                Ad Spend: $${params.value[0]?.toLocaleString()}<br/>
                Sales: $${params.value[1]?.toLocaleString()}<br/>
                ROI: ${((params.value[1] / params.value[0]) * 100).toFixed(1)}%
              </div>
            `,
          }}
          xAxis={{
            label: 'Advertising Spend ($)',
            type: 'linear',
            format: '${value:,.0f}',
            grid: true
          }}
          yAxis={{
            label: 'Sales Revenue ($)',
            type: 'linear',
            format: '${value:,.0f}',
            grid: true
          }}
          onDataPointClick={(data) => {
            if (data.value && Array.isArray(data.value)) {
              const roi = ((data.value[1] / data.value[0]) * 100).toFixed(1);
              onInteraction?.(`Marketing data: $${data.value[0]?.toLocaleString()} ad spend → $${data.value[1]?.toLocaleString()} sales (${roi}% ROI)`);
            } else {
              onInteraction?.(`Marketing data clicked: ${JSON.stringify(data)}`);
            }
          }}
        />
      </div>
    </div>
  );
}