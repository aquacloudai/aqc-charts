import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CombinedChart } from '../CombinedChart';
import type { CombinedChartProps } from '@/types';

const mockData = [
  { month: 'Jan', sales: 100, temperature: 15 },
  { month: 'Feb', sales: 120, temperature: 18 },
  { month: 'Mar', sales: 110, temperature: 22 },
  { month: 'Apr', sales: 90, temperature: 28 },
  { month: 'May', sales: 140, temperature: 32 },
];

const defaultProps: CombinedChartProps = {
  data: mockData,
  xField: 'month',
  series: [
    { field: 'sales', type: 'bar', name: 'Sales' },
    { field: 'temperature', type: 'line', name: 'Temperature' }
  ],
};

describe('CombinedChart', () => {
  it('renders without error', () => {
    render(<CombinedChart {...defaultProps} />);
    const container = document.querySelector('.aqc-charts-container');
    expect(container).toBeInTheDocument();
  });

  it('renders with custom dimensions', () => {
    render(
      <CombinedChart 
        {...defaultProps} 
        width={500} 
        height={300} 
      />
    );
    
    const container = document.querySelector('.aqc-charts-container');
    expect(container).toHaveStyle({ width: '500px', height: '300px' });
  });

  it('handles dual y-axes configuration', () => {
    const propsWithDualAxes: CombinedChartProps = {
      ...defaultProps,
      series: [
        { field: 'sales', type: 'bar', name: 'Sales', yAxisIndex: 0 },
        { field: 'temperature', type: 'line', name: 'Temperature', yAxisIndex: 1 }
      ],
      yAxis: [
        { name: 'Sales (units)', position: 'left' },
        { name: 'Temperature (°C)', position: 'right' }
      ]
    };

    render(<CombinedChart {...propsWithDualAxes} />);
    const container = document.querySelector('.aqc-charts-container');
    expect(container).toBeInTheDocument();
  });

  it('handles line styling options', () => {
    const propsWithLineStyling: CombinedChartProps = {
      ...defaultProps,
      series: [
        { field: 'sales', type: 'bar', name: 'Sales' },
        { 
          field: 'temperature', 
          type: 'line', 
          name: 'Temperature',
          smooth: true,
          strokeWidth: 3,
          strokeStyle: 'dashed',
          showPoints: true,
          pointSize: 6,
          showArea: true,
          areaOpacity: 0.5
        }
      ]
    };

    render(<CombinedChart {...propsWithLineStyling} />);
    const container = document.querySelector('.aqc-charts-container');
    expect(container).toBeInTheDocument();
  });

  it('handles bar styling options', () => {
    const propsWithBarStyling: CombinedChartProps = {
      ...defaultProps,
      series: [
        { 
          field: 'sales', 
          type: 'bar', 
          name: 'Sales',
          barWidth: '60%',
          showLabels: true
        },
        { field: 'temperature', type: 'line', name: 'Temperature' }
      ]
    };

    render(<CombinedChart {...propsWithBarStyling} />);
    const container = document.querySelector('.aqc-charts-container');
    expect(container).toBeInTheDocument();
  });

  it('handles stacked bars with lines', () => {
    const stackedData = [
      { month: 'Jan', sales: 100, profit: 20, temperature: 15 },
      { month: 'Feb', sales: 120, profit: 25, temperature: 18 },
      { month: 'Mar', sales: 110, profit: 22, temperature: 22 },
    ];

    const propsWithStacking: CombinedChartProps = {
      data: stackedData,
      xField: 'month',
      series: [
        { field: 'sales', type: 'bar', name: 'Sales', stack: 'total' },
        { field: 'profit', type: 'bar', name: 'Profit', stack: 'total' },
        { field: 'temperature', type: 'line', name: 'Temperature' }
      ]
    };

    render(<CombinedChart {...propsWithStacking} />);
    const container = document.querySelector('.aqc-charts-container');
    expect(container).toBeInTheDocument();
  });

  it('renders with title and subtitle', () => {
    render(
      <CombinedChart 
        {...defaultProps} 
        title="Sales and Temperature Analysis"
        subtitle="Monthly data comparison"
      />
    );
    const container = document.querySelector('.aqc-charts-container');
    expect(container).toBeInTheDocument();
  });

  it('handles loading state', () => {
    render(<CombinedChart {...defaultProps} loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles event callbacks', () => {
    const onDataPointClick = vi.fn();
    const onDataPointHover = vi.fn();
    const onChartReady = vi.fn();

    render(
      <CombinedChart 
        {...defaultProps}
        onDataPointClick={onDataPointClick}
        onDataPointHover={onDataPointHover}
        onChartReady={onChartReady}
      />
    );

    const container = document.querySelector('.aqc-charts-container');
    expect(container).toBeInTheDocument();
  });

  it('handles zoom and pan features', () => {
    render(
      <CombinedChart 
        {...defaultProps} 
        zoom 
        pan 
        brush
      />
    );
    const container = document.querySelector('.aqc-charts-container');
    expect(container).toBeInTheDocument();
  });

  it('handles custom colors', () => {
    const propsWithColors: CombinedChartProps = {
      ...defaultProps,
      series: [
        { field: 'sales', type: 'bar', name: 'Sales', color: '#1890ff' },
        { field: 'temperature', type: 'line', name: 'Temperature', color: '#ff4d4f' }
      ],
      colorPalette: ['#1890ff', '#ff4d4f', '#52c41a']
    };

    render(<CombinedChart {...propsWithColors} />);
    const container = document.querySelector('.aqc-charts-container');
    expect(container).toBeInTheDocument();
  });

  it('handles custom axis configuration', () => {
    const propsWithCustomAxes: CombinedChartProps = {
      ...defaultProps,
      xAxis: {
        name: 'Month',
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: [
        {
          name: 'Sales (K)',
          nameLocation: 'middle',
          nameGap: 50,
          min: 0,
          max: 200
        }
      ]
    };

    render(<CombinedChart {...propsWithCustomAxes} />);
    const container = document.querySelector('.aqc-charts-container');
    expect(container).toBeInTheDocument();
  });

  it('handles theme variations', () => {
    render(<CombinedChart {...defaultProps} theme="dark" />);
    const container = document.querySelector('.aqc-charts-container');
    expect(container).toBeInTheDocument();
  });

  it('handles animation settings', () => {
    render(
      <CombinedChart 
        {...defaultProps} 
        animate={false}
        animationDuration={1000}
      />
    );
    const container = document.querySelector('.aqc-charts-container');
    expect(container).toBeInTheDocument();
  });
});