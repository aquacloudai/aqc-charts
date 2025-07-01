import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GanttChart } from '../GanttChart';
import type { GanttChartProps } from '../GanttChart';

// Mock ECharts
vi.mock('@/utils/EChartsLoader', () => ({
    EChartsLoader: {
        getInstance: () => ({
            load: vi.fn().mockResolvedValue({
                init: vi.fn().mockReturnValue({
                    setOption: vi.fn(),
                    getOption: vi.fn(),
                    resize: vi.fn(),
                    dispose: vi.fn(),
                    on: vi.fn(),
                    off: vi.fn(),
                    showLoading: vi.fn(),
                    hideLoading: vi.fn(),
                }),
                dispose: vi.fn(),
            }),
        }),
    },
}));

const mockData: GanttChartProps['data'] = {
    tasks: [
        {
            id: 'task1',
            name: 'Flight 001',
            category: 'Gate A1',
            startTime: new Date('2024-01-01T10:00:00'),
            endTime: new Date('2024-01-01T12:00:00'),
            color: '#5470c6'
        },
        {
            id: 'task2',
            name: 'Flight 002',
            category: 'Gate A2',
            startTime: new Date('2024-01-01T11:00:00'),
            endTime: new Date('2024-01-01T13:30:00'),
            color: '#91cc75',
            vip: true
        },
        {
            id: 'task3',
            name: 'Flight 003',
            category: 'Gate A1',
            startTime: new Date('2024-01-01T14:00:00'),
            endTime: new Date('2024-01-01T16:00:00'),
            color: '#fac858'
        }
    ],
    categories: [
        { name: 'Gate A1', label: 'Terminal A Gate 1' },
        { name: 'Gate A2', label: 'Terminal A Gate 2' },
        { name: 'Gate B1', label: 'Terminal B Gate 1' }
    ]
};

describe('GanttChart', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('renders without crashing', () => {
        const { container } = render(<GanttChart data={mockData} />);
        const chartContainer = container.querySelector('.aqc-charts-container');
        expect(chartContainer).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <GanttChart data={mockData} className="custom-gantt" />
        );
        const chartContainer = container.querySelector('.aqc-charts-container');
        expect(chartContainer).toHaveClass('aqc-charts-container', 'custom-gantt');
    });

    it('shows loading spinner when loading prop is true', () => {
        const { container } = render(<GanttChart data={mockData} loading={true} />);
        const loadingElement = container.querySelector('.aqc-charts-loading');
        const spinner = container.querySelector('.aqc-charts-spinner');
        expect(loadingElement).toBeInTheDocument();
        expect(spinner).toBeInTheDocument();
    });

    it('handles empty data gracefully', () => {
        const emptyData = { tasks: [], categories: [] };
        const { container } = render(<GanttChart data={emptyData} />);
        const chartContainer = container.querySelector('.aqc-charts-container');
        expect(chartContainer).toBeInTheDocument();
    });

    it('applies custom height and width', () => {
        const { container } = render(
            <GanttChart 
                data={mockData} 
                width={800} 
                height={600}
                style={{ border: '1px solid red' }}
            />
        );
        const chartContainer = container.querySelector('.aqc-charts-container') as HTMLElement;
        expect(chartContainer).toBeInTheDocument();
        expect(chartContainer.style.border).toBe('1px solid red');
    });

    it('handles data zoom configuration', () => {
        const { container } = render(
            <GanttChart 
                data={mockData} 
                showDataZoom={false}
            />
        );
        const chartContainer = container.querySelector('.aqc-charts-container');
        expect(chartContainer).toBeInTheDocument();
    });

    it('handles draggable configuration', () => {
        const mockOnTaskDrag = vi.fn();
        const { container } = render(
            <GanttChart 
                data={mockData} 
                draggable={true}
                onTaskDrag={mockOnTaskDrag}
            />
        );
        const chartContainer = container.querySelector('.aqc-charts-container');
        expect(chartContainer).toBeInTheDocument();
    });

    it('handles custom grid configuration', () => {
        const customGrid = {
            left: 120,
            right: 30,
            top: 80,
            bottom: 50,
            backgroundColor: '#f5f5f5'
        };
        
        const { container } = render(
            <GanttChart 
                data={mockData} 
                grid={customGrid}
            />
        );
        const chartContainer = container.querySelector('.aqc-charts-container');
        expect(chartContainer).toBeInTheDocument();
    });

    it('handles different height ratios', () => {
        const { container } = render(
            <GanttChart 
                data={mockData} 
                heightRatio={0.8}
            />
        );
        const chartContainer = container.querySelector('.aqc-charts-container');
        expect(chartContainer).toBeInTheDocument();
    });
});