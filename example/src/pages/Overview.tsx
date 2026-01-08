import { Link } from 'react-router-dom';
import { useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface OverviewProps {
  theme: 'light' | 'dark' | 'auto';
}

const chartTypes = [
  {
    name: 'Bar Chart',
    path: '/bar',
    icon: '📊',
    description: 'Display categorical data with rectangular bars'
  },
  {
    name: 'Line Chart',
    path: '/line',
    icon: '📈',
    description: 'Visualize trends and changes over time'
  },
  {
    name: 'Pie Chart',
    path: '/pie',
    icon: '🥧',
    description: 'Display proportional data and part-to-whole relationships'
  },
  {
    name: 'Scatter Chart',
    path: '/scatter',
    icon: '⚬',
    description: 'Visualize correlations and distributions between variables'
  },
  {
    name: 'Stacked Area',
    path: '/stacked-area',
    icon: '📉',
    description: 'Show cumulative totals and composition over time'
  },
  {
    name: 'Combined Chart',
    path: '/combined',
    icon: '📊',
    description: 'Mix bar and line series with dual axis support'
  },
  {
    name: 'Sankey Chart',
    path: '/sankey',
    icon: '🔀',
    description: 'Visualize flow and relationships between nodes'
  },
  {
    name: 'Calendar Heatmap',
    path: '/calendar',
    icon: '📅',
    description: 'GitHub-style contribution graphs for activity data'
  },
  {
    name: 'Cluster Chart',
    path: '/cluster',
    icon: '🎯',
    description: 'K-means clustering for data segmentation analysis'
  },
  {
    name: 'Regression Chart',
    path: '/regression',
    icon: '📐',
    description: 'Statistical regression with trend lines and equations'
  },
  {
    name: 'Gantt Chart',
    path: '/gantt',
    icon: '📋',
    description: 'Project timelines with tasks and progress tracking'
  },
  {
    name: 'Geo Chart',
    path: '/geo',
    icon: '🗺️',
    description: 'Geographic maps with regional data visualization'
  },
];

export function Overview({ theme }: OverviewProps) {
  // ECharts 6: Resolve 'auto' theme for UI styling
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{
          margin: '0 0 12px 0',
          fontSize: '36px',
          color: resolvedTheme === 'dark' ? '#fff' : '#333'
        }}>
          AQC Charts
        </h1>
        <p style={{
          margin: 0,
          fontSize: '18px',
          color: resolvedTheme === 'dark' ? '#aaa' : '#666'
        }}>
          Modern React charting library built on ECharts 6
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {chartTypes.map((chart) => (
          <Link
            key={chart.path}
            to={chart.path}
            style={{
              display: 'block',
              padding: '24px',
              backgroundColor: resolvedTheme === 'dark' ? '#1a1a1a' : '#fff',
              borderRadius: '12px',
              border: `1px solid ${resolvedTheme === 'dark' ? '#333' : '#e1e5e9'}`,
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = resolvedTheme === 'dark'
                ? '0 8px 24px rgba(0,0,0,0.4)'
                : '0 8px 24px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {chart.icon}
            </div>
            <h2 style={{
              margin: '0 0 8px 0',
              fontSize: '20px',
              color: resolvedTheme === 'dark' ? '#fff' : '#333'
            }}>
              {chart.name}
            </h2>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: resolvedTheme === 'dark' ? '#aaa' : '#666'
            }}>
              {chart.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
