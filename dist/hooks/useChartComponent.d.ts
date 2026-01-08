import React from 'react';
import type { RefObject } from 'react';
import type { EChartsType } from 'echarts/core';
import type { EChartsOption } from 'echarts/types/dist/shared';
import type { BaseErgonomicChartProps, ErgonomicChartRef } from '@/types';
/**
 * Props for the useChartComponent hook
 */
export interface UseChartComponentProps<TProps extends BaseErgonomicChartProps> {
    /** The chart component props */
    props: TProps;
    /** Function to build ECharts option from props */
    buildOption: (props: TProps) => EChartsOption;
    /** Chart type identifier for debugging */
    chartType?: string;
}
/**
 * Return type for the useChartComponent hook
 */
export interface UseChartComponentReturn {
    /** Ref for the chart container div */
    containerRef: RefObject<HTMLDivElement | null>;
    /** Whether the chart is loading */
    isLoading: boolean;
    /** Error if chart initialization failed */
    error: Error | null;
    /** Container style with proper dimensions */
    containerStyle: React.CSSProperties;
    /** DOM props filtered for safe spreading */
    domProps: Record<string, unknown>;
    /** ECharts instance getter */
    getEChartsInstance: () => EChartsType | null;
    /** Methods to expose via ref */
    refMethods: Omit<ErgonomicChartRef, 'selectSlice' | 'unselectSlice'>;
    /** Render the error state */
    renderError: () => React.ReactNode;
    /** Render the loading overlay */
    renderLoading: () => React.ReactNode;
}
/**
 * Shared hook that consolidates common chart component logic.
 * Eliminates ~400 lines of duplicated code per chart component.
 *
 * @example
 * ```tsx
 * const LineChart = forwardRef<ErgonomicChartRef, LineChartProps>((props, ref) => {
 *   const {
 *     containerRef,
 *     containerStyle,
 *     domProps,
 *     refMethods,
 *     renderError,
 *     renderLoading,
 *     error,
 *   } = useChartComponent({
 *     props,
 *     buildOption: buildLineChartOption,
 *     chartType: 'line',
 *   });
 *
 *   useImperativeHandle(ref, () => refMethods, [refMethods]);
 *
 *   if (error) return renderError();
 *
 *   return (
 *     <div className={`aqc-charts-container ${props.className || ''}`} style={containerStyle} {...domProps}>
 *       <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
 *       {renderLoading()}
 *     </div>
 *   );
 * });
 * ```
 */
export declare function useChartComponent<TProps extends BaseErgonomicChartProps>({ props, buildOption, chartType: _chartType, }: UseChartComponentProps<TProps>): UseChartComponentReturn;
//# sourceMappingURL=useChartComponent.d.ts.map