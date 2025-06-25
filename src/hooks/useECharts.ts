import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { EChartsInstance, ChartTheme } from '@/types';
import { EChartsLoader } from '@/utils/EChartsLoader';

interface UseEChartsOptions {
    readonly renderer?: 'canvas' | 'svg';
    readonly locale?: string;
    readonly [key: string]: unknown;
}

interface UseEChartsReturn {
    readonly chart: EChartsInstance | null;
    readonly loading: boolean;
    readonly error: string | null;
    readonly resize: () => void;
    readonly refresh: () => void;
}

export const useECharts = (
    containerRef: React.RefObject<HTMLDivElement>,
    option: unknown,
    theme: string | ChartTheme = 'light',
    opts: UseEChartsOptions = {},
    notMerge = false,
    lazyUpdate = true,
): UseEChartsReturn => {
    const [chart, setChart] = useState<EChartsInstance | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const echartsLoader = useMemo(() => EChartsLoader.getInstance(), []);
    const chartRef = useRef<EChartsInstance | null>(null);

    // Initialize chart
    const initChart = useCallback(async () => {
        if (!containerRef.current) return;

        try {
            setLoading(true);
            setError(null);

            const echarts = await echartsLoader.load();

            // Dispose existing chart
            if (chartRef.current) {
                chartRef.current.dispose();
            }

            // Create new chart instance
            const newChart = echarts.init(
                containerRef.current,
                typeof theme === 'string' ? theme : undefined,
                {
                    renderer: opts.renderer ?? 'canvas',
                    locale: opts.locale ?? 'en',
                    ...opts,
                },
            ) as EChartsInstance;

            // Apply custom theme if provided
            if (typeof theme === 'object') {
                newChart.setOption({
                    backgroundColor: theme.backgroundColor,
                    textStyle: theme.textStyle,
                    color: theme.color,
                    ...option,
                }, true);
            }

            chartRef.current = newChart;
            setChart(newChart);
            setLoading(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to initialize chart';
            setError(errorMessage);
            setLoading(false);
        }
    }, [containerRef, theme, opts, echartsLoader, option]);

    // Update chart option
    const updateChart = useCallback(() => {
        if (chartRef.current && option) {
            try {
                chartRef.current.setOption(option, notMerge, lazyUpdate);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to update chart';
                setError(errorMessage);
            }
        }
    }, [option, notMerge, lazyUpdate]);

    // Resize chart
    const resizeChart = useCallback(() => {
        if (chartRef.current) {
            try {
                chartRef.current.resize();
            } catch (err) {
                console.warn('Chart resize failed:', err);
            }
        }
    }, []);

    // Initialize chart on mount
    useEffect(() => {
        initChart();

        return () => {
            if (chartRef.current) {
                chartRef.current.dispose();
                chartRef.current = null;
            }
        };
    }, [initChart]);

    // Update chart when option changes
    useEffect(() => {
        updateChart();
    }, [updateChart]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            resizeChart();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [resizeChart]);

    return {
        chart,
        loading,
        error,
        resize: resizeChart,
        refresh: initChart,
    };
};
