import { CalendarHeatmapChart, useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface CalendarHeatmapExampleProps {
  theme: 'light' | 'dark' | 'auto';
  onInteraction?: (data: string) => void;
}

// Generate sample activity data for 2024
function generateActivityData(year: number) {
  const data: Array<{ date: string; value: number }> = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // Generate random activity with some patterns
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseValue = isWeekend ? 2 : 8;
    const value = Math.floor(Math.random() * baseValue) + (isWeekend ? 0 : 2);

    data.push({
      date: d.toISOString().split('T')[0],
      value,
    });
  }
  return data;
}

// Generate commit-style data
function generateCommitData(year: number) {
  const data: Array<{ date: string; commits: number }> = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    // More commits on weekdays, occasional weekend work
    const maxCommits = isWeekend ? 5 : 15;
    const commits = Math.random() > 0.3 ? Math.floor(Math.random() * maxCommits) : 0;

    data.push({
      date: d.toISOString().split('T')[0],
      commits,
    });
  }
  return data;
}

const activityData2024 = generateActivityData(2024);
const commitData2024 = generateCommitData(2024);

export function CalendarHeatmapExample({ theme, onInteraction }: CalendarHeatmapExampleProps) {
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* GitHub-style Contribution Graph */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          GitHub-style Contributions
        </h3>
        <CalendarHeatmapChart
          data={activityData2024}
          year={2024}
          title="Activity Overview"
          theme={theme}
          height={200}
          colorScale={['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']}
          onDataPointClick={(params) => {
            const data = params.data as [string, number];
            onInteraction?.(`${data[0]}: ${data[1]} contributions`);
          }}
        />
      </section>

      {/* Commit Activity */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Commit Activity (Custom Fields)
        </h3>
        <CalendarHeatmapChart
          data={commitData2024}
          dateField="date"
          valueField="commits"
          year={2024}
          title="Code Commits"
          theme={theme}
          height={200}
          colorScale={['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']}
        />
      </section>

      {/* Blue Color Scheme */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Blue Theme Calendar
        </h3>
        <CalendarHeatmapChart
          data={activityData2024}
          year={2024}
          title="Daily Metrics"
          theme={theme}
          height={200}
          colorScale={['#f0f9ff', '#bae6fd', '#7dd3fc', '#38bdf8', '#0284c7']}
        />
      </section>
    </div>
  );
}
