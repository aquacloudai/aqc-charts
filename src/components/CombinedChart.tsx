import React, { forwardRef, useImperativeHandle, useCallback } from 'react';
import type { EChartsOption } from 'echarts/types/dist/shared';
import type { CombinedChartProps, ErgonomicChartRef } from '@/types';
import { useChartComponent } from '@/hooks/useChartComponent';
import { buildCombinedChartOption } from '@/utils/chart-builders';

/**
 * Combined Chart component that can mix line and bar series in the same visualization
 *
 * @example
 * // Combined chart with sales bars and temperature line
 * <CombinedChart
 *   data={[
 *     { month: 'Jan', sales: 100, temperature: 15 },
 *     { month: 'Feb', sales: 120, temperature: 18 },
 *     { month: 'Mar', sales: 110, temperature: 22 }
 *   ]}
 *   xField="month"
 *   series={[
 *     { field: 'sales', type: 'bar', name: 'Sales', color: '#1890ff' },
 *     { field: 'temperature', type: 'line', name: 'Temperature', color: '#ff4d4f', yAxisIndex: 1 }
 *   ]}
 *   yAxis={[
 *     { name: 'Sales (units)', position: 'left' },
 *     { name: 'Temperature (°C)', position: 'right' }
 *   ]}
 * />
 *
 * @example
 * // Simple combined chart with default styling
 * <CombinedChart
 *   data={salesData}
 *   xField="quarter"
 *   series={[
 *     { field: 'revenue', type: 'bar', name: 'Revenue' },
 *     { field: 'growth', type: 'line', name: 'Growth Rate' }
 *   ]}
 * />
 */
const CombinedChart = forwardRef<ErgonomicChartRef, CombinedChartProps>((props, ref) => {
  const { className } = props;

  // Wrapper to handle optional props with defaults
  const buildOption = useCallback((chartProps: CombinedChartProps): EChartsOption => {
    return buildCombinedChartOption({
      data: chartProps.data || [],
      xField: chartProps.xField || 'x',
      series: chartProps.series || [],
      theme: chartProps.theme,
      colorPalette: chartProps.colorPalette,
      backgroundColor: chartProps.backgroundColor,
      title: chartProps.title,
      subtitle: chartProps.subtitle,
      titlePosition: chartProps.titlePosition,
      xAxis: chartProps.xAxis,
      yAxis: chartProps.yAxis,
      legend: chartProps.legend,
      tooltip: chartProps.tooltip,
      zoom: chartProps.zoom,
      pan: chartProps.pan,
      brush: chartProps.brush,
      animate: chartProps.animate,
      animationDuration: chartProps.animationDuration,
      customOption: chartProps.customOption,
    });
  }, []);

  const {
    containerRef,
    containerStyle,
    domProps,
    refMethods,
    renderError,
    renderLoading,
    error,
  } = useChartComponent({
    props,
    buildOption,
    chartType: 'combined',
  });

  // Expose ergonomic API through ref
  useImperativeHandle(ref, () => refMethods, [refMethods]);

  // Error state
  if (error) {
    return renderError();
  }

  return (
    <div
      className={`aqc-charts-container ${className || ''}`}
      style={containerStyle}
      {...domProps}
    >
      {/* Chart container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />

      {/* Loading overlay */}
      {renderLoading()}
    </div>
  );
});

CombinedChart.displayName = 'CombinedChart';

export { CombinedChart };
