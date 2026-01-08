import { StackedAreaChart, useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface StackedAreaChartExampleProps {
  theme: 'light' | 'dark' | 'auto';
  onInteraction?: (data: string) => void;
}

// Sample revenue breakdown data
const revenueData = [
  { month: 'Jan', product: 3200, services: 1800, licensing: 900 },
  { month: 'Feb', product: 3500, services: 2100, licensing: 1100 },
  { month: 'Mar', product: 3800, services: 2400, licensing: 1300 },
  { month: 'Apr', product: 3600, services: 2200, licensing: 1200 },
  { month: 'May', product: 4200, services: 2800, licensing: 1500 },
  { month: 'Jun', product: 4800, services: 3200, licensing: 1800 },
];

// Sample traffic data
const trafficData = [
  { day: 'Mon', organic: 4500, paid: 2200, referral: 1100 },
  { day: 'Tue', organic: 5200, paid: 2800, referral: 1400 },
  { day: 'Wed', organic: 4800, paid: 2500, referral: 1200 },
  { day: 'Thu', organic: 5500, paid: 3000, referral: 1600 },
  { day: 'Fri', organic: 6200, paid: 3500, referral: 1900 },
  { day: 'Sat', organic: 3800, paid: 1500, referral: 800 },
  { day: 'Sun', organic: 3200, paid: 1200, referral: 600 },
];

export function StackedAreaChartExample({ theme, onInteraction }: StackedAreaChartExampleProps) {
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Basic Stacked Area */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Stacked Area Chart
        </h3>
        <StackedAreaChart
          data={revenueData}
          xField="month"
          yField={['product', 'services', 'licensing']}
          title="Revenue Breakdown"
          theme={theme}
          height={350}
          stacked
          legend={{ show: true }}
          onDataPointClick={(params) => {
            onInteraction?.(`${params.seriesName}: ${params.name} - $${params.value?.toLocaleString()}`);
          }}
        />
      </section>

      {/* Smooth Stacked Area */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Smooth Stacked Area
        </h3>
        <StackedAreaChart
          data={trafficData}
          xField="day"
          yField={['organic', 'paid', 'referral']}
          title="Weekly Traffic Sources"
          theme={theme}
          height={350}
          stacked
          smooth
          legend={{ show: true }}
        />
      </section>

      {/* Non-Stacked Area (Overlapping) */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Overlapping Area Chart
        </h3>
        <StackedAreaChart
          data={revenueData}
          xField="month"
          yField={['product', 'services']}
          title="Product vs Services Revenue"
          theme={theme}
          height={350}
          stacked={false}
          smooth
          areaOpacity={0.4}
          legend={{ show: true }}
        />
      </section>
    </div>
  );
}
