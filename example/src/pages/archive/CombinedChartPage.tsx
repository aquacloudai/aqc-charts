import React from 'react';
import { ChartPage } from './ChartPage';
import { CombinedChartExample } from '../components/CombinedChartExample';

interface CombinedChartPageProps {
  theme: 'light' | 'dark';
  palette: string;
  setPalette: (palette: string) => void;
}

export const CombinedChartPage: React.FC<CombinedChartPageProps> = ({ theme, palette, setPalette }) => {
  return (
    <ChartPage
      title="Combined Chart Showcase"
      description="Demonstrate mixed line and bar visualizations: dual Y-axes, sales & temperature analysis, revenue & growth tracking, and production efficiency monitoring."
      icon="🎯"
      theme={theme}
      palette={palette}
      setPalette={setPalette}
    >
      <CombinedChartExample />
    </ChartPage>
  );
};