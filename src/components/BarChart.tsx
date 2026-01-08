import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import type { BarChartProps, ErgonomicChartRef } from '@/types';
import { useChartComponent } from '@/hooks/useChartComponent';
import { buildBarChartOption } from '@/utils/chart-builders';

/**
 * Ergonomic BarChart component with intuitive props
 *
 * @example
 * // Simple bar chart with object data
 * <BarChart
 *   data={[
 *     { category: 'Q1', sales: 100, profit: 20 },
 *     { category: 'Q2', sales: 120, profit: 25 },
 *     { category: 'Q3', sales: 110, profit: 22 },
 *     { category: 'Q4', sales: 140, profit: 30 }
 *   ]}
 *   categoryField="category"
 *   valueField={['sales', 'profit']}
 *   orientation="vertical"
 * />
 *
 * @example
 * // Stacked bar chart
 * <BarChart
 *   data={salesData}
 *   categoryField="month"
 *   valueField="amount"
 *   seriesField="product"
 *   stack="normal"
 *   orientation="horizontal"
 * />
 *
 * @example
 * // Multiple series with explicit configuration
 * <BarChart
 *   series={[
 *     {
 *       name: 'Sales',
 *       data: [{ quarter: 'Q1', value: 100 }, { quarter: 'Q2', value: 120 }],
 *       color: '#1890ff'
 *     },
 *     {
 *       name: 'Profit',
 *       data: [{ quarter: 'Q1', value: 20 }, { quarter: 'Q2', value: 25 }],
 *       color: '#52c41a'
 *     }
 *   ]}
 *   categoryField="quarter"
 *   valueField="value"
 * />
 */
const BarChart = forwardRef<ErgonomicChartRef, BarChartProps>((props, ref) => {
  const { className } = props;

  // Memoize the build function to ensure stable reference
  const buildOption = useMemo(() => buildBarChartOption, []);

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
    chartType: 'bar',
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

BarChart.displayName = 'BarChart';

export { BarChart };
