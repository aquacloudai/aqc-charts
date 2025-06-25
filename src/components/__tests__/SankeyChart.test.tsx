import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SankeyChart } from '../SankeyChart';

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

describe('SankeyChart', () => {
  const mockData = {
    nodes: [
      { name: 'a' },
      { name: 'b' },
      { name: 'a1' },
      { name: 'a2' },
      { name: 'b1' },
      { name: 'c' },
    ],
    links: [
      { source: 'a', target: 'a1', value: 5 },
      { source: 'a', target: 'a2', value: 3 },
      { source: 'b', target: 'b1', value: 8 },
      { source: 'a', target: 'b1', value: 3 },
      { source: 'b1', target: 'a1', value: 1 },
      { source: 'b1', target: 'c', value: 2 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with minimal props', () => {
    render(<SankeyChart data={mockData} />);

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<SankeyChart data={mockData} title="Test Sankey Chart" />);

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with custom layout', () => {
    render(<SankeyChart data={mockData} layout="circular" />);

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with custom orientation', () => {
    render(<SankeyChart data={mockData} orient="vertical" />);

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with custom node alignment', () => {
    render(<SankeyChart data={mockData} nodeAlign="left" />);

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with custom node configuration', () => {
    render(
      <SankeyChart
        data={mockData}
        nodeGap={16}
        nodeWidth={30}
        iterations={64}
      />
    );

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with enhanced node data', () => {
    const enhancedData = {
      nodes: [
        { name: 'a', value: 10, depth: 0 },
        { name: 'b', value: 15, depth: 0 },
        { name: 'c', value: 5, depth: 1 },
      ],
      links: [
        { source: 'a', target: 'c', value: 5 },
        { source: 'b', target: 'c', value: 10 },
      ],
    };

    render(<SankeyChart data={enhancedData} />);

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('renders with numeric source/target references', () => {
    const numericData = {
      nodes: [
        { name: 'Node 0' },
        { name: 'Node 1' },
        { name: 'Node 2' },
      ],
      links: [
        { source: 0, target: 1, value: 10 },
        { source: 1, target: 2, value: 15 },
      ],
    };

    render(<SankeyChart data={numericData} />);

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const emptyData = {
      nodes: [],
      links: [],
    };

    render(<SankeyChart data={emptyData} />);

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('handles invalid data structure', () => {
    const invalidData = {
      nodes: null,
      links: null,
    } as any;

    render(<SankeyChart data={invalidData} />);

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });

  it('passes through BaseChart props', () => {
    render(
      <SankeyChart
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

  it('merges custom option with generated option', () => {
    const customOption = {
      backgroundColor: '#f0f0f0',
      title: {
        text: 'Custom Title',
        textStyle: { color: 'red' },
      },
    };

    render(<SankeyChart data={mockData} option={customOption} />);

    expect(document.querySelector('.aqc-charts-container')).toBeInTheDocument();
  });
});