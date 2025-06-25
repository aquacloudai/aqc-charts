import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CalendarHeatmapChart } from '../CalendarHeatmapChart';

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
    time: {
      parse: vi.fn((date: string) => new Date(date).getTime()),
      format: vi.fn((time: number, _format: string) => {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
      }),
    },
  },
  writable: true,
});

describe('CalendarHeatmapChart', () => {
  const mockData = [
    { date: '2024-01-01', value: 10 },
    { date: '2024-01-02', value: 20 },
    { date: '2024-01-03', value: 15 },
    { date: '2024-01-04', value: 30 },
    { date: '2024-01-05', value: 25 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with minimal props', () => {
    render(
      <CalendarHeatmapChart
        data={mockData}
        year={2024}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <CalendarHeatmapChart
        data={mockData}
        year={2024}
        title="Test Calendar Heatmap"
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with custom visual map configuration', () => {
    render(
      <CalendarHeatmapChart
        data={mockData}
        year={2024}
        visualMap={{
          min: 0,
          max: 50,
          type: 'continuous',
          orient: 'vertical',
        }}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with custom calendar configuration', () => {
    render(
      <CalendarHeatmapChart
        data={mockData}
        year={2024}
        calendar={{
          cellSize: [20, 20],
          orient: 'vertical',
          dayLabel: {
            show: true,
            firstDay: 0,
          },
        }}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles custom tooltip formatter', () => {
    const customFormatter = vi.fn((params) => {
      const [date, value] = params.value;
      return `Custom: ${date} - ${value}`;
    });

    render(
      <CalendarHeatmapChart
        data={mockData}
        year={2024}
        tooltipFormatter={customFormatter}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles string year prop', () => {
    render(
      <CalendarHeatmapChart
        data={mockData}
        year="2024"
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles empty data array', () => {
    render(
      <CalendarHeatmapChart
        data={[]}
        year={2024}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('passes through BaseChart props', () => {
    render(
      <CalendarHeatmapChart
        data={mockData}
        year={2024}
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
});