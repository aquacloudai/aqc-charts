import React from 'react';
import { LineChart, formatDateForChart, preprocessDateFields } from './src/index';

// Example data that might cause date parsing issues
const problemData = [
  { month: '2023-01', sales: 100, region: 'North' },
  { month: '2023-02', sales: 120, region: 'North' },
  { month: '2023-03', sales: 110, region: 'North' },
  { month: '2023-01', sales: 80, region: 'South' },
  { month: '2023-02', sales: 90, region: 'South' },
  { month: '2023-03', sales: 95, region: 'South' }
];

// Example of the problematic usage (before fix)
const ProblematicChart = () => (
  <LineChart
    data={problemData}
    xField="month"
    yField="sales"
    seriesField="region"
  />
);

// Example 1: Fixed with explicit axis type configuration
const FixedChart1 = () => (
  <LineChart
    data={problemData}
    xField="month"
    yField="sales"
    seriesField="region"
    xAxis={{
      type: 'category', // Explicit override to prevent time parsing
      label: 'Month',
      boundaryGap: false,
      parseDate: false // Explicitly disable date parsing
    }}
  />
);

// Example 2: Fixed with date formatting utility
const FixedChart2 = () => {
  const formattedData = problemData.map(d => ({
    ...d,
    month: formatDateForChart(d.month, 'month') // "Jan 23", "Feb 23", etc.
  }));

  return (
    <LineChart
      data={formattedData}
      xField="month"
      yField="sales"
      seriesField="region"
    />
  );
};

// Example 3: Fixed with preprocessing utility
const FixedChart3 = () => {
  const safeData = preprocessDateFields(problemData, 'month', 'month');

  return (
    <LineChart
      data={safeData}
      xField="month"
      yField="sales"
      seriesField="region"
    />
  );
};

// Example showing all the ways to use the new functionality
const App = () => (
  <div style={{ padding: '20px' }}>
    <h2>Before Fix (May Parse Dates Incorrectly)</h2>
    <ProblematicChart />
    
    <h2>Fix 1: Explicit Axis Configuration</h2>
    <FixedChart1 />
    
    <h2>Fix 2: Date Formatting Utility</h2>
    <FixedChart2 />
    
    <h2>Fix 3: Preprocessing Utility</h2>
    <FixedChart3 />
  </div>
);

export default App;