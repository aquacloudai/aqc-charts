import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ScatterChart } from '../ScatterChart';
import type { ScatterChartData } from '@/types';

// Mock the BaseChart component
vi.mock('../BaseChart', () => ({
    BaseChart: vi.fn(({ option, ...props }) => {
        // Create a copy of the option without functions for JSON serialization
        const serializableOption = {
            ...option,
            tooltip: option.tooltip ? {
                ...option.tooltip,
                formatter: option.tooltip.formatter ? 'function' : undefined
            } : undefined
        };
        
        return (
            <div 
                data-testid="base-chart" 
                data-option={JSON.stringify(serializableOption)}
                data-has-formatter={option.tooltip?.formatter ? 'true' : 'false'}
                {...props}
            >
                Mocked BaseChart
            </div>
        );
    })
}));

const mockScatterData: ScatterChartData = {
    series: [
        {
            name: 'Series 1',
            type: 'scatter',
            data: [
                { value: [10, 20] },
                { value: [15, 25] },
                { value: [20, 30] }
            ]
        },
        {
            name: 'Series 2',
            type: 'scatter',
            data: [
                { value: [12, 18] },
                { value: [18, 28] },
                { value: [25, 35] }
            ]
        }
    ],
    xAxis: {
        name: 'X Axis',
        type: 'value'
    },
    yAxis: {
        name: 'Y Axis',
        type: 'value'
    }
};

describe('ScatterChart', () => {
    it('renders correctly with basic data', () => {
        render(<ScatterChart data={mockScatterData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        expect(baseChart).toBeInTheDocument();
        expect(baseChart).toHaveTextContent('Mocked BaseChart');
    });

    it('passes correct option to BaseChart', () => {
        render(<ScatterChart data={mockScatterData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.xAxis).toEqual({
            type: 'value',
            scale: true,
            name: 'X Axis'
        });
        expect(option.yAxis).toEqual({
            type: 'value',
            scale: true,
            name: 'Y Axis'
        });
        expect(option.series).toHaveLength(2);
        expect(option.series[0].type).toBe('scatter');
        expect(option.series[1].type).toBe('scatter');
    });

    it('applies default symbol and symbolSize', () => {
        render(<ScatterChart data={mockScatterData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series[0].symbol).toBe('circle');
        expect(option.series[0].symbolSize).toBe(10);
    });

    it('applies custom symbol and symbolSize', () => {
        render(
            <ScatterChart 
                data={mockScatterData} 
                symbol="square" 
                symbolSize={15} 
            />
        );
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series[0].symbol).toBe('square');
        expect(option.series[0].symbolSize).toBe(15);
    });

    it('applies large data optimization settings', () => {
        render(
            <ScatterChart 
                data={mockScatterData} 
                large={true}
                largeThreshold={1500}
                progressive={300}
                progressiveThreshold={2500}
            />
        );
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series[0].large).toBe(true);
        expect(option.series[0].largeThreshold).toBe(1500);
        expect(option.series[0].progressive).toBe(300);
        expect(option.series[0].progressiveThreshold).toBe(2500);
    });

    it('includes tooltip configuration', () => {
        render(<ScatterChart data={mockScatterData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        const hasFormatter = baseChart.getAttribute('data-has-formatter');
        
        expect(option.tooltip).toBeDefined();
        expect(option.tooltip.trigger).toBe('item');
        expect(hasFormatter).toBe('true');
    });

    it('merges custom option correctly', () => {
        const customOption = {
            grid: { left: 50, right: 50 },
            animation: false
        };
        
        render(
            <ScatterChart 
                data={mockScatterData} 
                option={customOption}
            />
        );
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.grid).toEqual({ left: 50, right: 50 });
        expect(option.animation).toBe(false);
        // Should still have default scatter chart configuration
        expect(option.series).toHaveLength(2);
        expect(option.tooltip).toBeDefined();
    });

    it('adds title when provided', () => {
        render(<ScatterChart data={mockScatterData} title="Test Scatter Chart" />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.title).toEqual({
            text: 'Test Scatter Chart',
            left: 'center'
        });
    });

    it('handles custom series override', () => {
        const customSeries = [
            {
                name: 'Custom Series',
                type: 'scatter',
                data: [[5, 10], [15, 20]],
                symbolSize: 20,
                symbol: 'triangle'
            }
        ];
        
        render(
            <ScatterChart 
                data={mockScatterData} 
                series={customSeries}
            />
        );
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series).toEqual(customSeries);
    });

    it('handles empty or invalid data gracefully', () => {
        const emptyData: ScatterChartData = {
            series: []
        };
        
        render(<ScatterChart data={emptyData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series).toEqual([]);
    });
});