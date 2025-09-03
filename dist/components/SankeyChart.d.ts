import React from 'react';
import type { SankeyChartProps, ErgonomicChartRef } from '@/types';
/**
 * Ergonomic SankeyChart component with intuitive props
 *
 * @example
 * // Simple sankey chart with nodes and links data structure
 * <SankeyChart
 *   data={{
 *     nodes: [
 *       { name: 'a' },
 *       { name: 'b' },
 *       { name: 'c' }
 *     ],
 *     links: [
 *       { source: 'a', target: 'b', value: 10 },
 *       { source: 'b', target: 'c', value: 15 }
 *     ]
 *   }}
 *   title="Flow Diagram"
 * />
 *
 * @example
 * // Sankey chart with flat data structure
 * <SankeyChart
 *   data={[
 *     { source: 'Product A', target: 'Sales', value: 120 },
 *     { source: 'Product B', target: 'Sales', value: 80 },
 *     { source: 'Sales', target: 'Profit', value: 150 }
 *   ]}
 *   sourceField="source"
 *   targetField="target"
 *   valueField="value"
 *   orient="horizontal"
 *   nodeAlign="left"
 * />
 *
 * @example
 * // Highly customized sankey chart
 * <SankeyChart
 *   nodes={[
 *     { name: 'Revenue', value: 1000 },
 *     { name: 'Costs', value: 400 },
 *     { name: 'Profit', value: 600 }
 *   ]}
 *   links={[
 *     { source: 'Revenue', target: 'Costs', value: 400 },
 *     { source: 'Revenue', target: 'Profit', value: 600 }
 *   ]}
 *   nodeColors={['#5470c6', '#91cc75', '#fac858']}
 *   linkColors={['#ff6b6b', '#4ecdc4']}
 *   linkOpacity={0.8}
 *   linkCurveness={0.7}
 *   showNodeValues
 *   showLinkLabels
 * />
 */
declare const SankeyChart: React.ForwardRefExoticComponent<SankeyChartProps & React.RefAttributes<ErgonomicChartRef>>;
export { SankeyChart };
//# sourceMappingURL=SankeyChart.d.ts.map