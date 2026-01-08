import { CombinedChart, useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface CombinedChartExampleProps {
  theme: 'light' | 'dark' | 'auto';
  onInteraction?: (data: string) => void;
}

// Sample sales and temperature data
const salesTempData = [
  { month: 'Jan', sales: 4200, temperature: 5 },
  { month: 'Feb', sales: 3800, temperature: 8 },
  { month: 'Mar', sales: 5100, temperature: 14 },
  { month: 'Apr', sales: 5800, temperature: 18 },
  { month: 'May', sales: 6200, temperature: 22 },
  { month: 'Jun', sales: 7500, temperature: 26 },
];

// Sample revenue and growth data
const revenueGrowthData = [
  { quarter: 'Q1', revenue: 12000, profit: 2400, growth: 5 },
  { quarter: 'Q2', revenue: 15000, profit: 3200, growth: 12 },
  { quarter: 'Q3', revenue: 14500, profit: 2900, growth: 8 },
  { quarter: 'Q4', revenue: 18000, profit: 4100, growth: 18 },
];

// Sample website performance data
const websiteData = [
  { day: 'Mon', visitors: 2400, pageviews: 8500, bounceRate: 35 },
  { day: 'Tue', visitors: 2800, pageviews: 9800, bounceRate: 32 },
  { day: 'Wed', visitors: 3100, pageviews: 11200, bounceRate: 28 },
  { day: 'Thu', visitors: 2900, pageviews: 10500, bounceRate: 30 },
  { day: 'Fri', visitors: 3500, pageviews: 12800, bounceRate: 25 },
  { day: 'Sat', visitors: 1800, pageviews: 5200, bounceRate: 42 },
  { day: 'Sun', visitors: 1500, pageviews: 4100, bounceRate: 45 },
];

export function CombinedChartExample({ theme, onInteraction }: CombinedChartExampleProps) {
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Bar + Line with Dual Y-Axis */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Bar + Line with Dual Axis
        </h3>
        <CombinedChart
          data={salesTempData}
          xField="month"
          series={[
            { field: 'sales', type: 'bar', name: 'Sales ($)' },
            { field: 'temperature', type: 'line', name: 'Temperature', yAxisIndex: 1 },
          ]}
          yAxis={[
            { name: 'Sales ($)', position: 'left' },
            { name: 'Temp (°C)', position: 'right' },
          ]}
          title="Sales vs Temperature"
          theme={theme}
          height={350}
          legend={{ show: true }}
          onDataPointClick={(params) => {
            onInteraction?.(`${params.seriesName}: ${params.name} - ${params.value}`);
          }}
        />
      </section>

      {/* Multiple Bars with Line */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Multiple Series Combined
        </h3>
        <CombinedChart
          data={revenueGrowthData}
          xField="quarter"
          series={[
            { field: 'revenue', type: 'bar', name: 'Revenue' },
            { field: 'profit', type: 'bar', name: 'Profit' },
            { field: 'growth', type: 'line', name: 'Growth (%)', yAxisIndex: 1 },
          ]}
          yAxis={[
            { name: 'Amount ($)', position: 'left' },
            { name: 'Growth (%)', position: 'right' },
          ]}
          title="Quarterly Performance"
          theme={theme}
          height={350}
          legend={{ show: true }}
        />
      </section>

      {/* Website Analytics */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Website Analytics
        </h3>
        <CombinedChart
          data={websiteData}
          xField="day"
          series={[
            { field: 'visitors', type: 'bar', name: 'Visitors' },
            { field: 'pageviews', type: 'line', name: 'Page Views' },
            { field: 'bounceRate', type: 'line', name: 'Bounce Rate (%)', yAxisIndex: 1 },
          ]}
          yAxis={[
            { name: 'Count', position: 'left' },
            { name: 'Bounce Rate (%)', position: 'right' },
          ]}
          title="Weekly Website Performance"
          theme={theme}
          height={350}
          legend={{ show: true }}
        />
      </section>
    </div>
  );
}
