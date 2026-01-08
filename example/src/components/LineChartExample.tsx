import { LineChart, useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface LineChartExampleProps {
  theme: 'light' | 'dark' | 'auto';
  onInteraction?: (data: string) => void;
}

// Sample monthly data
const monthlyData = [
  { month: 'Jan', sales: 4200, orders: 320, visitors: 8500 },
  { month: 'Feb', sales: 3800, orders: 290, visitors: 7200 },
  { month: 'Mar', sales: 5100, orders: 380, visitors: 9800 },
  { month: 'Apr', sales: 4600, orders: 350, visitors: 8900 },
  { month: 'May', sales: 5800, orders: 420, visitors: 11200 },
  { month: 'Jun', sales: 6200, orders: 480, visitors: 12500 },
];

export function LineChartExample({ theme, onInteraction }: LineChartExampleProps) {
  // ECharts 6: Resolve 'auto' theme for UI styling (charts handle 'auto' internally)
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Basic Line Chart */}
      <section>
        <h3 style={{
          margin: '0 0 16px 0',
          color: resolvedTheme === 'dark' ? '#fff' : '#333'
        }}>
          Basic Line Chart
        </h3>
        <LineChart
          data={monthlyData}
          xField="month"
          yField="sales"
          title="Monthly Sales"
          theme={theme}
          height={350}
          onDataPointClick={(params) => {
            onInteraction?.(`Clicked: ${params.name} - $${params.value?.toLocaleString()}`);
          }}
        />
      </section>

      {/* Smooth Line with Area */}
      <section>
        <h3 style={{
          margin: '0 0 16px 0',
          color: resolvedTheme === 'dark' ? '#fff' : '#333'
        }}>
          Smooth Line with Area
        </h3>
        <LineChart
          data={monthlyData}
          xField="month"
          yField="visitors"
          title="Website Visitors"
          theme={theme}
          height={350}
          smooth
          showArea
          areaOpacity={0.3}
        />
      </section>

      {/* Multi-Series Line Chart */}
      <section>
        <h3 style={{
          margin: '0 0 16px 0',
          color: resolvedTheme === 'dark' ? '#fff' : '#333'
        }}>
          Multi-Series Line Chart
        </h3>
        <LineChart
          data={monthlyData}
          xField="month"
          yField={['sales', 'orders']}
          title="Sales & Orders Trend"
          theme={theme}
          height={350}
          smooth
          legend={{ show: true }}
          onDataPointClick={(params) => {
            onInteraction?.(`Clicked: ${params.seriesName} - ${params.name} - ${params.value?.toLocaleString()}`);
          }}
        />
      </section>

      {/* Line Chart with Points */}
      <section>
        <h3 style={{
          margin: '0 0 16px 0',
          color: resolvedTheme === 'dark' ? '#fff' : '#333'
        }}>
          Line Chart with Points
        </h3>
        <LineChart
          data={monthlyData}
          xField="month"
          yField="orders"
          title="Monthly Orders"
          theme={theme}
          height={350}
          showPoints
          pointSize={8}
        />
      </section>
    </div>
  );
}
