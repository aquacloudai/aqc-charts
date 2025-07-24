import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Overview } from './pages/Overview';
import { LineChartPage } from './pages/LineChartPage';
import { BarChartPage } from './pages/BarChartPage';
import { PieChartPage } from './pages/PieChartPage';
import { ScatterChartPage } from './pages/ScatterChartPage';
import { CombinedChartPage } from './pages/CombinedChartPage';
import { ClusterChartPage } from './pages/ClusterChartPage';
import { CalendarChartPage } from './pages/CalendarChartPage';
import { SankeyChartPage } from './pages/SankeyChartPage';
import { GanttChartPage } from './pages/GanttChartPage';
import { RegressionChartPage } from './pages/RegressionChartPage';

// Theme selector component
const ThemeSelector = ({
  theme,
  setTheme
}: {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}) => (
  <div style={{
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 200,
    backgroundColor: theme === 'dark' ? '#1f1f1f' : '#ffffff',
    padding: '10px',
    borderRadius: '8px',
    border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
    boxShadow: theme === 'dark' 
      ? '0 2px 4px rgba(0,0,0,0.3)' 
      : '0 2px 4px rgba(0,0,0,0.1)',
  }}>
    <label style={{
      marginRight: '10px',
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#333',
      fontSize: '14px'
    }}>
      Theme:
    </label>
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
      style={{
        padding: '5px 10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#333',
        fontSize: '14px'
      }}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </div>
);

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [palette, setPalette] = useState('default');

  const appStyle = {
    minHeight: '100vh',
    backgroundColor: theme === 'dark' ? '#0f0f0f' : '#f5f7fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  return (
    <Router>
      <div style={appStyle}>
        <ThemeSelector theme={theme} setTheme={setTheme} />
        <Navigation theme={theme} />
        
        <Routes>
          <Route path="/" element={<Overview theme={theme} />} />
          <Route 
            path="/line" 
            element={
              <LineChartPage 
                theme={theme} 
                palette={palette} 
                setPalette={setPalette} 
              />
            } 
          />
          <Route 
            path="/bar" 
            element={
              <BarChartPage 
                theme={theme} 
                palette={palette} 
                setPalette={setPalette} 
              />
            } 
          />
          <Route 
            path="/pie" 
            element={
              <PieChartPage 
                theme={theme} 
                palette={palette} 
                setPalette={setPalette} 
              />
            } 
          />
          <Route 
            path="/scatter" 
            element={
              <ScatterChartPage 
                theme={theme} 
                palette={palette} 
                setPalette={setPalette} 
              />
            } 
          />
          <Route 
            path="/combined" 
            element={
              <CombinedChartPage 
                theme={theme} 
                palette={palette} 
                setPalette={setPalette} 
              />
            } 
          />
          <Route 
            path="/cluster" 
            element={
              <ClusterChartPage 
                theme={theme} 
                palette={palette} 
                setPalette={setPalette} 
              />
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <CalendarChartPage 
                theme={theme} 
                palette={palette} 
                setPalette={setPalette} 
              />
            } 
          />
          <Route 
            path="/sankey" 
            element={
              <SankeyChartPage 
                theme={theme} 
                palette={palette} 
                setPalette={setPalette} 
              />
            } 
          />
          <Route 
            path="/gantt" 
            element={
              <GanttChartPage 
                theme={theme} 
                palette={palette} 
                setPalette={setPalette} 
              />
            } 
          />
          <Route 
            path="/regression" 
            element={
              <RegressionChartPage 
                theme={theme} 
                palette={palette} 
                setPalette={setPalette} 
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;