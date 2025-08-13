import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StackedAreaChart } from '../StackedAreaChart';
import type { AreaChartProps } from '@/types';

const mockData = [
  { month: 'Jan', sales: 100, marketing: 20, development: 50 },
  { month: 'Feb', sales: 120, marketing: 25, development: 60 },
  { month: 'Mar', sales: 110, marketing: 22, development: 55 },
  { month: 'Apr', sales: 90, marketing: 18, development: 45 },
  { month: 'May', sales: 140, marketing: 28, development: 70 },
];

const defaultProps: AreaChartProps = {
  data: mockData,
  xField: 'month',
  yField: ['sales', 'marketing', 'development'],
  stacked: true,
};

describe('StackedAreaChart', () => {
  it('renders without error', () => {
    const { container } = render(<StackedAreaChart {...defaultProps} />);
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with custom dimensions', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps} 
        width={500} 
        height={300} 
      />
    );
    
    const chartContainer = container.querySelector('.aqc-charts-container');
    expect(chartContainer).toHaveStyle({ width: '500px', height: '300px' });
  });

  it('handles stacked area configuration', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps} 
        stacked={true}
        stackType="normal"
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles percentage stacking', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps} 
        stacked={true}
        stackType="percent"
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles non-stacked area chart', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps} 
        stacked={false}
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles series data format', () => {
    const seriesProps: AreaChartProps = {
      data: mockData,
      xField: 'month',
      yField: 'value',
      series: [
        {
          name: 'Sales',
          data: mockData.map(d => ({ month: d.month, value: d.sales })),
          color: '#1890ff'
        },
        {
          name: 'Marketing',
          data: mockData.map(d => ({ month: d.month, value: d.marketing })),
          color: '#52c41a'
        }
      ],
      stacked: true
    };

    const { container } = render(<StackedAreaChart {...seriesProps} />);
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles grouped data by series field', () => {
    const groupedData = [
      { month: 'Jan', category: 'Sales', value: 100 },
      { month: 'Jan', category: 'Marketing', value: 20 },
      { month: 'Feb', category: 'Sales', value: 120 },
      { month: 'Feb', category: 'Marketing', value: 25 },
    ];

    const groupedProps: AreaChartProps = {
      data: groupedData,
      xField: 'month',
      yField: 'value',
      seriesField: 'category',
      stacked: true
    };

    const { container } = render(<StackedAreaChart {...groupedProps} />);
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles area styling options', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps} 
        opacity={0.5}
        areaGradient={true}
        smooth={true}
        strokeWidth={3}
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles line styling options', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps}
        strokeStyle="dashed"
        showPoints={true}
        pointSize={6}
        pointShape="square"
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles series-specific configuration', () => {
    const seriesConfigProps: AreaChartProps = {
      ...defaultProps,
      seriesConfig: {
        sales: { color: '#1890ff', smooth: true },
        marketing: { color: '#52c41a', strokeStyle: 'dashed' },
        development: { color: '#ff4d4f', showPoints: true }
      }
    };

    const { container } = render(<StackedAreaChart {...seriesConfigProps} />);
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles axis configuration', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps}
        xAxis={{
          name: 'Month',
          nameLocation: 'middle',
          nameGap: 30
        }}
        yAxis={{
          name: 'Value',
          nameLocation: 'middle',
          nameGap: 50,
          min: 0
        }}
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles dual y-axes', () => {
    const dualAxisProps: AreaChartProps = {
      data: mockData,
      xField: 'month',
      series: [
        {
          name: 'Sales',
          data: mockData.map(d => ({ month: d.month, value: d.sales })),
          yAxisIndex: 0
        },
        {
          name: 'Marketing',
          data: mockData.map(d => ({ month: d.month, value: d.marketing })),
          yAxisIndex: 1
        }
      ],
      yAxis: [
        { name: 'Sales', position: 'left' },
        { name: 'Marketing', position: 'right' }
      ],
      stacked: false
    };

    const { container } = render(<StackedAreaChart {...dualAxisProps} />);
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with title and subtitle', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps} 
        title="Department Performance Analysis"
        subtitle="Monthly stacked area view"
        titlePosition="left"
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    render(<StackedAreaChart {...defaultProps} loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles event callbacks', () => {
    const onDataPointClick = vi.fn();
    const onDataPointHover = vi.fn();
    const onChartReady = vi.fn();

    const { container } = render(
      <StackedAreaChart 
        {...defaultProps}
        onDataPointClick={onDataPointClick}
        onDataPointHover={onDataPointHover}
        onChartReady={onChartReady}
      />
    );

    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles zoom and pan features', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps} 
        zoom 
        pan 
        brush
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles custom colors and theme', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps}
        theme="dark"
        colorPalette={['#1890ff', '#52c41a', '#ff4d4f']}
        backgroundColor="#1f1f1f"
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles legend configuration', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps}
        legend={{
          show: true,
          position: 'bottom',
          align: 'center'
        }}
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles tooltip configuration', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps}
        tooltip={{
          show: true,
          trigger: 'axis',
          formatter: '{b}: {c}'
        }}
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles animation settings', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps} 
        animate={false}
        animationDuration={1000}
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles logo configuration', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps}
        logo={{
          src: 'logo.png',
          position: 'bottom-right',
          width: 100,
          height: 50,
          opacity: 0.8
        }}
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles custom option override', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps}
        customOption={{
          grid: { left: 100, right: 100 },
          backgroundColor: '#f5f5f5'
        }}
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles array data format', () => {
    const arrayData: [string, number][] = [
      ['Jan', 100],
      ['Feb', 120],
      ['Mar', 110],
    ];

    const { container } = render(
      <StackedAreaChart 
        data={arrayData}
        stacked={false}
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const { container } = render(
      <StackedAreaChart 
        data={[]}
        xField="month"
        yField="value"
        stacked={true}
      />
    );
    expect(container.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles className and style props', () => {
    const { container } = render(
      <StackedAreaChart 
        {...defaultProps}
        className="custom-chart"
        style={{ border: '1px solid red' }}
      />
    );
    
    const chartContainer = container.querySelector('.aqc-charts-container');
    expect(chartContainer).toHaveClass('aqc-charts-container', 'custom-chart');
    expect(chartContainer).toHaveStyle({ border: '1px solid red' });
  });
});