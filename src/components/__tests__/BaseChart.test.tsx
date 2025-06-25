import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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
    it('renders without crashing', () => {
        render(<BaseChart />);
        expect(screen.getByRole('generic')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<BaseChart className="custom-chart" />);
        expect(screen.getByRole('generic')).toHaveClass('aqc-charts-container custom-chart');
    });

    it('shows loading state when loading prop is true', () => {
        render(<BaseChart loading={true} />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
});