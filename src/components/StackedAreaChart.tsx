import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import type { AreaChartProps, ErgonomicChartRef } from '@/types';
import { useChartComponent } from '@/hooks/useChartComponent';
import { buildStackedAreaChartOption } from '@/utils/chart-builders';

/**
 * Ergonomic StackedAreaChart component with intuitive props
 *
 * @example
 * // Simple stacked area chart
 * <StackedAreaChart
 *   data={[
 *     { month: 'Jan', sales: 100, costs: 60 },
 *     { month: 'Feb', sales: 120, costs: 70 },
 *     { month: 'Mar', sales: 110, costs: 65 }
 *   ]}
 *   xField="month"
 *   yField={['sales', 'costs']}
 *   stacked
 * />
 */
const StackedAreaChart = forwardRef<ErgonomicChartRef, AreaChartProps>((props, ref) => {
  const { className } = props;

  // Memoize the build function to ensure stable reference
  const buildOption = useMemo(() => buildStackedAreaChartOption, []);

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
    chartType: 'stacked-area',
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

StackedAreaChart.displayName = 'StackedAreaChart';

export { StackedAreaChart };
