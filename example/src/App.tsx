import React from 'react';
import { LineChart, BarChart, CalendarHeatmapChart, StackedBarChart, SankeyChart, PieChart, GanttChart } from 'aqc-charts';
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

// Gantt chart data - Project timeline example
const ganttData = {
  tasks: [
    {
      id: 'task1',
      name: 'Project Planning',
      category: 'Development',
      startTime: new Date('2024-01-01T09:00:00'),
      endTime: new Date('2024-01-05T17:00:00'),
      color: '#5470c6'
    },
    {
      id: 'task2',
      name: 'Requirements Analysis',
      category: 'Analysis', 
      startTime: new Date('2024-01-03T09:00:00'),
      endTime: new Date('2024-01-10T17:00:00'),
      color: '#91cc75',
      vip: true
    },
    {
      id: 'task3',
      name: 'UI Design',
      category: 'Design',
      startTime: new Date('2024-01-08T09:00:00'),
      endTime: new Date('2024-01-15T17:00:00'),
      color: '#fac858'
    },
    {
      id: 'task4',
      name: 'Frontend Development',
      category: 'Development',
      startTime: new Date('2024-01-12T09:00:00'),
      endTime: new Date('2024-01-25T17:00:00'),
      color: '#5470c6'
    },
    {
      id: 'task5',
      name: 'Backend Development',
      category: 'Development',
      startTime: new Date('2024-01-15T09:00:00'),
      endTime: new Date('2024-01-30T17:00:00'),
      color: '#5470c6'
    },
    {
      id: 'task6',
      name: 'Integration Testing',
      category: 'Testing',
      startTime: new Date('2024-01-25T09:00:00'),
      endTime: new Date('2024-02-05T17:00:00'),
      color: '#ee6666',
      vip: true
    },
    {
      id: 'task7',
      name: 'User Acceptance Testing',
      category: 'Testing',
      startTime: new Date('2024-02-01T09:00:00'),
      endTime: new Date('2024-02-08T17:00:00'),
      color: '#ee6666'
    },
    {
      id: 'task8',
      name: 'Code Review',
      category: 'Review',
      startTime: new Date('2024-02-05T09:00:00'),
      endTime: new Date('2024-02-10T17:00:00'),
      color: '#73c0de'
    },
    {
      id: 'task9',
      name: 'Deployment',
      category: 'Deployment',
      startTime: new Date('2024-02-08T09:00:00'),
      endTime: new Date('2024-02-12T17:00:00'),
      color: '#9a60b4',
      vip: true
    },
    {
      id: 'task10',
      name: 'Documentation',
      category: 'Documentation',
      startTime: new Date('2024-02-10T09:00:00'),
      endTime: new Date('2024-02-15T17:00:00'),
      color: '#ea7ccc'
    }
  ],
  categories: [
    { name: 'Development', label: 'Development Team' },
    { name: 'Analysis', label: 'Business Analysis' },
    { name: 'Design', label: 'UI/UX Design' },
    { name: 'Testing', label: 'QA Testing' },
    { name: 'Review', label: 'Code Review' },
    { name: 'Deployment', label: 'DevOps' },
    { name: 'Documentation', label: 'Technical Writing' }
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
          showLegend
          legend={{
            orient: 'horizontal',
            bottom: 10,
          }}
          tooltip={{
            trigger: 'axis',
            formatter: '{b}<br/>{a0}: {c0}<br/>{a1}: {c1}<br/>{a2}: {c2}',
          }}
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
          showLegend
          legend={{
            orient: 'vertical',
            right: 10,
            top: 'middle',
          }}
        />
      </div>

      <h2>Stacked Bar Chart (No Legend)</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <StackedBarChart
          data={stackedBarData}
          title="Marketing Channel Performance - No Legend"
          width="100%"
          height={400}
          showValues={true}
          showLegend={false}
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

      <h2>Gantt Chart - Project Timeline</h2>
      <div style={{ height: '500px', marginBottom: '40px' }}>
        <GanttChart
          data={ganttData}
          title="Software Development Project Timeline"
          width="100%"
          height={500}
          showDataZoom={true}
          heightRatio={0.7}
          tooltip={{
            formatter: (params: any) => {
              if (Array.isArray(params)) {
                const param = params[0];
                if (param?.seriesIndex === 0) {
                  const startTime = new Date(param.value[1]).toLocaleDateString();
                  const endTime = new Date(param.value[2]).toLocaleDateString();
                  const taskName = param.value[3];
                  const category = ganttData.categories[param.value[0]]?.label || 'Unknown';
                  const isVip = param.value[4] ? ' (Priority)' : '';
                  return `
                    <strong>${taskName}${isVip}</strong><br/>
                    Team: ${category}<br/>
                    Start: ${startTime}<br/>
                    End: ${endTime}
                  `;
                }
              }
              return '';
            }
          }}
        />
      </div>

      <h2>Gantt Chart - Simplified View</h2>
      <div style={{ height: '400px', marginBottom: '40px' }}>
        <GanttChart
          data={{
            tasks: ganttData.tasks.slice(0, 6), // Show only first 6 tasks
            categories: ganttData.categories.slice(0, 4) // Show only first 4 categories
          }}
          title="Project Timeline - Phase 1"
          width="100%"
          height={400}
          showDataZoom={false}
          heightRatio={0.8}
          grid={{
            left: 120,
            right: 20,
            top: 80,
            bottom: 20,
            backgroundColor: '#fafafa'
          }}
        />
      </div>
    </div>
  );
}

export default App;