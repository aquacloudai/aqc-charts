import type { LineChartProps, ErgonomicChartRef } from '@/types';
/**
 * Ergonomic LineChart component with intuitive props
 *
 * @example
 * // Simple line chart with object data
 * <ErgonomicLineChart
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
 * <ErgonomicLineChart
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
declare const LineChart: import("react").ForwardRefExoticComponent<LineChartProps & import("react").RefAttributes<ErgonomicChartRef>>;
export { LineChart };
//# sourceMappingURL=LineChart.d.ts.map