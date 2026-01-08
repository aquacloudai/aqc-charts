import { BarChart, useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface BarChartExampleProps {
  theme: 'light' | 'dark' | 'auto';
  onInteraction?: (data: string) => void;
}

// Sample sales data
const salesData = [
  { quarter: 'Q1', revenue: 4200, profit: 820 },
  { quarter: 'Q2', revenue: 5800, profit: 1150 },
  { quarter: 'Q3', revenue: 4900, profit: 980 },
  { quarter: 'Q4', revenue: 7200, profit: 1440 },
];

export function BarChartExample({ theme, onInteraction }: BarChartExampleProps) {
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Basic Bar Chart */}
      <section>
        <h3 style={{
          margin: '0 0 16px 0',
          color: resolvedTheme === 'dark' ? '#fff' : '#333'
        }}>
          Basic Bar Chart
        </h3>
        <BarChart
          data={salesData}
          categoryField="quarter"
          valueField="revenue"
          title="Quarterly Revenue"
          theme={theme}
          height={350}
          onDataPointClick={(params) => {
            onInteraction?.(`Clicked: ${params.name} - $${params.value?.toLocaleString()}`);
          }}
        />
      </section>

      {/* Multi-Series Bar Chart */}
      <section>
        <h3 style={{
          margin: '0 0 16px 0',
          color: resolvedTheme === 'dark' ? '#fff' : '#333'
        }}>
          Multi-Series Bar Chart
        </h3>
        <BarChart
          data={salesData}
          categoryField="quarter"
          valueField={['revenue', 'profit']}
          title="Revenue vs Profit"
          theme={theme}
          height={350}
          legend={{ show: true }}
          onDataPointClick={(params) => {
            onInteraction?.(`Clicked: ${params.seriesName} - ${params.name} - $${params.value?.toLocaleString()}`);
          }}
        />
      </section>

      {/* Horizontal Bar Chart */}
      <section>
        <h3 style={{
          margin: '0 0 16px 0',
          color: resolvedTheme === 'dark' ? '#fff' : '#333'
        }}>
          Horizontal Bar Chart
        </h3>
        <BarChart
          data={salesData}
          categoryField="quarter"
          valueField="revenue"
          orientation="horizontal"
          title="Revenue by Quarter"
          theme={theme}
          height={350}
        />
      </section>
    </div>
  );
}
