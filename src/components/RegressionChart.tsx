import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import type { RegressionChartProps, ErgonomicChartRef } from '@/types';
import { useChartComponent } from '@/hooks/useChartComponent';
import { buildRegressionChartOption } from '@/utils/chart-builders';

/**
 * Ergonomic RegressionChart component with intuitive props
 *
 * @example
 * // Simple regression chart with array data
 * <RegressionChart
 *   data={[
 *     [1, 2], [2, 4], [3, 6], [4, 8], [5, 10]
 *   ]}
 *   method="linear"
 *   title="Linear Regression"
 * />
 *
 * @example
 * // Regression chart with object data
 * <RegressionChart
 *   data={[
 *     { x: 1, y: 2.1 },
 *     { x: 2, y: 3.9 },
 *     { x: 3, y: 6.2 },
 *     { x: 4, y: 7.8 },
 *     { x: 5, y: 10.1 }
 *   ]}
 *   xField="x"
 *   yField="y"
 *   method="linear"
 *   showEquation={true}
 *   equationPosition="top-left"
 * />
 *
 * @example
 * // Polynomial regression with custom styling
 * <RegressionChart
 *   data={polynomialData}
 *   method="polynomial"
 *   order={3}
 *   pointSize={10}
 *   lineWidth={3}
 *   lineColor="#ff6b6b"
 *   showEquation={true}
 *   showRSquared={true}
 * />
 */
const RegressionChart = forwardRef<ErgonomicChartRef, RegressionChartProps>((props, ref) => {
  const { className } = props;

  // Memoize the build function to ensure stable reference
  const buildOption = useMemo(() => buildRegressionChartOption, []);

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
    chartType: 'regression',
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

RegressionChart.displayName = 'RegressionChart';

export { RegressionChart };
