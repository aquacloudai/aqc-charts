import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RegressionChart } from '../RegressionChart';
import type { RegressionChartData } from '@/types';

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

const mockRegressionData: RegressionChartData = {
    data: [
        { value: [1, 2], name: 'Point 1' },
        { value: [2, 4], name: 'Point 2' },
        { value: [3, 6], name: 'Point 3' },
        { value: [4, 8], name: 'Point 4' },
        { value: [5, 10], name: 'Point 5' }
    ],
    xAxis: {
        name: 'X Values',
        type: 'value'
    },
    yAxis: {
        name: 'Y Values',
        type: 'value'
    }
};

describe('RegressionChart', () => {
    it('renders correctly with basic data', () => {
        render(<RegressionChart data={mockRegressionData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        expect(baseChart).toBeInTheDocument();
        expect(baseChart).toHaveTextContent('Mocked BaseChart');
    });

    it('passes correct option structure to BaseChart', () => {
        render(<RegressionChart data={mockRegressionData} method="linear" />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.dataset).toHaveLength(2);
        expect(option.dataset[0].source).toHaveLength(5);
        expect(option.dataset[1].transform).toEqual({
            type: 'ecStat:regression',
            config: {
                method: 'linear',
                formulaOn: 'end'
            }
        });
    });

    it('configures axes correctly', () => {
        render(<RegressionChart data={mockRegressionData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.xAxis).toEqual({
            type: 'value',
            scale: true,
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            name: 'X Values'
        });
        expect(option.yAxis).toEqual({
            type: 'value',
            scale: true,
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            name: 'Y Values'
        });
    });

    it('configures series correctly', () => {
        render(<RegressionChart data={mockRegressionData} symbolSize={10} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series).toHaveLength(2);
        
        // Scatter series
        expect(option.series[0]).toEqual({
            name: 'scatter',
            type: 'scatter',
            itemStyle: {
                color: '#5470c6'
            },
            symbolSize: 10
        });

        // Regression line series
        expect(option.series[1].name).toBe('regression');
        expect(option.series[1].type).toBe('line');
        expect(option.series[1].datasetIndex).toBe(1);
        expect(option.series[1].symbolSize).toBe(0.1);
    });

    it('applies custom colors', () => {
        render(
            <RegressionChart 
                data={mockRegressionData} 
                scatterColor="#ff0000" 
                lineColor="#00ff00"
            />
        );
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series[0].itemStyle.color).toBe('#ff0000');
        expect(option.series[1].itemStyle.color).toBe('#00ff00');
        expect(option.series[1].lineStyle.color).toBe('#00ff00');
    });

    it('configures regression method', () => {
        render(<RegressionChart data={mockRegressionData} method="polynomial" />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.dataset[1].transform.config.method).toBe('polynomial');
    });

    it('configures formula display', () => {
        render(
            <RegressionChart 
                data={mockRegressionData} 
                showFormula={true} 
                formulaFontSize={18}
                formulaPosition={{ dx: -30, dy: 10 }}
            />
        );
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series[1].label).toEqual({
            show: true,
            fontSize: 18
        });
        expect(option.series[1].labelLayout).toEqual({
            dx: -30,
            dy: 10
        });
    });

    it('hides formula when showFormula is false', () => {
        render(<RegressionChart data={mockRegressionData} showFormula={false} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series[1].label).toBeUndefined();
        expect(option.series[1].labelLayout).toBeUndefined();
    });

    it('configures split line style', () => {
        render(<RegressionChart data={mockRegressionData} splitLineStyle="dotted" />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.xAxis.splitLine.lineStyle.type).toBe('dotted');
        expect(option.yAxis.splitLine.lineStyle.type).toBe('dotted');
    });

    it('configures legend position', () => {
        render(<RegressionChart data={mockRegressionData} legendPosition="top" />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.legend.top).toBe(5);
    });

    it('configures tooltip correctly', () => {
        render(<RegressionChart data={mockRegressionData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.tooltip).toEqual({
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        });
    });

    it('adds title with subtitle when provided', () => {
        render(<RegressionChart data={mockRegressionData} title="Test Regression" method="linear" />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.title).toEqual({
            text: 'Test Regression',
            subtext: 'By ecStat.regression (linear)',
            sublink: 'https://github.com/ecomfe/echarts-stat',
            left: 'center'
        });
    });

    it('applies custom series names', () => {
        render(
            <RegressionChart 
                data={mockRegressionData} 
                scatterName="Data Points"
                lineName="Best Fit Line"
            />
        );
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series[0].name).toBe('Data Points');
        expect(option.series[1].name).toBe('Best Fit Line');
    });

    it('merges custom option correctly', () => {
        const customOption = {
            animation: false,
            backgroundColor: '#f0f0f0'
        };
        
        render(<RegressionChart data={mockRegressionData} option={customOption} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.animation).toBe(false);
        expect(option.backgroundColor).toBe('#f0f0f0');
        // Should still have regression chart configuration
        expect(option.dataset).toHaveLength(2);
        expect(option.series).toHaveLength(2);
    });

    it('handles empty or invalid data gracefully', () => {
        const emptyData: RegressionChartData = {
            data: []
        };
        
        render(<RegressionChart data={emptyData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        // With empty data, it should still create the series structure but with empty dataset
        expect(option.dataset[0].source).toEqual([]);
        expect(option.series).toHaveLength(2);
        expect(option.series[0].type).toBe('scatter');
        expect(option.series[1].type).toBe('line');
    });

    it('handles missing data property gracefully', () => {
        const invalidData = {} as RegressionChartData;
        
        render(<RegressionChart data={invalidData} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.series).toEqual([]);
    });

    it('configures formulaOn parameter correctly', () => {
        render(<RegressionChart data={mockRegressionData} formulaOn="start" />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.dataset[1].transform.config.formulaOn).toBe('start');
    });

    it('handles formulaOn false correctly', () => {
        render(<RegressionChart data={mockRegressionData} formulaOn={false} />);
        
        const baseChart = screen.getByTestId('base-chart');
        const option = JSON.parse(baseChart.getAttribute('data-option') || '{}');
        
        expect(option.dataset[1].transform.config.formulaOn).toBeUndefined();
    });
});