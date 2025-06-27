import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import ecStat from 'echarts-stat';
import type { EChartsInstance, ChartTheme } from '@/types';

// Register ecStat transforms globally
if (typeof window !== 'undefined') {
    try {
        // Cast to any to bypass incomplete TypeScript definitions
        const ecStatTransforms = (ecStat as any).transform;
        
        if (ecStatTransforms) {
            if (ecStatTransforms.regression) {
                echarts.registerTransform(ecStatTransforms.regression);
                console.log('✓ Registered ecStat regression transform');
            }
            if (ecStatTransforms.clustering) {
                echarts.registerTransform(ecStatTransforms.clustering);
                console.log('✓ Registered ecStat clustering transform');
            }
            if (ecStatTransforms.histogram) {
                echarts.registerTransform(ecStatTransforms.histogram);
                console.log('✓ Registered ecStat histogram transform');
            }
        } else {
            console.warn('ecStat.transform not found');
        }
    } catch (err) {
        console.warn('Failed to register ecStat transforms:', err);
    }
}

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
    containerRef: React.RefObject<HTMLDivElement | null>,
    option: unknown,
    theme: string | ChartTheme = 'light',
    opts: UseEChartsOptions = {},
    notMerge = false,
    lazyUpdate = true,
): UseEChartsReturn => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const chartRef = useRef<EChartsInstance | null>(null);

    // Initialize chart
    useEffect(() => {
        if (!containerRef.current) return;

        try {
            setLoading(true);
            setError(null);

            // Dispose existing chart if any (for React StrictMode)
            if (containerRef.current) {
                // Use echarts.dispose() to properly clean up any existing chart on this DOM element
                echarts.dispose(containerRef.current);
            }
            if (chartRef.current) {
                chartRef.current = null;
            }

            // Create new chart instance
            const chartInstance = echarts.init(
                containerRef.current,
                typeof theme === 'string' ? theme : undefined,
                {
                    renderer: opts.renderer ?? 'canvas',
                    locale: opts.locale ?? 'en',
                    ...opts,
                }
            ) as EChartsInstance;

            chartRef.current = chartInstance;
            setLoading(false);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to initialize chart';
            setError(errorMessage);
            setLoading(false);
        }

        // Cleanup function
        return () => {
            if (containerRef.current) {
                // Use echarts.dispose() for proper cleanup
                echarts.dispose(containerRef.current);
            }
            chartRef.current = null;
        };
    }, []); // Only run once per mount

    // Update chart option when option changes
    useEffect(() => {
        if (!chartRef.current || !option || loading) return;

        // Defer setOption to avoid calling during main process
        const timeoutId = setTimeout(() => {
            if (!chartRef.current) return;
            
            try {
                // Apply custom theme if provided
                if (typeof theme === 'object') {
                    const themedOption = {
                        backgroundColor: theme.backgroundColor,
                        textStyle: theme.textStyle,
                        color: theme.color,
                        ...(option as object),
                    };
                    chartRef.current.setOption(themedOption, notMerge, lazyUpdate);
                } else {
                    chartRef.current.setOption(option, notMerge, lazyUpdate);
                }
                
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to update chart';
                setError(errorMessage);
            }
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [option, theme, notMerge, lazyUpdate, loading]);

    // Resize handler
    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                try {
                    chartRef.current.resize();
                } catch (err) {
                    console.warn('Chart resize failed:', err);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const resize = () => {
        if (chartRef.current) {
            try {
                chartRef.current.resize();
            } catch (err) {
                console.warn('Chart resize failed:', err);
            }
        }
    };

    const refresh = () => {
        if (chartRef.current && option) {
            try {
                chartRef.current.setOption(option, true, false);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to refresh chart';
                setError(errorMessage);
            }
        }
    };

    return {
        chart: chartRef.current,
        loading,
        error,
        resize,
        refresh,
    };
};