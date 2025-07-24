import React from 'react';

interface OverviewProps {
  theme: 'light' | 'dark';
}

export const Overview: React.FC<OverviewProps> = ({ theme }) => {
  const containerStyle = {
    padding: '40px 20px',
    maxWidth: '800px',
    margin: '0 auto',
    color: theme === 'dark' ? '#fff' : '#333',
  };

  const cardStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: theme === 'dark'
      ? '0 4px 6px rgba(0, 0, 0, 0.3)'
      : '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme === 'dark' ? '#333' : '#e1e5e9'}`,
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{
          fontSize: '36px',
          margin: '0 0 20px 0',
          fontWeight: '700',
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}>
          🚀 AQC Chart Components
        </h1>
        
        <p style={{
          fontSize: '18px',
          lineHeight: 1.6,
          marginBottom: '30px',
          textAlign: 'center',
          color: theme === 'dark' ? '#ccc' : '#666'
        }}>
          Experience the new intuitive API for creating beautiful, interactive charts with minimal code.
          Simply pass your data and field mappings - no complex configuration objects required!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '40px'
        }}>
          {[
            { icon: '📈', title: 'Line Charts', desc: 'Time series and trend analysis' },
            { icon: '📊', title: 'Bar Charts', desc: 'Categorical data comparison' },
            { icon: '🥧', title: 'Pie Charts', desc: 'Part-to-whole relationships' },
            { icon: '🔹', title: 'Scatter Charts', desc: 'Correlation and distribution' },
            { icon: '🎯', title: 'Combined Charts', desc: 'Mixed visualizations' },
            { icon: '🔬', title: 'Cluster Charts', desc: 'Pattern recognition' },
            { icon: '📅', title: 'Calendar Heatmap', desc: 'Time-based patterns' },
            { icon: '🌊', title: 'Sankey Charts', desc: 'Flow visualization' },
            { icon: '📋', title: 'Gantt Charts', desc: 'Project timelines' },
            { icon: '📈', title: 'Regression Charts', desc: 'Statistical analysis' }
          ].map((chart, index) => (
            <div key={index} style={{
              padding: '20px',
              backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center',
              border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>{chart.icon}</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{chart.title}</h3>
              <p style={{ margin: 0, fontSize: '14px', color: theme === 'dark' ? '#aaa' : '#666' }}>
                {chart.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: theme === 'dark' ? '#2d5016' : '#d4edda',
          border: `1px solid ${theme === 'dark' ? '#4f7c2a' : '#c3e6cb'}`,
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{
            margin: 0,
            color: theme === 'dark' ? '#d1e7dd' : '#155724',
            fontSize: '16px'
          }}>
            📝 Use the navigation tabs above to explore each chart type with interactive examples!
          </p>
        </div>
      </div>
    </div>
  );
};