import React from 'react';
import { CalendarHeatmapChart } from 'aqc-charts';

// Generate sample data for calendar heatmap demonstrations
const generateGitHubCommitData = (year: number) => {
  const data = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const date = d.toISOString().split('T')[0];
    // Generate random commit activity (0-20 commits per day)
    const commits = Math.floor(Math.random() * 21);
    data.push({ date, value: commits });
  }
  
  return data;
};

const generateActivityData = (year: number) => {
  const data = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const date = d.toISOString().split('T')[0];
    // Generate random activity score (0-100)
    const activity = Math.floor(Math.random() * 101);
    data.push({ date, activity_score: activity });
  }
  
  return data;
};

const generateTemperatureData = (year: number) => {
  const data = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const date = d.toISOString().split('T')[0];
    const dayOfYear = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    // Simulate temperature pattern throughout the year
    const baseTemp = 15 + 20 * Math.sin((dayOfYear / 365) * 2 * Math.PI);
    const randomVariation = (Math.random() - 0.5) * 10;
    const temperature = Math.round(baseTemp + randomVariation);
    data.push({ date, temp: temperature });
  }
  
  return data;
};

// Sample datasets
const commitData2023 = generateGitHubCommitData(2023);
const activityData2023 = generateActivityData(2023);
const temperatureData2023 = generateTemperatureData(2023);
const multiYearCommitData = [
  ...generateGitHubCommitData(2022),
  ...generateGitHubCommitData(2023)
];

interface CalendarHeatmapExampleProps {
  theme: 'light' | 'dark';
  colorPalette: readonly string[];
  onInteraction?: (data: string) => void;
}

export function CalendarHeatmapExample({ theme, colorPalette, onInteraction }: CalendarHeatmapExampleProps) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px', marginBottom: '25px' }}>
        {/* GitHub-style Commit Calendar */}
        <div>
          <h5 style={{
            color: theme === 'dark' ? '#fff' : '#333',
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            GitHub-style Commit Calendar
          </h5>
          <CalendarHeatmapChart
            data={commitData2023}
            year={2023}
            height={180}
            theme={theme}
            title="Daily Commits - 2023"
            colorScale={['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']}
            tooltip={{
              show: true,
              format: (params: any) => {
                const [date, commits] = params.value;
                const formattedDate = new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                return `${formattedDate}<br/>${commits} commits`;
              }
            }}
            onDataPointClick={(params) => {
              onInteraction?.(JSON.stringify({
                type: 'calendar_click',
                date: params.value[0],
                commits: params.value[1]
              }, null, 2));
            }}
          />
        </div>

        {/* Custom Activity Heatmap */}
        <div>
          <h5 style={{
            color: theme === 'dark' ? '#fff' : '#333',
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Activity Score Calendar (Custom Fields)
          </h5>
          <CalendarHeatmapChart
            data={activityData2023}
            dateField="date"
            valueField="activity_score"
            year={2023}
            height={180}
            theme={theme}
            title="Daily Activity Score - 2023"
            colorScale={['#f0f0f0', '#d6e685', '#8cc665', '#44a340', '#1e6823']}
            showValues
            cellSize={[18, 18]}
            valueFormat={(value: number) => `${value}%`}
            tooltip={{
              show: true,
              format: (params: any) => {
                const [date, score] = params.value;
                const formattedDate = new Date(date).toLocaleDateString();
                return `${formattedDate}<br/>Activity: ${score}%`;
              }
            }}
          />
        </div>

        {/* Temperature Heatmap with Blue Scale */}
        <div>
          <h5 style={{
            color: theme === 'dark' ? '#fff' : '#333',
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Temperature Calendar (Blue Scale)
          </h5>
          <CalendarHeatmapChart
            data={temperatureData2023}
            dateField="date"
            valueField="temp"
            year={2023}
            height={180}
            theme={theme}
            title="Daily Temperature - 2023"
            colorScale={['#08519c', '#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#eff3ff']}
            startOfWeek="monday"
            cellBorderColor={theme === 'dark' ? '#555' : '#ddd'}
            tooltip={{
              show: true,
              format: (params: any) => {
                const [date, temp] = params.value;
                const formattedDate = new Date(date).toLocaleDateString();
                return `${formattedDate}<br/>Temperature: ${temp}°C`;
              }
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
        {/* Multi-year Calendar */}
        <div>
          <h5 style={{
            color: theme === 'dark' ? '#fff' : '#333',
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Multi-year Calendar (2022-2023)
          </h5>
          <CalendarHeatmapChart
            data={multiYearCommitData}
            year={[2022, 2023]}
            height={450}
            theme={theme}
            title="Commit Activity - 2 Years"
            colorScale={['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']}
            cellSize={[16, 16]}
            tooltip={{
              show: true,
              format: (params: any) => {
                const [date, commits] = params.value;
                const formattedDate = new Date(date).toLocaleDateString();
                return `${formattedDate}<br/>${commits} commits`;
              }
            }}
          />
        </div>

        {/* Vertical Orientation Calendar */}
        <div>
          <h5 style={{
            color: theme === 'dark' ? '#fff' : '#333',
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Vertical Calendar Layout
          </h5>
          <CalendarHeatmapChart
            data={commitData2023}
            year={2023}
            height={700}
            width={400}
            theme={theme}
            title="Vertical Calendar"
            orient="vertical"
            colorScale={colorPalette.slice(0, 5)}
            cellSize={[14, 14]}
            showMonthLabel={true}
            tooltip={{
              show: true,
              format: (params: any) => {
                const [date, commits] = params.value;
                const formattedDate = new Date(date).toLocaleDateString();
                return `${formattedDate}<br/>${commits} commits`;
              }
            }}
          />
        </div>
      </div>
    </>
  );
}