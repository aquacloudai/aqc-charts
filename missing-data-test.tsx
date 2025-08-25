import React from 'react';
import { LineChart } from './src/index';

// Test data with missing values to demonstrate the fix
const testDataWithMissingValues = [
  // Series A has data for Jan, Feb, Mar, May
  { date: 'Jan', series: 'A', value: 10 },
  { date: 'Feb', series: 'A', value: 20 },
  { date: 'Mar', series: 'A', value: 15 },
  { date: 'May', series: 'A', value: 25 },
  
  // Series B has data for Jan, Mar, Apr, May
  { date: 'Jan', series: 'B', value: 8 },
  { date: 'Mar', series: 'B', value: 18 },
  { date: 'Apr', series: 'B', value: 22 },
  { date: 'May', series: 'B', value: 12 },
  
  // Series C has data for Feb, Apr, May
  { date: 'Feb', series: 'C', value: 14 },
  { date: 'Apr', series: 'C', value: 16 },
  { date: 'May', series: 'C', value: 20 },
];

// Test data using explicit series format
const explicitSeriesWithMissingData = [
  {
    name: 'Series 1',
    data: [
      { date: 'Jan', value: 100 },
      { date: 'Mar', value: 150 }, // Missing Feb
      { date: 'May', value: 200 }, // Missing Apr
    ]
  },
  {
    name: 'Series 2', 
    data: [
      { date: 'Feb', value: 80 }, // Missing Jan
      { date: 'Mar', value: 120 },
      { date: 'Apr', value: 160 }, // Missing May
    ]
  }
];

// Test data using multiple y fields with missing data
const multiYFieldDataWithMissing = [
  { month: 'Jan', sales: 100, profit: null, expenses: 80 }, // profit missing
  { month: 'Feb', sales: null, profit: 25, expenses: 85 }, // sales missing  
  { month: 'Mar', sales: 120, profit: 30, expenses: null }, // expenses missing
  { month: 'Apr', sales: 110, profit: 28, expenses: 82 },
  { month: 'May', sales: 130, profit: null, expenses: 90 }, // profit missing
];

function MissingDataTestComponent() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Missing Data Alignment Test</h2>
      
      <div style={{ marginBottom: '40px' }}>
        <h3>1. Grouped Series with Missing Data (seriesField)</h3>
        <p>Series A missing Apr, Series B missing Feb, Series C missing Jan & Mar</p>
        <LineChart
          data={testDataWithMissingValues}
          xField="date"
          yField="value"
          seriesField="series"
          title="Grouped Series with Missing Data Points"
          height={300}
          smooth={true}
          showPoints={true}
          legend={{ show: true, position: 'top' }}
          tooltip={{ show: true, trigger: 'axis' }}
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3>2. Explicit Series with Missing Data</h3>
        <p>Series 1 missing Feb & Apr, Series 2 missing Jan & May</p>
        <LineChart
          series={explicitSeriesWithMissingData}
          data={[]} // Required but not used when series is provided
          xField="date"
          yField="value"
          title="Explicit Series with Missing Data Points"
          height={300}
          smooth={true}
          showPoints={true}
          legend={{ show: true, position: 'top' }}
          tooltip={{ show: true, trigger: 'axis' }}
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3>3. Multiple Y Fields with Missing Data</h3>
        <p>Various fields have null values in different months</p>
        <LineChart
          data={multiYFieldDataWithMissing}
          xField="month"
          yField={['sales', 'profit', 'expenses']}
          title="Multiple Y Fields with Missing Data Points"
          height={300}
          smooth={true}
          showPoints={true}
          legend={{ show: true, position: 'top' }}
          tooltip={{ show: true, trigger: 'axis' }}
        />
      </div>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e8f4fd', 
        border: '1px solid #b3d8f0', 
        borderRadius: '4px' 
      }}>
        <h4>Expected Behavior:</h4>
        <ul>
          <li>All charts should have properly aligned x-axis values (all months/dates present)</li>
          <li>Missing data points should appear as gaps in the lines (not misaligned)</li>
          <li>Tooltips should show correct dates for each data point</li>
          <li>Lines should not appear to "jump" to wrong x-axis positions</li>
        </ul>
      </div>
    </div>
  );
}

export default MissingDataTestComponent;