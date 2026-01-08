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
 */
declare const SankeyChart: React.ForwardRefExoticComponent<SankeyChartProps & React.RefAttributes<ErgonomicChartRef>>;
export { SankeyChart };
//# sourceMappingURL=SankeyChart.d.ts.map