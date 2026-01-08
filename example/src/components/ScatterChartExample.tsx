import { ScatterChart, useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface ScatterChartExampleProps {
  theme: 'light' | 'dark' | 'auto';
  onInteraction?: (data: string) => void;
}

// Sample correlation data
const salesProfitData = [
  { sales: 120, profit: 25, region: 'North' },
  { sales: 180, profit: 45, region: 'South' },
  { sales: 150, profit: 32, region: 'East' },
  { sales: 200, profit: 52, region: 'West' },
  { sales: 90, profit: 18, region: 'North' },
  { sales: 220, profit: 58, region: 'South' },
  { sales: 170, profit: 38, region: 'East' },
  { sales: 140, profit: 28, region: 'West' },
  { sales: 190, profit: 48, region: 'North' },
  { sales: 160, profit: 35, region: 'South' },
];

// Sample bubble data
const companyData = [
  { revenue: 500, growth: 15, employees: 120 },
  { revenue: 800, growth: 22, employees: 250 },
  { revenue: 350, growth: 8, employees: 80 },
  { revenue: 1200, growth: 30, employees: 450 },
  { revenue: 650, growth: 18, employees: 180 },
  { revenue: 420, growth: 12, employees: 95 },
];

// Dense data for jittering demo (ECharts 6 feature)
const denseData = Array.from({ length: 100 }, (_, i) => ({
  category: Math.floor(i / 20) + 1, // 5 categories
  value: 50 + Math.random() * 30,
  group: i % 3 === 0 ? 'A' : i % 3 === 1 ? 'B' : 'C',
}));

export function ScatterChartExample({ theme, onInteraction }: ScatterChartExampleProps) {
  // ECharts 6: Resolve 'auto' theme for UI styling
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Basic Scatter Plot */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Basic Scatter Plot
        </h3>
        <ScatterChart
          data={salesProfitData}
          xField="sales"
          yField="profit"
          title="Sales vs Profit Correlation"
          theme={theme}
          height={350}
          pointSize={12}
          xAxis={{ name: 'Sales ($K)' }}
          yAxis={{ name: 'Profit ($K)' }}
          onDataPointClick={(params) => {
            const data = params.data as { sales: number; profit: number };
            onInteraction?.(`Point: Sales $${data?.sales}K, Profit $${data?.profit}K`);
          }}
        />
      </section>

      {/* Bubble Chart */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Bubble Chart (Size = Employees)
        </h3>
        <ScatterChart
          data={companyData}
          xField="revenue"
          yField="growth"
          sizeField="employees"
          title="Company Performance"
          theme={theme}
          height={350}
          pointSize={[10, 50]}
          xAxis={{ name: 'Revenue ($M)' }}
          yAxis={{ name: 'Growth (%)' }}
        />
      </section>

      {/* Scatter with Custom Styling */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Styled Scatter Plot
        </h3>
        <ScatterChart
          data={salesProfitData}
          xField="sales"
          yField="profit"
          title="Regional Performance"
          theme={theme}
          height={350}
          pointSize={15}
          pointShape="diamond"
          xAxis={{ name: 'Sales' }}
          yAxis={{ name: 'Profit' }}
        />
      </section>

      {/* ECharts 6: Jittering Demo (Beeswarm-style) */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Jittered Scatter (ECharts 6 Feature)
        </h3>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '14px',
          color: resolvedTheme === 'dark' ? '#aaa' : '#666'
        }}>
          Jittering adds random offsets to prevent point overlap while maintaining axis accuracy.
          This is useful for dense categorical data (beeswarm charts).
        </p>
        <ScatterChart
          data={denseData}
          xField="category"
          yField="value"
          title="Jittered Categorical Data"
          theme={theme}
          height={350}
          pointSize={8}
          jitter={true}
          xAxis={{ name: 'Category' }}
          yAxis={{ name: 'Value' }}
          onDataPointClick={(params) => {
            const data = params.data as { category: number; value: number; group: string };
            onInteraction?.(`Category ${data?.category}: Value ${data?.value?.toFixed(1)}`);
          }}
        />
      </section>
    </div>
  );
}
