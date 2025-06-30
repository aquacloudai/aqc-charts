import React from 'react';
import { LineChart, BarChart, CalendarHeatmapChart, StackedBarChart, SankeyChart, PieChart } from 'aqc-charts';
import { TemperatureExample } from './TemperatureExample';
import { ApiIntegrationExample } from './ApiIntegrationExample';
import { ScatterExample } from './ScatterExample';
import { RegressionExample } from './RegressionExample';
import { AdvancedScatterExample } from './AdvancedScatterExample';
import { shouldShowAllLabels } from 'echarts/types/src/coord/axisHelper.js';

const sampleData = {
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [
    {
      name: 'Series 1',
      data: [10, 20, 30, 40, 30, 20],
    },
    {
      name: 'Series 2',
      data: [20, 30, 40, 50, 40, 30],
    }
  ]
};

const pieChartData = [
  {
    name: 'Category A',
    value: 40,
  },
  {
    name: 'Category B',
    value: 30,
  },
  {
    name: 'Category C',
    value: 20,
  },
  {
    name: 'Category D',
    value: 10,
  }
];

const barData = {
  categories: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
  series: [
    {
      name: 'Category A',
      data: [100, 200, 300, 400, 500],
    },
    {
      name: 'Category B',
      data: [150, 250, 350, 450, 550],
    }
  ]
};

// Generate calendar heatmap data for 2024
function generateCalendarData(year: number) {
  const data = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);
  const dayTime = 24 * 60 * 60 * 1000;

  for (let time = startDate.getTime(); time < endDate.getTime(); time += dayTime) {
    const date = new Date(time);
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const value = Math.floor(Math.random() * 100);
    data.push({ date: dateStr, value });
  }

  return data;
}

const calendarData = generateCalendarData(2024);

// Stacked bar chart data based on the provided example
const stackedBarData = {
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    {
      name: 'Direct',
      data: [100, 302, 301, 334, 390, 330, 320],
      color: '#5470c6',
    },
    {
      name: 'Mail Ad',
      data: [320, 132, 101, 134, 90, 230, 210],
      color: '#91cc75',
    },
    {
      name: 'Affiliate Ad',
      data: [220, 182, 191, 234, 290, 330, 310],
      color: '#fac858',
    },
    {
      name: 'Video Ad',
      data: [150, 212, 201, 154, 190, 330, 410],
      color: '#ee6666',
    },
    {
      name: 'Search Engine',
      data: [820, 832, 901, 934, 1290, 1330, 1320],
      color: '#73c0de',
    },
  ],
};

// Sankey chart data based on the provided example
const sankeyData = {
  nodes: [
    { name: 'a' },
    { name: 'b' },
    { name: 'a1' },
    { name: 'a2' },
    { name: 'b1' },
    { name: 'c' }
  ],
  links: [
    { source: 'a', target: 'a1', value: 5 },
    { source: 'a', target: 'a2', value: 3 },
    { source: 'b', target: 'b1', value: 8 },
    { source: 'a', target: 'b1', value: 3 },
    { source: 'b1', target: 'a1', value: 1 },
    { source: 'b1', target: 'c', value: 2 }
  ]
};

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>AQC Charts Example</h1>

      <h2>Pie Chart</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <PieChart
          data={pieChartData}
          title="Sample Pie Chart"
          width="100%"
          height={400}
          showLegend={false}
          legend={{
            type: 'scroll',
            orient: 'vertical',
            right: 20,
            top: 40,
            bottom: 20,
          }}
        />
      </div>

      <h2>Line Chart</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <LineChart
          data={sampleData}
          title="Sample Line Chart"
          width="100%"
          height={400}
        />
      </div>

      <h2>Line Chart (Legend Hidden)</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <LineChart
          data={sampleData}
          title="Sample Line Chart - No Legend"
          width="100%"
          height={400}
          legend={{ show: false }}
        />
      </div>

      <h2>Bar Chart</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <BarChart
          data={barData}
          title="Sample Bar Chart"
          width="100%"
          height={400}
          showLegend
          legend={{
            orient: 'horizontal',
            bottom: 10,
          }}
          tooltip={{
            formatter: '{b}<br/>{a}: {c}',
          }}
        />
      </div>

      <h2>Bar Chart (No Legend)</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <BarChart
          data={barData}
          title="Sample Bar Chart - No Legend"
          width="100%"
          height={400}
          showLegend={false}
        />
      </div>

      <h2>Calendar Heatmap Chart</h2>
      <div style={{ height: '300px', marginBottom: '40px' }}>
        <CalendarHeatmapChart
          data={calendarData}
          year={2024}
          title="Daily Activity Heatmap 2024"
          width="100%"
          height={300}
          visualMap={{
            min: 0,
            max: 100,
            type: 'piecewise',
            orient: 'horizontal',
            left: 'center',
            inRange: {
              color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
            },
          }}
          tooltipFormatter={(params) => {
            const [date, value] = params.value;
            return `${date}<br/>Activity: ${value}`;
          }}
        />
      </div>

      <h2>Stacked Bar Chart</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <StackedBarChart
          data={stackedBarData}
          title="Marketing Channel Performance"
          width="100%"
          height={400}
          showValues={true}
        />
      </div>

      <h2>Stacked Bar Chart (Percentage)</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <StackedBarChart
          data={stackedBarData}
          title="Marketing Channel Performance (Percentage)"
          width="100%"
          height={400}
          showPercentage={true}
          showValues={true}
        />
      </div>

      <h2>Horizontal Stacked Bar Chart</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <StackedBarChart
          data={stackedBarData}
          title="Marketing Channel Performance (Horizontal)"
          width="100%"
          height={400}
          horizontal={true}
          showValues={true}

        />
      </div>

      <h2>Sankey Chart</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <SankeyChart
          data={sankeyData}
          title="Flow Diagram"
          width="100%"
          height={400}
        />
      </div>

      <h2>Vertical Sankey Chart</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <SankeyChart
          data={sankeyData}
          title="Vertical Flow Diagram"
          width="100%"
          height={400}
          orient="vertical"
          nodeAlign="left"
        />
      </div>

      <h2>Temperature Visualization (Advanced Line Styling)</h2>
      <div style={{ height: '600px', marginBottom: '40px' }}>
        <TemperatureExample />
      </div>

      <h2>API Integration Patterns</h2>
      <div style={{ marginBottom: '40px' }}>
        <ApiIntegrationExample />
      </div>

      <h2>Scatter Charts & Data Analysis</h2>
      <div style={{ marginBottom: '40px' }}>
        <ScatterExample />
      </div>

      <h2>Advanced Regression Analysis</h2>
      <div style={{ marginBottom: '40px' }}>
        <RegressionExample />
      </div>

      <h2>Advanced Scatter Chart Features</h2>
      <div style={{ marginBottom: '40px' }}>
        <AdvancedScatterExample />
      </div>
    </div>
  );
}

export default App;