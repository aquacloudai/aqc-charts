import React from 'react';
import { StackedAreaChart } from 'aqc-charts';

// Sample datasets for stacked area chart demonstrations
const revenueData = [
  { month: 'Jan', product_a: 12000, product_b: 8500, product_c: 5200, services: 3800 },
  { month: 'Feb', product_a: 14200, product_b: 9200, product_c: 6100, services: 4200 },
  { month: 'Mar', product_a: 11800, product_b: 10200, product_c: 5800, services: 3900 },
  { month: 'Apr', product_a: 16500, product_b: 8800, product_c: 7200, services: 5100 },
  { month: 'May', product_a: 13200, product_b: 11500, product_c: 6500, services: 4400 },
  { month: 'Jun', product_a: 18900, product_b: 12300, product_c: 8100, services: 6200 },
  { month: 'Jul', product_a: 17800, product_b: 13100, product_c: 7800, services: 5900 },
  { month: 'Aug', product_a: 19500, product_b: 11800, product_c: 8500, services: 6400 },
  { month: 'Sep', product_a: 15200, product_b: 10500, product_c: 7100, services: 4800 },
  { month: 'Oct', product_a: 20100, product_b: 14200, product_c: 8900, services: 6800 },
  { month: 'Nov', product_a: 18800, product_b: 13500, product_c: 8200, services: 6100 },
  { month: 'Dec', product_a: 22400, product_b: 15800, product_c: 9800, services: 7500 },
];

const departmentBudgetData = [
  { quarter: 'Q1 2023', engineering: 450, marketing: 280, sales: 320, hr: 150, operations: 200 },
  { quarter: 'Q2 2023', engineering: 520, marketing: 320, sales: 380, hr: 180, operations: 240 },
  { quarter: 'Q3 2023', engineering: 480, marketing: 300, sales: 350, hr: 160, operations: 220 },
  { quarter: 'Q4 2023', engineering: 580, marketing: 380, sales: 420, hr: 200, operations: 280 },
  { quarter: 'Q1 2024', engineering: 620, marketing: 420, sales: 450, hr: 220, operations: 300 },
  { quarter: 'Q2 2024', engineering: 680, marketing: 480, sales: 520, hr: 250, operations: 340 },
];

const websiteTrafficData = [
  { week: 'Week 1', organic: 2400, paid: 800, social: 600, direct: 1200, referral: 400 },
  { week: 'Week 2', organic: 2800, paid: 900, social: 750, direct: 1100, referral: 450 },
  { week: 'Week 3', organic: 2200, paid: 1100, social: 820, direct: 1400, referral: 380 },
  { week: 'Week 4', organic: 3200, paid: 950, social: 680, direct: 1300, referral: 520 },
  { week: 'Week 5', organic: 2900, paid: 1200, social: 890, direct: 1500, referral: 580 },
  { week: 'Week 6', organic: 3400, paid: 1050, social: 920, direct: 1600, referral: 630 },
  { week: 'Week 7', organic: 3100, paid: 1300, social: 780, direct: 1450, referral: 520 },
  { week: 'Week 8', organic: 3600, paid: 1150, social: 1100, direct: 1700, referral: 680 },
];

const energyConsumptionData = [
  { month: 'Jan', heating: 450, cooling: 50, lighting: 120, appliances: 200 },
  { month: 'Feb', heating: 380, cooling: 60, lighting: 115, appliances: 195 },
  { month: 'Mar', heating: 280, cooling: 80, lighting: 110, appliances: 205 },
  { month: 'Apr', heating: 150, cooling: 120, lighting: 105, appliances: 210 },
  { month: 'May', heating: 80, cooling: 200, lighting: 100, appliances: 220 },
  { month: 'Jun', heating: 30, cooling: 320, lighting: 95, appliances: 235 },
  { month: 'Jul', heating: 20, cooling: 380, lighting: 90, appliances: 245 },
  { month: 'Aug', heating: 25, cooling: 350, lighting: 92, appliances: 240 },
  { month: 'Sep', heating: 60, cooling: 250, lighting: 98, appliances: 225 },
  { month: 'Oct', heating: 180, cooling: 150, lighting: 108, appliances: 215 },
  { month: 'Nov', heating: 320, cooling: 70, lighting: 118, appliances: 200 },
  { month: 'Dec', heating: 420, cooling: 45, lighting: 125, appliances: 190 },
];

// Data for series format demonstration
const stockSectorData = [
  { date: '2024-01-01', tech: 25.5, healthcare: 18.2, finance: 22.8, energy: 12.4, consumer: 21.1 },
  { date: '2024-02-01', tech: 28.1, healthcare: 19.5, finance: 21.2, energy: 14.8, consumer: 16.4 },
  { date: '2024-03-01', tech: 31.2, healthcare: 17.8, finance: 19.6, energy: 16.2, consumer: 15.2 },
  { date: '2024-04-01', tech: 29.8, healthcare: 21.3, finance: 18.9, energy: 13.7, consumer: 16.3 },
  { date: '2024-05-01', tech: 33.4, healthcare: 22.1, finance: 17.5, energy: 11.9, consumer: 15.1 },
  { date: '2024-06-01', tech: 35.2, healthcare: 20.8, finance: 16.3, energy: 13.5, consumer: 14.2 },
];

interface StackedAreaChartExampleProps {
  theme: 'light' | 'dark';
  colorPalette: readonly string[];
  onInteraction?: (data: string) => void;
}

export function StackedAreaChartExample({ theme, colorPalette, onInteraction }: StackedAreaChartExampleProps) {
  return (
    <>
      {/* Example 1: Basic Revenue Stacking */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          💰 Monthly Revenue by Product Line
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Classic stacked area chart showing cumulative revenue across product lines. Each area represents a product's contribution to total revenue over time.
        </p>
        <StackedAreaChart
          data={revenueData}
          xField="month"
          yField={['product_a', 'product_b', 'product_c', 'services']}
          title="Monthly Revenue Distribution"
          subtitle="Stacked view of revenue by product line"
          height={400}
          theme={theme}
          colorPalette={colorPalette}
          stacked={true}
          stackType="normal"
          smooth
          opacity={0.8}
          areaGradient
          legend={{ 
            show: true, 
            position: 'right', 
            align: 'center',
            data: [
              { name: 'product_a', displayName: 'Product A' },
              { name: 'product_b', displayName: 'Product B' },
              { name: 'product_c', displayName: 'Product C' },
              { name: 'services', displayName: 'Services' }
            ]
          }}
          tooltip={{
            show: true,
            trigger: 'axis',
            formatter: function(params: any) {
              if (!Array.isArray(params)) return '';
              
              let total = 0;
              params.forEach((param: any) => total += param.value);
              
              let result = `<div style="padding: 8px;"><strong>${params[0].axisValue}</strong><br/>`;
              params.forEach((param: any) => {
                const percentage = ((param.value / total) * 100).toFixed(1);
                result += `${param.marker}${param.seriesName}: $${param.value?.toLocaleString()} (${percentage}%)<br/>`;
              });
              result += `<hr style="margin: 4px 0; border: 0; border-top: 1px solid #ccc;">Total: $${total.toLocaleString()}</div>`;
              return result;
            }
          }}
          yAxis={{
            label: 'Revenue ($)',
            format: '${value:,.0f}',
            grid: true
          }}
          onDataPointClick={(data) => {
            onInteraction?.(`${data.seriesName} in ${data.axisValue}: $${data.value?.toLocaleString()}`);
          }}
          zoom
          responsive
        />
      </div>

      {/* Example 2: Percentage Stacking */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📊 Department Budget Distribution (Percentage)
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Percentage stacking shows each department's proportion of the total budget. The total always equals 100%, making it easy to compare relative contributions.
        </p>
        <StackedAreaChart
          data={departmentBudgetData}
          xField="quarter"
          yField={['engineering', 'marketing', 'sales', 'hr', 'operations']}
          title="Department Budget Allocation"
          subtitle="Percentage distribution across departments"
          height={400}
          theme={theme}
          colorPalette={colorPalette}
          stacked={true}
          stackType="percent"
          smooth
          opacity={0.7}
          legend={{ 
            show: true, 
            position: 'bottom', 
            align: 'center',
            data: [
              { name: 'engineering', displayName: 'Engineering' },
              { name: 'marketing', displayName: 'Marketing' },
              { name: 'sales', displayName: 'Sales' },
              { name: 'hr', displayName: 'Human Resources' },
              { name: 'operations', displayName: 'Operations' }
            ]
          }}
          tooltip={{
            show: true,
            trigger: 'axis'
          }}
          yAxis={{
            label: 'Percentage (%)',
            format: '{value}%',
            grid: true,
            max: 100
          }}
          onDataPointClick={(data) => {
            onInteraction?.(`${data.seriesName} in ${data.axisValue}: ${data.value}% of total budget`);
          }}
          responsive
        />
      </div>

      {/* Example 3: Series Configuration with Individual Styling */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          🌐 Website Traffic Sources
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Custom series configuration with individual styling for each traffic source. Different line styles and area effects highlight each channel's unique characteristics.
        </p>
        <StackedAreaChart
          data={websiteTrafficData}
          xField="week"
          yField={['organic', 'paid', 'social', 'direct', 'referral']}
          title="Weekly Website Traffic by Source"
          subtitle="Visitor acquisition channels over 8 weeks"
          height={400}
          theme={theme}
          stacked={true}
          stackType="normal"
          seriesConfig={{
            organic: {
              color: '#22c55e',
              smooth: true,
              areaOpacity: 0.8,
              strokeWidth: 2,
            },
            paid: {
              color: '#3b82f6',
              smooth: true,
              areaOpacity: 0.7,
              strokeWidth: 2,
            },
            social: {
              color: '#f59e0b',
              smooth: true,
              areaOpacity: 0.6,
              strokeWidth: 2,
            },
            direct: {
              color: '#8b5cf6',
              smooth: true,
              areaOpacity: 0.7,
              strokeWidth: 2,
            },
            referral: {
              color: '#ef4444',
              smooth: true,
              areaOpacity: 0.6,
              strokeWidth: 2,
            }
          }}
          legend={{ 
            show: true, 
            position: 'top', 
            orientation: 'horizontal',
            data: [
              { name: 'organic', displayName: 'Organic Search' },
              { name: 'paid', displayName: 'Paid Ads' },
              { name: 'social', displayName: 'Social Media' },
              { name: 'direct', displayName: 'Direct Traffic' },
              { name: 'referral', displayName: 'Referrals' }
            ]
          }}
          tooltip={{
            show: true,
            trigger: 'axis',
            formatter: function(params: any) {
              if (!Array.isArray(params)) return '';
              
              let total = 0;
              params.forEach((param: any) => total += param.value);
              
              let result = `<div style="padding: 8px;"><strong>${params[0].axisValue}</strong><br/>`;
              params.forEach((param: any) => {
                const percentage = ((param.value / total) * 100).toFixed(1);
                result += `${param.marker}${param.seriesName}: ${param.value?.toLocaleString()} visitors (${percentage}%)<br/>`;
              });
              result += `<hr style="margin: 4px 0; border: 0; border-top: 1px solid #ccc;">Total: ${total.toLocaleString()} visitors</div>`;
              return result;
            }
          }}
          yAxis={{
            label: 'Visitors',
            format: '{value:,.0f}',
            grid: true
          }}
          onDataPointHover={(data) => {
            onInteraction?.(`Hovering over ${data.seriesName} traffic: ${data.value?.toLocaleString()} visitors`);
          }}
          zoom
          pan
          responsive
        />
      </div>

      {/* Example 4: Non-Stacked Overlapping Areas */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          ⚡ Energy Consumption by Category (Overlapping)
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Non-stacked area chart showing overlapping areas for different energy categories. Notice the seasonal patterns in heating vs cooling consumption.
        </p>
        <StackedAreaChart
          data={energyConsumptionData}
          xField="month"
          yField={['heating', 'cooling', 'lighting', 'appliances']}
          title="Monthly Energy Consumption by Category"
          subtitle="Overlapping areas show individual consumption patterns"
          height={400}
          theme={theme}
          colorPalette={['#ef4444', '#3b82f6', '#f59e0b', '#22c55e']}
          stacked={false} // Non-stacked for overlapping effect
          smooth
          opacity={0.4} // Lower opacity for overlapping visibility
          areaGradient
          legend={{ 
            show: true, 
            position: 'right', 
            align: 'center',
            data: [
              { name: 'heating', displayName: 'Heating 🔥' },
              { name: 'cooling', displayName: 'Cooling ❄️' },
              { name: 'lighting', displayName: 'Lighting 💡' },
              { name: 'appliances', displayName: 'Appliances 🏠' }
            ]
          }}
          tooltip={{
            show: true,
            trigger: 'axis',
            formatter: function(params: any) {
              if (!Array.isArray(params)) return '';
              
              let result = `<div style="padding: 8px;"><strong>${params[0].axisValue}</strong><br/>`;
              params.forEach((param: any) => {
                result += `${param.marker}${param.seriesName}: ${param.value} kWh<br/>`;
              });
              return result + '</div>';
            }
          }}
          yAxis={{
            label: 'Energy (kWh)',
            format: '{value} kWh',
            grid: true
          }}
          onDataPointClick={(data) => {
            const season = ['Dec', 'Jan', 'Feb'].includes(data.axisValue as string) ? 'Winter' :
                          ['Mar', 'Apr', 'May'].includes(data.axisValue as string) ? 'Spring' :
                          ['Jun', 'Jul', 'Aug'].includes(data.axisValue as string) ? 'Summer' : 'Fall';
            onInteraction?.(`${data.seriesName} consumption in ${data.axisValue} (${season}): ${data.value} kWh`);
          }}
          zoom
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
          <strong>💡 Insight:</strong> Heating peaks in winter months, cooling dominates summer, while lighting and appliances remain relatively stable year-round.
          The overlapping areas reveal seasonal energy patterns clearly.
        </div>
      </div>

      {/* Example 5: Series Format with Stock Market Data */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📈 Stock Market Sector Performance
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Using the series format for explicit data configuration. Each sector has custom styling and the chart shows relative market performance over time.
        </p>
        <StackedAreaChart
          data={stockSectorData}
          xField="date"
          yField="value"
          series={[
            {
              name: 'Technology',
              data: stockSectorData.map(d => ({ date: d.date, value: d.tech })),
              color: '#3b82f6',
              smooth: true,
            },
            {
              name: 'Healthcare', 
              data: stockSectorData.map(d => ({ date: d.date, value: d.healthcare })),
              color: '#ef4444',
              smooth: true,
            },
            {
              name: 'Finance',
              data: stockSectorData.map(d => ({ date: d.date, value: d.finance })),
              color: '#22c55e',
              smooth: true,
            },
            {
              name: 'Energy',
              data: stockSectorData.map(d => ({ date: d.date, value: d.energy })),
              color: '#f59e0b',
              smooth: true,
            },
            {
              name: 'Consumer',
              data: stockSectorData.map(d => ({ date: d.date, value: d.consumer })),
              color: '#8b5cf6',
              smooth: true,
            }
          ]}
          title="Market Sector Performance"
          subtitle="Stock index values by sector (stacked view)"
          height={400}
          theme={theme}
          stacked={true}
          stackType="normal"
          opacity={0.7}
          legend={{ 
            show: true, 
            position: 'bottom', 
            align: 'center'
          }}
          tooltip={{
            show: true,
            trigger: 'axis',
            formatter: function(params: any) {
              if (!Array.isArray(params)) return '';
              
              let total = 0;
              params.forEach((param: any) => total += param.value);
              
              let result = `<div style="padding: 8px;"><strong>${params[0].axisValue}</strong><br/>`;
              params.forEach((param: any) => {
                const percentage = ((param.value / total) * 100).toFixed(1);
                result += `${param.marker}${param.seriesName}: ${param.value} pts (${percentage}%)<br/>`;
              });
              result += `<hr style="margin: 4px 0; border: 0; border-top: 1px solid #ccc;">Total Index: ${total.toFixed(1)} points</div>`;
              return result;
            }
          }}
          yAxis={{
            label: 'Index Points',
            format: '{value}',
            grid: true
          }}
          xAxis={{
            type: 'category',
            label: 'Date',
            rotate: 45
          }}
          onDataPointClick={(data) => {
            onInteraction?.(`${data.seriesName} sector on ${data.axisValue}: ${data.value} index points`);
          }}
          zoom
          responsive
        />
      </div>

      {/* Example 6: Advanced Styling with Gradient and Animation */}
      <div>
        <h4 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          ✨ Premium Design - Animated Gradient Areas
        </h4>
        <p style={{
          color: theme === 'dark' ? '#ccc' : '#666',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          Showcase of advanced styling features including gradient fills, smooth animations, custom background, and premium visual effects.
        </p>
        <StackedAreaChart
          data={revenueData.slice(0, 6)} // Use first 6 months for cleaner animation
          xField="month"
          yField={['product_a', 'product_b', 'product_c']}
          title="Q1-Q2 Revenue Performance"
          titlePosition="center"
          height={350}
          theme={theme}
          backgroundColor={theme === 'dark' ? '#1e1b4b' : '#f0f9ff'}
          colorPalette={['#3b82f6', '#8b5cf6', '#06b6d4']}
          stacked={true}
          stackType="normal"
          smooth
          opacity={0.8}
          areaGradient
          strokeWidth={3}
          animate
          animationDuration={1500}
          legend={{ 
            show: true, 
            position: 'top',
            orientation: 'horizontal',
            data: [
              { name: 'product_a', displayName: 'Premium Product' },
              { name: 'product_b', displayName: 'Standard Product' },
              { name: 'product_c', displayName: 'Basic Product' }
            ]
          }}
          tooltip={{
            show: true,
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            borderColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
            textColor: '#ffffff'
          }}
          yAxis={{
            label: 'Revenue ($)',
            format: '${value:,.0f}',
            grid: true,
            gridColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }}
          xAxis={{
            grid: false,
            label: 'Month'
          }}
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: `2px solid ${theme === 'dark' ? '#60a5fa' : '#3b82f6'}`,
            boxShadow: theme === 'dark' 
              ? '0 25px 50px -12px rgba(59, 130, 246, 0.25)' 
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
          onChartReady={() => {
            onInteraction?.('Premium stacked area chart loaded with animations');
          }}
          responsive
        />
        <div style={{ 
          marginTop: '20px',
          padding: '16px',
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)' 
            : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          borderRadius: '12px',
          fontSize: '14px',
          border: `1px solid ${theme === 'dark' ? '#3b82f6' : '#93c5fd'}`,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <strong>🎨 Premium Features:</strong> This chart demonstrates gradient backgrounds, smooth animations, 
          custom borders, shadow effects, and professional styling suitable for executive dashboards.
        </div>
      </div>
    </>
  );
}