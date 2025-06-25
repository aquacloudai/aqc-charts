import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StackedBarChart } from '../StackedBarChart';

// Mock ECharts
const mockChart = {
  setOption: vi.fn(),
  resize: vi.fn(),
  dispose: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  showLoading: vi.fn(),
  hideLoading: vi.fn(),
  getDataURL: vi.fn(),
  getConnectedDataURL: vi.fn(),
  getOption: vi.fn(),
  dispatchAction: vi.fn(),
};

Object.defineProperty(global.window, 'echarts', {
  value: {
    init: vi.fn(() => mockChart),
    dispose: vi.fn(),
  },
  writable: true,
});

describe('StackedBarChart', () => {
  const mockData = {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    series: [
      {
        name: 'Direct',
        data: [100, 200, 300, 400, 500],
        color: '#5470c6',
      },
      {
        name: 'Indirect',
        data: [50, 100, 150, 200, 250],
        color: '#91cc75',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with minimal props', () => {
    render(
      <StackedBarChart data={mockData} />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <StackedBarChart
        data={mockData}
        title="Test Stacked Bar Chart"
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders in horizontal mode', () => {
    render(
      <StackedBarChart
        data={mockData}
        horizontal={true}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with percentage mode', () => {
    render(
      <StackedBarChart
        data={mockData}
        showPercentage={true}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with values shown', () => {
    render(
      <StackedBarChart
        data={mockData}
        showValues={true}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with both percentage and values shown', () => {
    render(
      <StackedBarChart
        data={mockData}
        showPercentage={true}
        showValues={true}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with custom bar width', () => {
    render(
      <StackedBarChart
        data={mockData}
        barWidth="80%"
        barMaxWidth={100}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with custom stack name', () => {
    render(
      <StackedBarChart
        data={mockData}
        stackName="custom-stack"
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with custom grid configuration', () => {
    render(
      <StackedBarChart
        data={mockData}
        grid={{
          left: 50,
          right: 50,
          top: 100,
          bottom: 100,
        }}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with legend not selectable', () => {
    render(
      <StackedBarChart
        data={mockData}
        legendSelectable={false}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles empty series data', () => {
    const emptyData = {
      categories: ['Mon', 'Tue', 'Wed'],
      series: [],
    };

    render(
      <StackedBarChart data={emptyData} />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles empty categories', () => {
    const emptyCategories = {
      categories: [],
      series: [
        {
          name: 'Test',
          data: [],
        },
      ],
    };

    render(
      <StackedBarChart data={emptyCategories} />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles series with zero values', () => {
    const zeroData = {
      categories: ['A', 'B', 'C'],
      series: [
        {
          name: 'Series 1',
          data: [0, 0, 0],
        },
        {
          name: 'Series 2',
          data: [0, 0, 0],
        },
      ],
    };

    render(
      <StackedBarChart
        data={zeroData}
        showPercentage={true}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('passes through BaseChart props', () => {
    render(
      <StackedBarChart
        data={mockData}
        width="100%"
        height={400}
        className="custom-class"
        style={{ border: '1px solid red' }}
      />
    );

    const container = document.querySelector('.aqc-charts-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('aqc-charts-container');
    expect(container).toHaveClass('custom-class');
  });

  it('handles complex object title', () => {
    render(
      <StackedBarChart
        data={mockData}
        title={{
          text: 'Main Title',
          subtext: 'Subtitle',
          left: 'left',
        }}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles horizontal percentage mode', () => {
    render(
      <StackedBarChart
        data={mockData}
        horizontal={true}
        showPercentage={true}
        showValues={true}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });
});