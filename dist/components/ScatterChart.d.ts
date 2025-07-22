import type { ScatterChartProps, ErgonomicChartRef } from '@/types';
/**
 * Ergonomic ScatterChart component with intuitive props
 *
 * @example
 * // Simple scatter plot with object data
 * <ScatterChart
 *   data={[
 *     { x: 10, y: 20 },
 *     { x: 15, y: 25 },
 *     { x: 20, y: 18 }
 *   ]}
 *   xField="x"
 *   yField="y"
 *   pointSize={8}
 * />
 *
 * @example
 * // Bubble chart with size dimension
 * <ScatterChart
 *   data={[
 *     { sales: 100, profit: 20, employees: 50 },
 *     { sales: 120, profit: 25, employees: 60 },
 *     { sales: 110, profit: 18, employees: 45 }
 *   ]}
 *   xField="sales"
 *   yField="profit"
 *   sizeField="employees"
 *   pointSize={[5, 30]}
 * />
 *
 * @example
 * // Multiple series with explicit configuration
 * <ScatterChart
 *   series={[
 *     {
 *       name: 'Dataset A',
 *       data: [{ x: 10, y: 20 }, { x: 15, y: 25 }],
 *       color: '#ff6b6b',
 *       pointSize: 10
 *     },
 *     {
 *       name: 'Dataset B',
 *       data: [{ x: 5, y: 12 }, { x: 8, y: 18 }],
 *       color: '#4ecdc4',
 *       pointShape: 'square'
 *     }
 *   ]}
 *   xField="x"
 *   yField="y"
 * />
 */
declare const ScatterChart: import("react").ForwardRefExoticComponent<ScatterChartProps & import("react").RefAttributes<ErgonomicChartRef>>;
export { ScatterChart };
//# sourceMappingURL=ScatterChart.d.ts.map