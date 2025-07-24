import React from 'react';
import { ChartPage } from './ChartPage';
import { RegressionChartExample } from '../components/RegressionChartExample';

interface RegressionChartPageProps {
  theme: 'light' | 'dark';
  palette: string;
  setPalette: (palette: string) => void;
}

export const RegressionChartPage: React.FC<RegressionChartPageProps> = ({ theme, palette, setPalette }) => {
  return (
    <ChartPage
      title="Regression Chart Showcase"
      description="Statistical analysis and trend visualization: linear, polynomial, exponential, and logarithmic regression with equation display, R-squared values, and interactive method comparison."
      icon="📈"
      theme={theme}
      palette={palette}
      setPalette={setPalette}
    >
      <RegressionChartExample />
    </ChartPage>
  );
};