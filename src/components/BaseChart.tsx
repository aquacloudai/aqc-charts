import { forwardRef, useEffect, useImperativeHandle, useMemo, useCallback } from 'react';
import type { BaseChartProps, ChartRef } from '@/types';
import { useECharts } from '@/hooks/useECharts';
import { validateDimensions, validateTheme, assertValidation } from '@/utils/validation';
import { isChartError } from '@/utils/errors';
import { addLogoToOption, removeLogoFromOption } from '@/utils/logo';

export const BaseChart = forwardRef<ChartRef, BaseChartProps>(({
    title,
    width = '100%',
    height = 400,
    theme = 'light',
    loading: externalLoading = false,
    notMerge = false,
    lazyUpdate = true,
    logo,
    onChartReady,
    onClick,
    onDoubleClick,
    onMouseOver,
    onMouseOut,
    onDataZoom,
    onBrush,
    className = '',
    style = {},
    option,
    renderer: _renderer = 'canvas',
    locale: _locale = 'en',
    ...restProps
}, ref) => {

    // Validate props in development mode
    useMemo(() => {
        if (process.env.NODE_ENV === 'development') {
            try {
                // Validate basic props
                const dimensionResult = validateDimensions(width, height);
                if (dimensionResult.warnings.length > 0) {
                    console.warn('AQC Charts BaseChart validation warnings:', dimensionResult.warnings);
                }
                assertValidation(dimensionResult, { component: 'BaseChart', width, height });

                const themeResult = validateTheme(theme);
                if (themeResult.warnings.length > 0) {
                    console.warn('AQC Charts BaseChart theme warnings:', themeResult.warnings);
                }
                assertValidation(themeResult, { component: 'BaseChart', theme });

                // Validate chart option
                if (option && typeof option === 'object') {
                  const optionKeys = Object.keys(option as any);
                  if (optionKeys.length === 0) {
                    console.warn('AQC Charts: Empty chart option provided');
                  }
                }
            } catch (error) {
                console.error('AQC Charts BaseChart validation failed:', error);
            }
        }
    }, [width, height, theme, option]);

    // Process chart option with title and logo
    const chartOption = useMemo(() => {
        let processedOption = option;

        // Add title if provided as string prop
        if (title && typeof title === 'string') {
            processedOption = {
                ...processedOption,
                title: {
                    ...processedOption.title,
                    text: title,
                    left: 'center',
                },
            };
        }

        // Add logo if provided and not onSaveOnly
        if (logo && !logo.onSaveOnly) {
            const chartWidth = typeof width === 'number' ? width : 600; // Default fallback
            const chartHeight = typeof height === 'number' ? height : 400; // Default fallback
            processedOption = addLogoToOption(processedOption, logo, chartWidth, chartHeight);
        }

        return processedOption;
    }, [option, title, logo, width, height]);

    const { 
        containerRef: echartsContainerRefFromHook,
        loading: chartLoading, 
        error, 
        refresh,
        getEChartsInstance,
        clear,
        resize: resizeChart,
        showLoading: showChartLoading,
        hideLoading: hideChartLoading,
        dispose
    } = useECharts({
        option: chartOption,
        theme,
        notMerge,
        lazyUpdate,
        onChartReady,
    });

    // Get chart instance
    const chart = getEChartsInstance();

    // Setup event listeners
    useEffect(() => {
        if (!chart) return;

        const eventHandlers: Array<[string, (...args: unknown[]) => void]> = [];

        if (onClick) {
            const handler = (params: unknown) => {
                onClick(params, chart);
            };
            chart.on('click', handler);
            eventHandlers.push(['click', handler]);
        }

        if (onDoubleClick) {
            const handler = (params: unknown) => {
                onDoubleClick(params, chart);
            };
            chart.on('dblclick', handler);
            eventHandlers.push(['dblclick', handler]);
        }

        if (onMouseOver) {
            const handler = (params: unknown) => {
                onMouseOver(params, chart);
            };
            chart.on('mouseover', handler);
            eventHandlers.push(['mouseover', handler]);
        }

        if (onMouseOut) {
            const handler = (params: unknown) => {
                onMouseOut(params, chart);
            };
            chart.on('mouseout', handler);
            eventHandlers.push(['mouseout', handler]);
        }

        if (onDataZoom) {
            const handler = (params: unknown) => {
                onDataZoom(params, chart);
            };
            chart.on('datazoom', handler);
            eventHandlers.push(['datazoom', handler]);
        }

        if (onBrush) {
            const handler = (params: unknown) => {
                onBrush(params, chart);
            };
            chart.on('brush', handler);
            eventHandlers.push(['brush', handler]);
        }

        // Call onChartReady
        onChartReady?.(chart);

        return () => {
            for (const [event, handler] of eventHandlers) {
                chart.off(event, handler);
            }
        };
    }, [chart, onClick, onDoubleClick, onMouseOver, onMouseOut, onDataZoom, onBrush, onChartReady]);

    // Handle loading state
    useEffect(() => {
        if (chart) {
            if (externalLoading) {
                chart.showLoading();
            } else {
                chart.hideLoading();
            }
        }
    }, [chart, externalLoading]);

    // Export functions with logo support
    const exportImage = useCallback((opts?: { type?: 'png' | 'jpeg' | 'svg'; pixelRatio?: number; backgroundColor?: string; excludeComponents?: string[] }) => {
        const chartInstance = getEChartsInstance();
        if (!chartInstance) return '';

        // If logo should only appear on save, temporarily add it
        if (logo?.onSaveOnly) {
            const currentOption = chartInstance.getOption();
            const chartWidth = typeof width === 'number' ? width : 600;
            const chartHeight = typeof height === 'number' ? height : 400;
            const optionWithLogo = addLogoToOption(currentOption, logo, chartWidth, chartHeight);
            
            chartInstance.setOption(optionWithLogo, { notMerge: false, lazyUpdate: false });
            
            const dataURL = chartInstance.getDataURL({
                type: opts?.type || 'png',
                pixelRatio: opts?.pixelRatio || 1,
                backgroundColor: opts?.backgroundColor || '#fff',
                ...(opts?.excludeComponents && { excludeComponents: opts.excludeComponents }),
            });
            
            // Remove logo after export
            const optionWithoutLogo = removeLogoFromOption(currentOption);
            chartInstance.setOption(optionWithoutLogo, { notMerge: false, lazyUpdate: false });
            
            return dataURL;
        }

        // Normal export without temporary logo
        return chartInstance.getDataURL({
            type: opts?.type || 'png',
            pixelRatio: opts?.pixelRatio || 1,
            backgroundColor: opts?.backgroundColor || '#fff',
            ...(opts?.excludeComponents && { excludeComponents: opts.excludeComponents }),
        });
    }, [getEChartsInstance, logo, width, height]);

    const saveAsImage = useCallback((filename?: string, opts?: { type?: 'png' | 'jpeg' | 'svg'; pixelRatio?: number; backgroundColor?: string; excludeComponents?: string[] }) => {
        const dataURL = exportImage(opts);
        if (!dataURL) return;

        // Create download link
        const link = document.createElement('a');
        link.download = filename || `chart.${opts?.type || 'png'}`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [exportImage]);

    // Expose chart instance through ref
    useImperativeHandle(ref, () => ({
        getEChartsInstance,
        refresh,
        clear,
        resize: resizeChart,
        showLoading: showChartLoading,
        hideLoading: hideChartLoading,
        dispose,
        exportImage,
        saveAsImage,
    }), [getEChartsInstance, refresh, clear, resizeChart, showChartLoading, hideChartLoading, dispose, exportImage, saveAsImage]);

    const containerStyle = useMemo(() => ({
        width,
        height,
        position: 'relative' as const,
        ...style,
    }), [width, height, style]);

    if (error) {
        const errorMessage = isChartError(error) ? error.toUserMessage() : (error?.message || 'Unknown error');
        const isRecoverable = isChartError(error) && error.recoverable;
        
        return (
            <div
                className={`aqc-charts-error ${className}`}
                style={containerStyle}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#ff4d4f',
                    fontSize: '14px',
                    padding: '20px',
                    textAlign: 'center',
                }}>
                    <div style={{ marginBottom: '8px', fontSize: '16px' }}>
                        {isRecoverable ? '⚠️' : '❌'}
                    </div>
                    <div style={{ marginBottom: isRecoverable ? '12px' : '0' }}>
                        {errorMessage}
                    </div>
                    {isRecoverable && (
                        <div style={{ 
                            fontSize: '12px', 
                            color: '#ff7875',
                            fontStyle: 'italic'
                        }}>
                            This error is recoverable. Try refreshing the component.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`aqc-charts-container ${className}`}
            style={containerStyle}
            {...restProps}
        >
            {/* Separate div exclusively for ECharts - React never renders children here */}
            <div
                ref={echartsContainerRefFromHook}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
            
            {/* React-managed overlay content */}
            {(chartLoading || externalLoading) && (
                <div className="aqc-charts-loading" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 1000,
                }}>
                    <div className="aqc-charts-spinner" style={{
                        width: '32px',
                        height: '32px',
                        border: '3px solid #f3f3f3',
                        borderTop: '3px solid #1890ff',
                        borderRadius: '50%',
                        animation: 'aqc-charts-spin 1s linear infinite',
                    }} />
                </div>
            )}
        </div>
    );
});

BaseChart.displayName = 'BaseChart';