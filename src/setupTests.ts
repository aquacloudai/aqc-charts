import '@testing-library/jest-dom';

// Mock ECharts for testing
global.window = global.window || {};
(global.window as any).echarts = {
    init: vi.fn(() => ({
        setOption: vi.fn(),
        getOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        showLoading: vi.fn(),
        hideLoading: vi.fn()
    })),
    dispose: vi.fn()
};