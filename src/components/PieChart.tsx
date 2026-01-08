import React, { forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import type { PieChartProps, ErgonomicChartRef } from '@/types';
import { useChartComponent } from '@/hooks/useChartComponent';
import { buildPieChartOption } from '@/utils/chart-builders';

/**
 * Ergonomic PieChart component with intuitive props
 *
 * @example
 * // Simple pie chart with object data
 * <PieChart
 *   data={[
 *     { category: 'Desktop', sales: 4200 },
 *     { category: 'Mobile', sales: 3800 },
 *     { category: 'Tablet', sales: 1200 }
 *   ]}
 *   nameField="category"
 *   valueField="sales"
 *   title="Sales by Platform"
 * />
 *
 * @example
 * // Donut chart with custom styling
 * <PieChart
 *   data={marketData}
 *   nameField="segment"
 *   valueField="share"
 *   radius={[40, 70]}
 *   title="Market Share"
 *   showPercentages
 *   labelPosition="outside"
 * />
 *
 * @example
 * // Rose/nightingale chart
 * <PieChart
 *   data={performanceData}
 *   nameField="department"
 *   valueField="score"
 *   roseType
 *   title="Performance by Department"
 *   showLabels
 * />
 */
const PieChart = forwardRef<ErgonomicChartRef, PieChartProps>((props, ref) => {
  const { className } = props;

  // Memoize the build function to ensure stable reference
  const buildOption = useMemo(() => buildPieChartOption, []);

  const {
    containerRef,
    containerStyle,
    domProps,
    refMethods,
    renderError,
    renderLoading,
    error,
    getEChartsInstance,
  } = useChartComponent({
    props,
    buildOption,
    chartType: 'pie',
  });

  // Pie-specific: Select slice functionality
  const selectSlice = useCallback((dataIndex: number) => {
    const chart = getEChartsInstance();
    if (!chart) return;

    chart.dispatchAction({
      type: 'pieSelect',
      seriesIndex: 0,
      dataIndex,
    });
  }, [getEChartsInstance]);

  // Pie-specific: Unselect slice functionality
  const unselectSlice = useCallback((dataIndex: number) => {
    const chart = getEChartsInstance();
    if (!chart) return;

    chart.dispatchAction({
      type: 'pieUnSelect',
      seriesIndex: 0,
      dataIndex,
    });
  }, [getEChartsInstance]);

  // Expose ergonomic API through ref (including pie-specific methods)
  useImperativeHandle(ref, () => ({
    ...refMethods,
    selectSlice,
    unselectSlice,
  }), [refMethods, selectSlice, unselectSlice]);

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

PieChart.displayName = 'PieChart';

export { PieChart };
