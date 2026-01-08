import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSystemTheme } from '@aquacloud_ai/aqc-charts';
import { Navigation } from './components/Navigation';
import { Overview } from './pages/Overview';
import { BarChartPage } from './pages/BarChartPage';
import { LineChartPage } from './pages/LineChartPage';
import { PieChartPage } from './pages/PieChartPage';
import { ScatterChartPage } from './pages/ScatterChartPage';
import { StackedAreaChartPage } from './pages/StackedAreaChartPage';
import { CombinedChartPage } from './pages/CombinedChartPage';
import { SankeyChartPage } from './pages/SankeyChartPage';
import { CalendarHeatmapPage } from './pages/CalendarHeatmapPage';
import { ClusterChartPage } from './pages/ClusterChartPage';
import { RegressionChartPage } from './pages/RegressionChartPage';
import { GanttChartPage } from './pages/GanttChartPage';
import { GeoChartPage } from './pages/GeoChartPage';

function App() {
  const [themeSelection, setThemeSelection] = useState<'light' | 'dark' | 'auto'>('auto');

  // ECharts 6: Use system theme hook for auto mode
  const systemTheme = useSystemTheme();

  // Resolve the effective theme for UI styling
  const effectiveTheme = useMemo(() => {
    return themeSelection === 'auto' ? systemTheme : themeSelection;
  }, [themeSelection, systemTheme]);

  // Pass the theme selection to charts (they handle 'auto' internally)
  const theme = themeSelection;

  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        backgroundColor: effectiveTheme === 'dark' ? '#0f0f0f' : '#f5f7fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transition: 'background-color 0.3s ease', // Smooth transition for theme changes
      }}>
        {/* Theme Toggle - ECharts 6 Dynamic Theme Switching */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 200,
          backgroundColor: effectiveTheme === 'dark' ? '#1f1f1f' : '#ffffff',
          padding: '10px 14px',
          borderRadius: '8px',
          border: `1px solid ${effectiveTheme === 'dark' ? '#333' : '#ddd'}`,
          boxShadow: effectiveTheme === 'dark'
            ? '0 2px 4px rgba(0,0,0,0.3)'
            : '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
        }}>
          <label style={{
            marginRight: '10px',
            fontWeight: 'bold',
            color: effectiveTheme === 'dark' ? '#fff' : '#333',
            fontSize: '14px'
          }}>
            Theme:
          </label>
          <select
            value={themeSelection}
            onChange={(e) => setThemeSelection(e.target.value as 'light' | 'dark' | 'auto')}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: effectiveTheme === 'dark' ? '#333' : '#fff',
              color: effectiveTheme === 'dark' ? '#fff' : '#333',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="auto">Auto (System)</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          {themeSelection === 'auto' && (
            <span style={{
              marginLeft: '8px',
              fontSize: '12px',
              color: effectiveTheme === 'dark' ? '#888' : '#666',
            }}>
              ({systemTheme})
            </span>
          )}
        </div>

        <Navigation theme={theme} />

        <Routes>
          <Route path="/" element={<Overview theme={theme} />} />
          <Route path="/bar" element={<BarChartPage theme={theme} />} />
          <Route path="/line" element={<LineChartPage theme={theme} />} />
          <Route path="/pie" element={<PieChartPage theme={theme} />} />
          <Route path="/scatter" element={<ScatterChartPage theme={theme} />} />
          <Route path="/stacked-area" element={<StackedAreaChartPage theme={theme} />} />
          <Route path="/combined" element={<CombinedChartPage theme={theme} />} />
          <Route path="/sankey" element={<SankeyChartPage theme={theme} />} />
          <Route path="/calendar" element={<CalendarHeatmapPage theme={theme} />} />
          <Route path="/cluster" element={<ClusterChartPage theme={theme} />} />
          <Route path="/regression" element={<RegressionChartPage theme={theme} />} />
          <Route path="/gantt" element={<GanttChartPage theme={theme} />} />
          <Route path="/geo" element={<GeoChartPage theme={theme} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
