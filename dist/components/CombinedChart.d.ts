import type { CombinedChartProps, ErgonomicChartRef } from '@/types';
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
declare const CombinedChart: import("react").ForwardRefExoticComponent<CombinedChartProps & import("react").RefAttributes<ErgonomicChartRef>>;
export { CombinedChart };
//# sourceMappingURL=CombinedChart.d.ts.map