import React from 'react';
import type { PieChartProps, ErgonomicChartRef } from '@/types';
/**
 * Ergonomic PieChart component with intuitive props
 *
 * @example
 * // Simple pie chart with object data
 * <ErgonomicPieChart
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
 * <ErgonomicPieChart
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
 * <ErgonomicPieChart
 *   data={performanceData}
 *   nameField="department"
 *   valueField="score"
 *   roseType
 *   title="Performance by Department"
 *   showLabels
 * />
 */
declare const PieChart: React.ForwardRefExoticComponent<PieChartProps & React.RefAttributes<ErgonomicChartRef>>;
export { PieChart };
//# sourceMappingURL=PieChart.d.ts.map