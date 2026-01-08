import { ClusterChart, useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface ClusterChartExampleProps {
  theme: 'light' | 'dark' | 'auto';
  onInteraction?: (data: string) => void;
}

// Customer segmentation data
const customerData = [
  // High value, high frequency
  { age: 35, spending: 850, name: 'Premium A' },
  { age: 42, spending: 920, name: 'Premium B' },
  { age: 38, spending: 780, name: 'Premium C' },
  { age: 45, spending: 890, name: 'Premium D' },
  { age: 40, spending: 950, name: 'Premium E' },
  // Medium value
  { age: 28, spending: 450, name: 'Regular A' },
  { age: 32, spending: 520, name: 'Regular B' },
  { age: 30, spending: 480, name: 'Regular C' },
  { age: 25, spending: 420, name: 'Regular D' },
  { age: 29, spending: 550, name: 'Regular E' },
  // Budget conscious
  { age: 22, spending: 180, name: 'Budget A' },
  { age: 24, spending: 220, name: 'Budget B' },
  { age: 21, spending: 150, name: 'Budget C' },
  { age: 23, spending: 200, name: 'Budget D' },
  { age: 26, spending: 250, name: 'Budget E' },
];

// Product performance data
const productData = [
  // High performers
  { price: 120, sales: 450 },
  { price: 135, sales: 480 },
  { price: 110, sales: 420 },
  { price: 125, sales: 510 },
  // Mid-range
  { price: 75, sales: 280 },
  { price: 80, sales: 320 },
  { price: 70, sales: 250 },
  { price: 85, sales: 290 },
  // Budget items
  { price: 25, sales: 180 },
  { price: 30, sales: 220 },
  { price: 20, sales: 150 },
  { price: 35, sales: 200 },
  // Premium niche
  { price: 200, sales: 120 },
  { price: 220, sales: 100 },
  { price: 180, sales: 140 },
];

// Geographic clustering
const locationData = [
  // Urban cluster
  { x: 50, y: 80 }, { x: 55, y: 85 }, { x: 48, y: 78 }, { x: 52, y: 82 },
  // Suburban cluster
  { x: 30, y: 40 }, { x: 35, y: 45 }, { x: 28, y: 38 }, { x: 32, y: 42 },
  // Rural cluster
  { x: 70, y: 20 }, { x: 75, y: 25 }, { x: 68, y: 18 }, { x: 72, y: 22 },
  // Mixed area
  { x: 45, y: 55 }, { x: 50, y: 50 }, { x: 42, y: 58 },
];

export function ClusterChartExample({ theme, onInteraction }: ClusterChartExampleProps) {
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Customer Segmentation */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Customer Segmentation (K-means)
        </h3>
        <ClusterChart
          data={customerData}
          xField="age"
          yField="spending"
          clusterCount={3}
          title="Customer Segments by Age & Spending"
          theme={theme}
          height={400}
          pointSize={14}
          xAxis={{ name: 'Age' }}
          yAxis={{ name: 'Monthly Spending ($)' }}
          onDataPointClick={(params) => {
            const data = params.data as { age: number; spending: number };
            onInteraction?.(`Age: ${data?.age}, Spending: $${data?.spending}`);
          }}
        />
      </section>

      {/* Product Clustering */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Product Performance Clusters
        </h3>
        <ClusterChart
          data={productData}
          xField="price"
          yField="sales"
          clusterCount={4}
          title="Price vs Sales Volume"
          theme={theme}
          height={400}
          pointSize={12}
          xAxis={{ name: 'Price ($)' }}
          yAxis={{ name: 'Units Sold' }}
        />
      </section>

      {/* Geographic Clustering */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Location-based Clustering
        </h3>
        <ClusterChart
          data={locationData}
          xField="x"
          yField="y"
          clusterCount={3}
          title="Geographic Distribution"
          theme={theme}
          height={400}
          pointSize={16}
          xAxis={{ name: 'Longitude' }}
          yAxis={{ name: 'Latitude' }}
        />
      </section>
    </div>
  );
}
