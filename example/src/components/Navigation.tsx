import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface NavigationProps {
  theme: 'light' | 'dark' | 'auto';
}

const chartTypes = [
  { path: '/', label: 'Overview', icon: '🏠' },
  { path: '/bar', label: 'Bar', icon: '📊' },
  { path: '/line', label: 'Line', icon: '📈' },
  { path: '/pie', label: 'Pie', icon: '🥧' },
  { path: '/scatter', label: 'Scatter', icon: '⚬' },
  { path: '/stacked-area', label: 'Area', icon: '📉' },
  { path: '/combined', label: 'Combined', icon: '📊' },
  { path: '/sankey', label: 'Sankey', icon: '🔀' },
  { path: '/calendar', label: 'Calendar', icon: '📅' },
  { path: '/cluster', label: 'Cluster', icon: '🎯' },
  { path: '/regression', label: 'Regression', icon: '📐' },
  { path: '/gantt', label: 'Gantt', icon: '📋' },
  { path: '/geo', label: 'Geo', icon: '🗺️' },
];

export const Navigation: React.FC<NavigationProps> = ({ theme }) => {
  const location = useLocation();
  // ECharts 6: Resolve 'auto' theme to system preference for UI styling
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <nav style={{
      backgroundColor: resolvedTheme === 'dark' ? '#1f1f1f' : '#ffffff',
      borderBottom: `2px solid ${resolvedTheme === 'dark' ? '#333' : '#e1e5e9'}`,
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: resolvedTheme === 'dark'
        ? '0 2px 4px rgba(0,0,0,0.3)'
        : '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease', // Smooth transition for theme changes
    }}>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '4px',
        paddingBottom: '2px'
      }}>
        {chartTypes.map(({ path, label, icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                textDecoration: 'none',
                borderRadius: '8px 8px 0 0',
                fontSize: '14px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                backgroundColor: isActive
                  ? (resolvedTheme === 'dark' ? '#333' : '#f8f9fa')
                  : 'transparent',
                color: isActive
                  ? (resolvedTheme === 'dark' ? '#fff' : '#333')
                  : (resolvedTheme === 'dark' ? '#ccc' : '#666'),
                borderBottom: isActive
                  ? `2px solid ${resolvedTheme === 'dark' ? '#667eea' : '#667eea'}`
                  : '2px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};