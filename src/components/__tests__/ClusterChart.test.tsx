import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ClusterChart } from '../ClusterChart';
import type { ClusterChartData } from '@/types';

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

const mockClusterData: ClusterChartData = {
    data: [
        { value: [10, 20], name: 'Point 1' },
        { value: [15, 25], name: 'Point 2' },
        { value: [20, 30], name: 'Point 3' },
        { value: [25, 35], name: 'Point 4' },
        { value: [30, 40], name: 'Point 5' }
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

describe('ClusterChart', () => {
    it('renders correctly with basic data', () => {
        render(<ClusterChart data={mockClusterData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        expect(baseChart).toBeInTheDocument();
        expect(baseChart).toHaveTextContent('Mocked BaseChart');
    });

    it('passes correct option structure to BaseChart', () => {
        render(<ClusterChart data={mockClusterData} clusterCount={4} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.dataset).toHaveLength(2);
        expect(option.dataset[0].source).toHaveLength(5);
        expect(option.dataset[1].transform).toEqual({
            type: 'ecStat:clustering',
            config: {
                clusterCount: 4,
                outputType: 'single',
                outputClusterIndexDimension: 2
            }
        });
    });

    it('configures visual map correctly', () => {
        render(<ClusterChart data={mockClusterData} clusterCount={6} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.visualMap).toBeDefined();
        expect(option.visualMap.type).toBe('piecewise');
        expect(option.visualMap.max).toBe(6);
        expect(option.visualMap.pieces).toHaveLength(6);
        expect(option.visualMap.pieces[0]).toEqual({
            value: 0,
            label: 'cluster 0',
            color: '#37A2DA'
        });
    });

    it('configures axes correctly', () => {
        render(<ClusterChart data={mockClusterData} />);
        
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
    });

    it('configures series correctly', () => {
        render(<ClusterChart data={mockClusterData} symbolSize={20} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series.type).toBe('scatter');
        expect(option.series.symbolSize).toBe(20);
        expect(option.series.datasetIndex).toBe(1);
        expect(option.series.encode).toEqual({
            tooltip: [0, 1],
            x: 0,
            y: 1
        });
    });

    it('applies custom colors', () => {
        const customColors = ['#red', '#green', '#blue'];
        render(<ClusterChart data={mockClusterData} colors={customColors} clusterCount={3} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.visualMap.pieces[0].color).toBe('#red');
        expect(option.visualMap.pieces[1].color).toBe('#green');
        expect(option.visualMap.pieces[2].color).toBe('#blue');
    });

    it('configures visual map position', () => {
        render(<ClusterChart data={mockClusterData} visualMapPosition="right" />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.visualMap.right).toBe(10);
        expect(option.visualMap.left).toBe('right');
        expect(option.visualMap.top).toBe('middle');
    });

    it('configures grid layout', () => {
        render(<ClusterChart data={mockClusterData} gridLeft={150} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.grid.left).toBe(150);
    });

    it('applies custom item style', () => {
        const customItemStyle = { borderColor: '#ff0000', borderWidth: 2 };
        render(<ClusterChart data={mockClusterData} itemStyle={customItemStyle} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series.itemStyle).toEqual(customItemStyle);
    });

    it('includes tooltip configuration', () => {
        render(<ClusterChart data={mockClusterData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        const hasFormatter = baseChart.getAttribute('data-has-formatter');
        
        expect(option.tooltip).toBeDefined();
        expect(option.tooltip.position).toBe('top');
        expect(hasFormatter).toBe('true');
    });

    it('adds title when provided', () => {
        render(<ClusterChart data={mockClusterData} title="Test Cluster Chart" />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.title).toEqual({
            text: 'Test Cluster Chart',
            left: 'center'
        });
    });

    it('merges custom option correctly', () => {
        const customOption = {
            animation: false,
            backgroundColor: '#f0f0f0'
        };
        
        render(<ClusterChart data={mockClusterData} option={customOption} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.animation).toBe(false);
        expect(option.backgroundColor).toBe('#f0f0f0');
        // Should still have cluster chart configuration
        expect(option.dataset).toHaveLength(2);
        expect(option.visualMap).toBeDefined();
    });

    it('handles empty or invalid data gracefully', () => {
        const emptyData: ClusterChartData = {
            data: []
        };
        
        render(<ClusterChart data={emptyData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        // With empty data, it should still create the series structure but with empty dataset
        expect(option.dataset[0].source).toEqual([]);
        expect(option.series.type).toBe('scatter');
    });

    it('handles missing data property gracefully', () => {
        const invalidData = {} as ClusterChartData;
        
        render(<ClusterChart data={invalidData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series).toEqual([]);
    });
});