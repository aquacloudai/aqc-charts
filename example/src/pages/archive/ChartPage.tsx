import React, { useState } from 'react';

interface ChartPageProps {
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
  theme: 'light' | 'dark';
  palette: string;
  setPalette: (palette: string) => void;
}

// Theme selector component
const ThemeSelector = ({
  palette,
  setPalette,
  theme
}: {
  palette: string;
  setPalette: (palette: string) => void;
  theme: 'light' | 'dark';
}) => (
  <div style={{
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: theme === 'dark' ? '#1f1f1f' : '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '20px',
    border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`
  }}>
    <div>
      <label style={{
        marginRight: '10px',
        fontWeight: 'bold',
        color: theme === 'dark' ? '#fff' : '#333'
      }}>
        Color Palette:
      </label>
      <select
        value={palette}
        onChange={(e) => setPalette(e.target.value)}
        style={{
          padding: '5px 10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          color: theme === 'dark' ? '#fff' : '#333'
        }}
      >
        <option value="default">Default</option>
        <option value="vibrant">Vibrant</option>
        <option value="pastel">Pastel</option>
        <option value="business">Business</option>
        <option value="earth">Earth</option>
      </select>
    </div>
  </div>
);

export const ChartPage: React.FC<ChartPageProps> = ({
  title,
  description,
  icon,
  children,
  theme,
  palette,
  setPalette
}) => {
  const [interactionData, setInteractionData] = useState<string>('');

  const containerStyle = {
    padding: '20px',
    color: theme === 'dark' ? '#fff' : '#333',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '30px',
    padding: '30px 0',
    borderBottom: `2px solid ${theme === 'dark' ? '#333' : '#e1e5e9'}`,
  };

  const cardStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: theme === 'dark'
      ? '0 4px 6px rgba(0, 0, 0, 0.3)'
      : '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme === 'dark' ? '#333' : '#e1e5e9'}`,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{
          fontSize: '28px',
          margin: '0 0 10px 0',
          fontWeight: '700',
          color: theme === 'dark' ? '#fff' : '#333',
        }}>
          {icon} {title}
        </h1>
        <p style={{
          fontSize: '16px',
          margin: 0,
          color: theme === 'dark' ? '#ccc' : '#666',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.6
        }}>
          {description}
        </p>
      </div>

      {/* Theme Controls */}
      <ThemeSelector
        theme={theme}
        palette={palette}
        setPalette={setPalette}
      />

      {/* Interaction Feedback */}
      {interactionData && (
        <div style={{
          padding: '15px',
          backgroundColor: theme === 'dark' ? '#2d5016' : '#d4edda',
          border: `1px solid ${theme === 'dark' ? '#4f7c2a' : '#c3e6cb'}`,
          borderRadius: '8px',
          marginBottom: '20px',
          fontFamily: 'monospace',
          fontSize: '14px',
          color: theme === 'dark' ? '#d1e7dd' : '#155724',
        }}>
          <strong>Chart Interaction:</strong> {interactionData}
        </div>
      )}

      {/* Chart Content */}
      <div style={cardStyle}>
        {React.cloneElement(children as React.ReactElement, {
          onInteraction: (data: string) => setInteractionData(data)
        })}
      </div>
    </div>
  );
};