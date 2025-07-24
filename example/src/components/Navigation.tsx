import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  theme: 'light' | 'dark';
}

const chartTypes = [
  { path: '/', label: 'Overview', icon: '🏠' },
  { path: '/line', label: 'Line Charts', icon: '📈' },
  { path: '/bar', label: 'Bar Charts', icon: '📊' },
  { path: '/pie', label: 'Pie Charts', icon: '🥧' },
  { path: '/scatter', label: 'Scatter Charts', icon: '🔹' },
  { path: '/combined', label: 'Combined Charts', icon: '🎯' },
  { path: '/cluster', label: 'Cluster Charts', icon: '🔬' },
  { path: '/calendar', label: 'Calendar Heatmap', icon: '📅' },
  { path: '/sankey', label: 'Sankey Charts', icon: '🌊' },
  { path: '/gantt', label: 'Gantt Charts', icon: '📋' },
  { path: '/regression', label: 'Regression Charts', icon: '📈' }
];

export const Navigation: React.FC<NavigationProps> = ({ theme }) => {
  const location = useLocation();

  return (
    <nav style={{
      backgroundColor: theme === 'dark' ? '#1f1f1f' : '#ffffff',
      borderBottom: `2px solid ${theme === 'dark' ? '#333' : '#e1e5e9'}`,
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: theme === 'dark' 
        ? '0 2px 4px rgba(0,0,0,0.3)' 
        : '0 2px 4px rgba(0,0,0,0.1)'
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
                  ? (theme === 'dark' ? '#333' : '#f8f9fa')
                  : 'transparent',
                color: isActive
                  ? (theme === 'dark' ? '#fff' : '#333')
                  : (theme === 'dark' ? '#ccc' : '#666'),
                borderBottom: isActive 
                  ? `2px solid ${theme === 'dark' ? '#667eea' : '#667eea'}`
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