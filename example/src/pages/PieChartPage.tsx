import { useState } from 'react';
import { useResolvedTheme } from '@aquacloud_ai/aqc-charts';
import { PieChartExample } from '../components/PieChartExample';

interface PieChartPageProps {
  theme: 'light' | 'dark' | 'auto';
}

export function PieChartPage({ theme }: PieChartPageProps) {
  const [interaction, setInteraction] = useState<string>('');
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: '28px',
          color: resolvedTheme === 'dark' ? '#fff' : '#333'
        }}>
          Pie Chart
        </h1>
        <p style={{
          margin: 0,
          color: resolvedTheme === 'dark' ? '#aaa' : '#666'
        }}>
          Display proportional data and part-to-whole relationships
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

      <PieChartExample theme={theme} onInteraction={setInteraction} />
    </div>
  );
}
