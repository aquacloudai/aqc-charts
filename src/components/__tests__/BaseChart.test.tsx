import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BaseChart } from '../BaseChart';

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

describe('BaseChart', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('renders without crashing', () => {
        const { container } = render(<BaseChart />);
        const chartContainer = container.querySelector('.aqc-charts-container');
        expect(chartContainer).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<BaseChart className="custom-chart" />);
        const chartContainer = container.querySelector('.aqc-charts-container');
        expect(chartContainer).toHaveClass('aqc-charts-container', 'custom-chart');
    });

    it('shows loading spinner when loading prop is true', () => {
        const { container } = render(<BaseChart loading={true} />);
        const loadingElement = container.querySelector('.aqc-charts-loading');
        const spinner = container.querySelector('.aqc-charts-spinner');
        expect(loadingElement).toBeInTheDocument();
        expect(spinner).toBeInTheDocument();
    });
});