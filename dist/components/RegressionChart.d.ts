import React from 'react';
import type { RegressionChartProps, ErgonomicChartRef } from '@/types';
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
declare const RegressionChart: React.ForwardRefExoticComponent<RegressionChartProps & React.RefAttributes<ErgonomicChartRef>>;
export { RegressionChart };
//# sourceMappingURL=RegressionChart.d.ts.map