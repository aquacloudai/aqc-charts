import React from 'react';
import { ChartPage } from './ChartPage';
import { ScatterChartExample } from '../components/ScatterChartExample';

interface ScatterChartPageProps {
  theme: 'light' | 'dark';
  palette: string;
  setPalette: (palette: string) => void;
}

const colorPalettes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
  pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFD9BA', '#E6E6FA', '#D3FFD3', '#FFCCFF'],
  business: ['#2E4057', '#048A81', '#54C6EB', '#F8B500', '#B83A4B', '#5C7A89', '#A8E6CF', '#FFB6B3'],
  earth: ['#8B4513', '#228B22', '#4682B4', '#DAA520', '#CD853F', '#32CD32', '#6495ED', '#FF8C00'],
};

export const ScatterChartPage: React.FC<ScatterChartPageProps> = ({ theme, palette, setPalette }) => {
  return (
    <ChartPage
      title="Scatter Chart Showcase"
      description="Demonstrate scatter plot visualizations: basic scatter plots, multiple series, bubble charts with size dimensions, and correlation analysis with trend lines."
      icon="🔹"
      theme={theme}
      palette={palette}
      setPalette={setPalette}
    >
      <ScatterChartExample
        theme={theme}
        colorPalette={colorPalettes[palette as keyof typeof colorPalettes]}
      />
    </ChartPage>
  );
};