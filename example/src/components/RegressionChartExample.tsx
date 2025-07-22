import React, { useState } from 'react';
import { RegressionChart } from 'aqc-charts';
import type { RegressionChartProps } from 'aqc-charts';

// Sample data for different regression examples
const linearData = [
  { x: 1, y: 2.1 },
  { x: 2, y: 3.9 },
  { x: 3, y: 6.2 },
  { x: 4, y: 7.8 },
  { x: 5, y: 10.1 },
  { x: 6, y: 11.8 },
  { x: 7, y: 14.2 },
  { x: 8, y: 15.9 },
  { x: 9, y: 18.1 },
  { x: 10, y: 20.0 }
];

const exponentialData = [
  { x: 1, y: 2.7 },
  { x: 2, y: 7.4 },
  { x: 3, y: 20.1 },
  { x: 4, y: 54.6 },
  { x: 5, y: 148.4 },
  { x: 6, y: 403.4 },
  { x: 7, y: 1096.6 },
  { x: 8, y: 2980.9 },
  { x: 9, y: 8103.1 },
  { x: 10, y: 22026.5 }
];

const polynomialData = [
  { x: 1, y: 1 },
  { x: 2, y: 8 },
  { x: 3, y: 27 },
  { x: 4, y: 64 },
  { x: 5, y: 125 },
  { x: 6, y: 216 },
  { x: 7, y: 343 },
  { x: 8, y: 512 },
  { x: 9, y: 729 },
  { x: 10, y: 1000 }
];

const logarithmicData = [
  { x: 1, y: 0 },
  { x: 2, y: 0.69 },
  { x: 3, y: 1.10 },
  { x: 4, y: 1.39 },
  { x: 5, y: 1.61 },
  { x: 6, y: 1.79 },
  { x: 7, y: 1.95 },
  { x: 8, y: 2.08 },
  { x: 9, y: 2.20 },
  { x: 10, y: 2.30 }
];

const scatteredLinearData = [
  { x: 1, y: 2.3 },
  { x: 2, y: 3.1 },
  { x: 3, y: 5.8 },
  { x: 4, y: 8.2 },
  { x: 5, y: 9.9 },
  { x: 6, y: 12.1 },
  { x: 7, y: 13.8 },
  { x: 8, y: 16.2 },
  { x: 9, y: 17.9 },
  { x: 10, y: 20.1 },
  { x: 11, y: 21.8 },
  { x: 12, y: 24.2 }
];

export const RegressionChartExample: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<RegressionChartProps['method']>('linear');
  const [selectedDataset, setSelectedDataset] = useState<'linear' | 'exponential' | 'polynomial' | 'logarithmic' | 'scattered'>('linear');

  const getDataForDataset = () => {
    switch (selectedDataset) {
      case 'exponential':
        return exponentialData;
      case 'polynomial':
        return polynomialData;
      case 'logarithmic':
        return logarithmicData;
      case 'scattered':
        return scatteredLinearData;
      default:
        return linearData;
    }
  };

  const getTitle = () => {
    return `${selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} Regression - ${selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)} Dataset`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Regression Chart Examples</h2>
      
      {/* Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Regression Method:</label>
          <select 
            value={selectedMethod} 
            onChange={(e) => setSelectedMethod(e.target.value as RegressionChartProps['method'])}
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="linear">Linear</option>
            <option value="exponential">Exponential</option>
            <option value="logarithmic">Logarithmic</option>
            <option value="polynomial">Polynomial</option>
          </select>
        </div>
        
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Dataset:</label>
          <select 
            value={selectedDataset} 
            onChange={(e) => setSelectedDataset(e.target.value as any)}
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="linear">Linear Data</option>
            <option value="exponential">Exponential Data</option>
            <option value="polynomial">Polynomial Data</option>
            <option value="logarithmic">Logarithmic Data</option>
            <option value="scattered">Scattered Linear</option>
          </select>
        </div>
      </div>

      {/* Interactive Regression Chart */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Interactive Regression Chart</h3>
        <RegressionChart
          data={getDataForDataset()}
          method={selectedMethod}
          order={selectedMethod === 'polynomial' ? 3 : undefined}
          title={getTitle()}
          xField="x"
          yField="y"
          width="100%"
          height={400}
          showEquation={true}
          showRSquared={true}
          equationPosition="top-left"
          pointSize={8}
          pointOpacity={0.7}
          lineWidth={2}
          pointsLabel="Observed Data"
          regressionLabel={`${selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} Fit`}
          legend={{
            show: true,
            position: 'bottom'
          }}
          xAxis={{
            label: 'X Value',
            grid: true
          }}
          yAxis={{
            label: 'Y Value',
            grid: true
          }}
        />
      </div>

      {/* Linear Regression Example */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Linear Regression</h3>
        <RegressionChart
          data={linearData}
          method="linear"
          title="Linear Regression Example"
          showEquation={true}
          equationPosition="top-right"
          pointSize={10}
          lineColor="#e74c3c"
          width="100%"
          height={350}
        />
      </div>

      {/* Polynomial Regression Example */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Polynomial Regression</h3>
        <RegressionChart
          data={polynomialData}
          method="polynomial"
          order={3}
          title="Cubic Polynomial Regression"
          showEquation={true}
          equationPosition="bottom-right"
          pointSize={8}
          lineColor="#3498db"
          lineWidth={3}
          width="100%"
          height={350}
        />
      </div>

      {/* Array Data Format Example */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Array Data Format</h3>
        <RegressionChart
          data={[[1, 2], [2, 4.1], [3, 5.9], [4, 8.2], [5, 9.8]]}
          method="linear"
          title="Linear Regression with Array Data"
          showEquation={true}
          pointSize={12}
          pointShape="diamond"
          lineStyle="dashed"
          width="100%"
          height={350}
        />
      </div>

      {/* Multiple Styling Options */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Custom Styling</h3>
        <RegressionChart
          data={scatteredLinearData}
          method="linear"
          title="Custom Styled Regression Chart"
          showEquation={true}
          equationPosition="top-left"
          pointSize={10}
          pointShape="square"
          pointOpacity={0.8}
          lineColor="#9b59b6"
          lineWidth={2}
          lineStyle="dotted"
          backgroundColor="#f8f9fa"
          colorPalette={['#e74c3c', '#9b59b6']}
          width="100%"
          height={350}
          legend={{
            show: true,
            position: 'top',
            align: 'end'
          }}
        />
      </div>

      {/* Without Equation Display */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Without Equation Display</h3>
        <RegressionChart
          data={exponentialData}
          method="exponential"
          title="Exponential Regression (No Equation)"
          showEquation={false}
          pointSize={8}
          lineColor="#f39c12"
          width="100%"
          height={350}
        />
      </div>

      {/* Points Only (No Regression Line) */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Points Only (No Regression Line)</h3>
        <RegressionChart
          data={linearData}
          method="linear"
          title="Data Points Only"
          showLine={false}
          pointSize={12}
          pointShape="triangle"
          width="100%"
          height={350}
        />
      </div>
    </div>
  );
};