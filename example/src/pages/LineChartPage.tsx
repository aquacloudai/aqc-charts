import { useState } from 'react';
import { useResolvedTheme } from '@aquacloud_ai/aqc-charts';
import { LineChartExample } from '../components/LineChartExample';

interface LineChartPageProps {
  theme: 'light' | 'dark' | 'auto';
}

export function LineChartPage({ theme }: LineChartPageProps) {
  const [interaction, setInteraction] = useState<string>('');
  // ECharts 6: Resolve 'auto' theme for UI styling
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: '28px',
          color: resolvedTheme === 'dark' ? '#fff' : '#333'
        }}>
          Line Chart
        </h1>
        <p style={{
          margin: 0,
          color: resolvedTheme === 'dark' ? '#aaa' : '#666'
        }}>
          Visualize trends and changes over time
        </p>
      </header>

      {interaction && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '24px',
          backgroundColor: resolvedTheme === 'dark' ? '#1a3a1a' : '#d4edda',
          borderRadius: '6px',
          color: resolvedTheme === 'dark' ? '#90ee90' : '#155724',
          fontFamily: 'monospace'
        }}>
          {interaction}
        </div>
      )}

      {/* Pass theme directly - charts handle 'auto' internally via ECharts 6 setTheme */}
      <LineChartExample theme={theme} onInteraction={setInteraction} />
    </div>
  );
}
