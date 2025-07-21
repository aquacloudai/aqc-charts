import React from 'react';
import { PieChart } from 'aqc-charts';

// Sample datasets for pie chart demonstrations
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

interface PieChartExampleProps {
  theme: 'light' | 'dark';
  colorPalette: readonly string[];
  onInteraction?: (data: string) => void;
}

export function PieChartExample({ theme, colorPalette, onInteraction }: PieChartExampleProps) {
  return (
    <>
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
            colorPalette={colorPalette}
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
              onInteraction?.(`${data.name}: ${data.value?.toLocaleString()} users (${data.percent}%)`);
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
            colorPalette={colorPalette}
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
              onInteraction?.(`${data.name} has ${data.value}% market share`);
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
            colorPalette={colorPalette}
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
              onInteraction?.(`${data.name}: ${data.value}/100 performance score`);
            }}
          />
        </div>
      </div>
    </>
  );
}