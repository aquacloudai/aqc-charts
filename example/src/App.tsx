import React from 'react';
import { LineChart, BarChart, CalendarHeatmapChart, StackedBarChart } from 'aqc-charts';

const sampleData = [
  {
    name: 'Series 1',
    type: 'line' as const,
    data: [10, 20, 30, 40, 30, 20],
  },
  {
    name: 'Series 2', 
    type: 'line' as const,
    data: [20, 30, 40, 50, 40, 30],
  }
];

const barData = [
  {
    name: 'Category A',
    type: 'bar' as const,
    data: [100, 200, 300, 400, 500],
  },
  {
    name: 'Category B',
    type: 'bar' as const, 
    data: [150, 250, 350, 450, 550],
  }
];

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

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>AQC Charts Example</h1>
      
      <h2>Line Chart</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <LineChart
          data={sampleData}
          title="Sample Line Chart"
          width="100%"
          height={400}
        />
      </div>

      <h2>Bar Chart</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <BarChart
          data={barData}
          title="Sample Bar Chart"
          width="100%"
          height={400}
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
    </div>
  );
}

export default App;