import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import type { BaseChartProps, ChartRef } from '@/types';
import { useECharts } from '@/hooks/useECharts';

export const BaseChart = forwardRef<ChartRef, BaseChartProps>(({
    title,
    width = '100%',
    height = 400,
    theme = 'light',
    loading: externalLoading = false,
    notMerge = false,
    lazyUpdate = true,
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
    renderer = 'canvas',
    locale = 'en',
    ...restProps
}, ref) => {
    const echartsContainerRef = useRef<HTMLDivElement>(null);

    // Simple title override if provided as string prop
    const chartOption = useMemo(() => {
        if (title && typeof title === 'string') {
            return {
                ...option,
                title: {
                    ...option.title,
                    text: title,
                    left: 'center',
                },
            };
        }
        return option;
    }, [option, title]);

    const { chart, loading: chartLoading, error, refresh } = useECharts(
        echartsContainerRef,
        chartOption,
        theme,
        { renderer, locale },
        notMerge,
        lazyUpdate,
    );

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

    // Expose chart instance through ref
    useImperativeHandle(ref, () => ({
        getEChartsInstance: () => chart,
        refresh,
    }), [chart, refresh]);

    const containerStyle = useMemo(() => ({
        width,
        height,
        position: 'relative' as const,
        ...style,
    }), [width, height, style]);

    if (error) {
        return (
            <div
                className={`aqc-charts-error ${className}`}
                style={containerStyle}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#ff4d4f',
                    fontSize: '14px',
                }}>
                    Error: {error}
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
                ref={echartsContainerRef}
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