import { PieChart, useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface PieChartExampleProps {
  theme: 'light' | 'dark' | 'auto';
  onInteraction?: (data: string) => void;
}

// Sample market share data
const marketData = [
  { segment: 'Desktop', share: 45 },
  { segment: 'Mobile', share: 35 },
  { segment: 'Tablet', share: 15 },
  { segment: 'Other', share: 5 },
];

// Sample expense data
const expenseData = [
  { category: 'Salaries', amount: 45000 },
  { category: 'Marketing', amount: 12000 },
  { category: 'Operations', amount: 18000 },
  { category: 'R&D', amount: 25000 },
  { category: 'Admin', amount: 8000 },
];

export function PieChartExample({ theme, onInteraction }: PieChartExampleProps) {
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Basic Pie Chart */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Basic Pie Chart
        </h3>
        <PieChart
          data={marketData}
          nameField="segment"
          valueField="share"
          title="Market Share by Platform"
          theme={theme}
          height={350}
          onDataPointClick={(params) => {
            onInteraction?.(`Clicked: ${params.name} - ${params.value}%`);
          }}
        />
      </section>

      {/* Donut Chart */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Donut Chart
        </h3>
        <PieChart
          data={expenseData}
          nameField="category"
          valueField="amount"
          title="Monthly Expenses"
          theme={theme}
          height={350}
          radius={['40%', '70%']}
          showPercentages
        />
      </section>

      {/* Rose/Nightingale Chart */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Rose Chart (Nightingale)
        </h3>
        <PieChart
          data={marketData}
          nameField="segment"
          valueField="share"
          title="Platform Distribution"
          theme={theme}
          height={350}
          roseType="area"
          showLabels
        />
      </section>
    </div>
  );
}
