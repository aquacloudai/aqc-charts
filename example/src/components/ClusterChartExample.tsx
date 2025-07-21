import React from 'react';
import { ClusterChart } from 'aqc-charts';

// Sample datasets for cluster chart demonstrations
const customerSegmentData = [
  { age: 25, income: 35000, spending: 2000, name: 'Alice' },
  { age: 30, income: 45000, spending: 3500, name: 'Bob' },
  { age: 35, income: 55000, spending: 4200, name: 'Charlie' },
  { age: 28, income: 40000, spending: 2800, name: 'Diana' },
  { age: 45, income: 75000, spending: 5500, name: 'Eve' },
  { age: 50, income: 85000, spending: 6200, name: 'Frank' },
  { age: 55, income: 95000, spending: 7000, name: 'Grace' },
  { age: 32, income: 48000, spending: 3200, name: 'Henry' },
  { age: 27, income: 38000, spending: 2500, name: 'Ivy' },
  { age: 42, income: 68000, spending: 5000, name: 'Jack' },
  { age: 38, income: 58000, spending: 4000, name: 'Kate' },
  { age: 29, income: 42000, spending: 3000, name: 'Liam' },
  { age: 48, income: 78000, spending: 5800, name: 'Mia' },
  { age: 33, income: 52000, spending: 3800, name: 'Noah' },
  { age: 26, income: 36000, spending: 2200, name: 'Olivia' },
  { age: 44, income: 72000, spending: 5200, name: 'Peter' },
  { age: 31, income: 46000, spending: 3300, name: 'Quinn' },
  { age: 52, income: 88000, spending: 6500, name: 'Rachel' },
  { age: 36, income: 56000, spending: 4100, name: 'Sam' },
  { age: 41, income: 65000, spending: 4800, name: 'Tom' }
];

const performanceData = [
  { efficiency: 85, satisfaction: 75, department: 'Engineering' },
  { efficiency: 78, satisfaction: 82, department: 'Engineering' },
  { efficiency: 90, satisfaction: 70, department: 'Engineering' },
  { efficiency: 82, satisfaction: 78, department: 'Engineering' },
  { efficiency: 75, satisfaction: 88, department: 'Marketing' },
  { efficiency: 68, satisfaction: 92, department: 'Marketing' },
  { efficiency: 72, satisfaction: 85, department: 'Marketing' },
  { efficiency: 80, satisfaction: 80, department: 'Marketing' },
  { efficiency: 95, satisfaction: 65, department: 'Sales' },
  { efficiency: 88, satisfaction: 72, department: 'Sales' },
  { efficiency: 92, satisfaction: 68, department: 'Sales' },
  { efficiency: 85, satisfaction: 75, department: 'Sales' },
  { efficiency: 70, satisfaction: 95, department: 'Support' },
  { efficiency: 65, satisfaction: 98, department: 'Support' },
  { efficiency: 75, satisfaction: 90, department: 'Support' },
  { efficiency: 72, satisfaction: 88, department: 'Support' }
];

const simpleClusterData = [
  { x: 10, y: 12 },
  { x: 12, y: 14 },
  { x: 8, y: 10 },
  { x: 9, y: 11 },
  { x: 50, y: 55 },
  { x: 52, y: 58 },
  { x: 48, y: 52 },
  { x: 51, y: 56 },
  { x: 85, y: 20 },
  { x: 88, y: 18 },
  { x: 82, y: 22 },
  { x: 87, y: 19 },
  { x: 25, y: 80 },
  { x: 28, y: 82 },
  { x: 22, y: 78 },
  { x: 26, y: 85 }
];

const biologicalData = [
  { length: 4.5, weight: 0.8, species: 'Species A' },
  { length: 4.8, weight: 0.9, species: 'Species A' },
  { length: 4.2, weight: 0.7, species: 'Species A' },
  { length: 4.6, weight: 0.85, species: 'Species A' },
  { length: 6.2, weight: 1.8, species: 'Species B' },
  { length: 6.5, weight: 2.0, species: 'Species B' },
  { length: 6.0, weight: 1.7, species: 'Species B' },
  { length: 6.3, weight: 1.9, species: 'Species B' },
  { length: 8.1, weight: 3.2, species: 'Species C' },
  { length: 8.4, weight: 3.5, species: 'Species C' },
  { length: 7.9, weight: 3.0, species: 'Species C' },
  { length: 8.2, weight: 3.3, species: 'Species C' },
  { length: 5.2, weight: 1.2, species: 'Hybrid' },
  { length: 5.8, weight: 1.5, species: 'Hybrid' },
  { length: 7.1, weight: 2.4, species: 'Hybrid' },
  { length: 6.8, weight: 2.1, species: 'Hybrid' }
];

interface ClusterChartExampleProps {
  theme: 'light' | 'dark';
  colorPalette: readonly string[];
  onInteraction?: (data: string) => void;
}

export function ClusterChartExample({ theme, colorPalette, onInteraction }: ClusterChartExampleProps) {
  // Memoize the tooltip function to prevent re-clustering
  const customerTooltipFormatter = React.useMemo(() => (params: any) => {
    if (params.value && Array.isArray(params.value)) {
      const [age, income, cluster] = params.value;
      const customer = customerSegmentData.find(c => c.age === age && c.income === income);
      return `
        <div style="padding: 8px;">
          <strong>${customer?.name || 'Customer'}</strong><br/>
          Age: ${age} years<br/>
          Income: $${income?.toLocaleString()}<br/>
          Spending: $${customer?.spending?.toLocaleString()}<br/>
          Segment: ${cluster + 1}
        </div>
      `;
    }
    return `<div style="padding: 8px;">Customer data</div>`;
  }, []);

  const performanceTooltipFormatter = React.useMemo(() => (params: any) => {
    if (params.value && Array.isArray(params.value)) {
      const [efficiency, satisfaction, cluster] = params.value;
      const dept = performanceData.find(d => 
        d.efficiency === efficiency && d.satisfaction === satisfaction
      );
      return `
        <div style="padding: 8px;">
          <strong>${dept?.department || 'Department'}</strong><br/>
          Efficiency: ${efficiency}%<br/>
          Satisfaction: ${satisfaction}%<br/>
          Performance Group: ${cluster + 1}
        </div>
      `;
    }
    return `<div style="padding: 8px;">Performance data</div>`;
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
      {/* Simple Cluster Analysis */}
      <div>
        <h5 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '15px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          🔍 Simple Cluster Analysis - Pattern Recognition
        </h5>
        <ClusterChart
          data={simpleClusterData}
          xField="x"
          yField="y"
          title="Automatic Pattern Detection"
          subtitle="K-means clustering identifies natural data groupings"
          height={300}
          theme={theme}
          clusterCount={4}
          clusterColors={colorPalette}
          pointSize={12}
          showVisualMap={true}
          visualMapPosition="left"
          tooltip={{
            show: true,
            trigger: 'item',
            format: (params: any) => {
              if (params.value && Array.isArray(params.value)) {
                const [x, y, cluster] = params.value;
                return `
                  <div style="padding: 8px;">
                    <strong>Data Point</strong><br/>
                    X: ${x}<br/>
                    Y: ${y}<br/>
                    Cluster: ${cluster + 1}
                  </div>
                `;
              }
              return `<div style="padding: 8px;">Value: ${params.value}</div>`;
            },
          }}
          xAxis={{
            label: 'X Coordinate',
            type: 'linear',
            grid: true
          }}
          yAxis={{
            label: 'Y Coordinate',
            type: 'linear',
            grid: true
          }}
          onDataPointClick={(data) => {
            if (data.value && Array.isArray(data.value)) {
              const [x, y, cluster] = data.value;
              onInteraction?.(`Cluster ${cluster + 1}: Point (${x}, ${y})`);
            }
          }}
        />
      </div>

      {/* Customer Segmentation */}
      <div>
        <h5 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '15px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          👥 Customer Segmentation - Age vs Income Analysis
        </h5>
        <ClusterChart
          data={customerSegmentData}
          xField="age"
          yField="income"
          nameField="name"
          title="Customer Demographics Clustering"
          subtitle="Identifying customer segments based on age and income"
          height={350}
          theme={theme}
          clusterCount={3}
          clusterColors={[colorPalette[0], colorPalette[2], colorPalette[4]]}
          pointSize={10}
          pointOpacity={0.8}
          showVisualMap={true}
          visualMapPosition="right"
          tooltip={{
            show: true,
            trigger: 'item',
            format: customerTooltipFormatter,
          }}
          xAxis={{
            label: 'Age (years)',
            type: 'linear',
            min: 20,
            max: 60,
            grid: true
          }}
          yAxis={{
            label: 'Annual Income ($)',
            type: 'linear',
            format: '${value:,.0f}',
            grid: true
          }}
          onDataPointHover={(data) => {
            if (data.value && Array.isArray(data.value)) {
              const [age, income, cluster] = data.value;
              const customer = customerSegmentData.find(c => c.age === age && c.income === income);
              onInteraction?.(`${customer?.name}: Age ${age}, Income $${income?.toLocaleString()}, Segment ${cluster + 1}`);
            }
          }}
        />
      </div>

      {/* Performance Analysis */}
      <div>
        <h5 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '15px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          📊 Performance Analysis - Efficiency vs Satisfaction
        </h5>
        <ClusterChart
          data={performanceData}
          xField="efficiency"
          yField="satisfaction"
          nameField="department"
          title="Employee Performance Clusters"
          subtitle="Grouping departments by efficiency and satisfaction metrics"
          height={350}
          theme={theme}
          clusterCount={4}
          clusterColors={colorPalette}
          pointSize={14}
          pointOpacity={0.7}
          showVisualMap={true}
          visualMapPosition="top"
          tooltip={{
            show: true,
            trigger: 'item',
            format: performanceTooltipFormatter,
          }}
          xAxis={{
            label: 'Efficiency Score (%)',
            type: 'linear',
            min: 60,
            max: 100,
            grid: true
          }}
          yAxis={{
            label: 'Satisfaction Score (%)',
            type: 'linear',
            min: 60,
            max: 100,
            grid: true
          }}
          onDataPointClick={(data) => {
            if (data.value && Array.isArray(data.value)) {
              const [efficiency, satisfaction, cluster] = data.value;
              const dept = performanceData.find(d => 
                d.efficiency === efficiency && d.satisfaction === satisfaction
              );
              onInteraction?.(`${dept?.department}: ${efficiency}% efficiency, ${satisfaction}% satisfaction (Group ${cluster + 1})`);
            }
          }}
        />
      </div>

      {/* Biological Classification */}
      <div>
        <h5 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '15px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          🧬 Biological Classification - Species Analysis
        </h5>
        <ClusterChart
          data={biologicalData}
          xField="length"
          yField="weight"
          nameField="species"
          title="Species Classification by Physical Characteristics"
          subtitle="Automatic clustering reveals natural species groupings"
          height={350}
          theme={theme}
          clusterCount={3}
          clusterColors={[colorPalette[1], colorPalette[3], colorPalette[5]]}
          pointSize={12}
          pointOpacity={0.8}
          showVisualMap={true}
          visualMapPosition="bottom"
          tooltip={{
            show: true,
            trigger: 'item',
            format: (params: any) => {
              if (params.value && Array.isArray(params.value)) {
                const [length, weight, cluster] = params.value;
                const specimen = biologicalData.find(s => 
                  s.length === length && s.weight === weight
                );
                return `
                  <div style="padding: 8px;">
                    <strong>Specimen</strong><br/>
                    Length: ${length} cm<br/>
                    Weight: ${weight} kg<br/>
                    Known Species: ${specimen?.species}<br/>
                    Predicted Group: ${cluster + 1}
                  </div>
                `;
              }
              return `<div style="padding: 8px;">Specimen data</div>`;
            },
          }}
          xAxis={{
            label: 'Length (cm)',
            type: 'linear',
            grid: true
          }}
          yAxis={{
            label: 'Weight (kg)',
            type: 'linear',
            grid: true
          }}
          onDataPointClick={(data) => {
            if (data.value && Array.isArray(data.value)) {
              const [length, weight, cluster] = data.value;
              const specimen = biologicalData.find(s => 
                s.length === length && s.weight === weight
              );
              onInteraction?.(`${specimen?.species}: ${length}cm length, ${weight}kg weight (Cluster ${cluster + 1})`);
            }
          }}
        />
      </div>
    </div>
  );
}