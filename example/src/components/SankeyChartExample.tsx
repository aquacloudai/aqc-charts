import { SankeyChart, useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface SankeyChartExampleProps {
  theme: 'light' | 'dark' | 'auto';
  onInteraction?: (data: string) => void;
}

// Energy flow data
const energyFlowData = {
  nodes: [
    { name: 'Coal' },
    { name: 'Natural Gas' },
    { name: 'Oil' },
    { name: 'Nuclear' },
    { name: 'Renewable' },
    { name: 'Electricity' },
    { name: 'Heat' },
    { name: 'Industrial' },
    { name: 'Residential' },
    { name: 'Transport' },
  ],
  links: [
    { source: 'Coal', target: 'Electricity', value: 25 },
    { source: 'Coal', target: 'Heat', value: 10 },
    { source: 'Natural Gas', target: 'Electricity', value: 20 },
    { source: 'Natural Gas', target: 'Heat', value: 15 },
    { source: 'Oil', target: 'Transport', value: 30 },
    { source: 'Oil', target: 'Industrial', value: 10 },
    { source: 'Nuclear', target: 'Electricity', value: 15 },
    { source: 'Renewable', target: 'Electricity', value: 12 },
    { source: 'Electricity', target: 'Industrial', value: 35 },
    { source: 'Electricity', target: 'Residential', value: 25 },
    { source: 'Electricity', target: 'Transport', value: 12 },
    { source: 'Heat', target: 'Industrial', value: 15 },
    { source: 'Heat', target: 'Residential', value: 10 },
  ],
};

// Budget allocation data (flat format)
const budgetData = [
  { source: 'Revenue', target: 'Operations', value: 40 },
  { source: 'Revenue', target: 'Marketing', value: 25 },
  { source: 'Revenue', target: 'R&D', value: 20 },
  { source: 'Revenue', target: 'Admin', value: 15 },
  { source: 'Operations', target: 'Salaries', value: 25 },
  { source: 'Operations', target: 'Equipment', value: 10 },
  { source: 'Operations', target: 'Utilities', value: 5 },
  { source: 'Marketing', target: 'Digital', value: 15 },
  { source: 'Marketing', target: 'Events', value: 10 },
  { source: 'R&D', target: 'Research', value: 12 },
  { source: 'R&D', target: 'Development', value: 8 },
];

// Customer journey data (funnel style - no cycles allowed in Sankey)
const customerJourneyData = {
  nodes: [
    { name: 'Website Visit' },
    { name: 'Product Page' },
    { name: 'Add to Cart' },
    { name: 'Checkout' },
    { name: 'Purchase' },
    { name: 'Exit - Homepage' },
    { name: 'Exit - Product' },
    { name: 'Exit - Cart' },
    { name: 'Exit - Checkout' },
  ],
  links: [
    { source: 'Website Visit', target: 'Product Page', value: 1000 },
    { source: 'Website Visit', target: 'Exit - Homepage', value: 500 },
    { source: 'Product Page', target: 'Add to Cart', value: 600 },
    { source: 'Product Page', target: 'Exit - Product', value: 400 },
    { source: 'Add to Cart', target: 'Checkout', value: 400 },
    { source: 'Add to Cart', target: 'Exit - Cart', value: 200 },
    { source: 'Checkout', target: 'Purchase', value: 300 },
    { source: 'Checkout', target: 'Exit - Checkout', value: 100 },
  ],
};

export function SankeyChartExample({ theme, onInteraction }: SankeyChartExampleProps) {
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Energy Flow */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Energy Flow Diagram
        </h3>
        <SankeyChart
          data={energyFlowData}
          title="Energy Sources to Consumption"
          theme={theme}
          height={400}
          orient="horizontal"
          nodeAlign="justify"
          onDataPointClick={(params) => {
            if (params.dataType === 'node') {
              onInteraction?.(`Node: ${params.name}`);
            } else {
              const data = params.data as { source: string; target: string; value: number };
              onInteraction?.(`Flow: ${data?.source} → ${data?.target}: ${data?.value}`);
            }
          }}
        />
      </section>

      {/* Budget Allocation (flat data) */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Budget Allocation
        </h3>
        <SankeyChart
          data={budgetData}
          sourceField="source"
          targetField="target"
          valueField="value"
          title="Company Budget Flow"
          theme={theme}
          height={400}
          orient="horizontal"
          nodeAlign="left"
        />
      </section>

      {/* Customer Journey */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Customer Journey Funnel
        </h3>
        <SankeyChart
          data={customerJourneyData}
          title="E-commerce Customer Flow"
          theme={theme}
          height={400}
          orient="horizontal"
          nodeAlign="justify"
        />
      </section>
    </div>
  );
}
