import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import type { LineChartProps, ErgonomicChartRef } from '@/types';
import { useChartComponent } from '@/hooks/useChartComponent';
import { buildLineChartOption } from '@/utils/chart-builders';

/**
 * Ergonomic LineChart component with intuitive props
 *
 * @example
 * // Simple line chart with object data
 * <LineChart
 *   data={[
 *     { month: 'Jan', sales: 100, profit: 20 },
 *     { month: 'Feb', sales: 120, profit: 25 },
 *     { month: 'Mar', sales: 110, profit: 22 }
 *   ]}
 *   xField="month"
 *   yField={['sales', 'profit']}
 *   smooth
 *   showArea
 * />
 *
 * @example
 * // Multiple series with explicit configuration
 * <LineChart
 *   series={[
 *     {
 *       name: 'Sales',
 *       data: [{ date: '2023-01', value: 100 }, { date: '2023-02', value: 120 }],
 *       color: '#ff6b6b',
 *       smooth: true
 *     },
 *     {
 *       name: 'Profit',
 *       data: [{ date: '2023-01', value: 20 }, { date: '2023-02', value: 25 }],
 *       color: '#4ecdc4'
 *     }
 *   ]}
 *   xField="date"
 *   yField="value"
 * />
 */
const LineChart = forwardRef<ErgonomicChartRef, LineChartProps>((props, ref) => {
  const { className } = props;

  // Memoize the build function to ensure stable reference
  const buildOption = useMemo(() => buildLineChartOption, []);

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
    chartType: 'line',
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

LineChart.displayName = 'LineChart';

export { LineChart };
