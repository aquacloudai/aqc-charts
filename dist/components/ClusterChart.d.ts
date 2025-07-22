import type { ClusterChartProps, ErgonomicChartRef } from '@/types';
/**
 * Ergonomic ClusterChart component with intuitive props
 * Uses K-means clustering to automatically group data points and visualize clusters
 *
 * @example
 * // Simple cluster chart with object data
 * <ClusterChart
 *   data={[
 *     { x: 10, y: 20 },
 *     { x: 15, y: 25 },
 *     { x: 50, y: 60 },
 *     { x: 55, y: 65 }
 *   ]}
 *   xField="x"
 *   yField="y"
 *   clusterCount={2}
 * />
 *
 * @example
 * // Advanced clustering with custom styling
 * <ClusterChart
 *   data={customerData}
 *   xField="age"
 *   yField="income"
 *   nameField="name"
 *   title="Customer Segmentation"
 *   clusterCount={4}
 *   clusterColors={['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']}
 *   pointSize={12}
 *   showVisualMap={true}
 *   visualMapPosition="right"
 * />
 */
declare const ClusterChart: import("react").ForwardRefExoticComponent<ClusterChartProps & import("react").RefAttributes<ErgonomicChartRef>>;
export { ClusterChart };
//# sourceMappingURL=ClusterChart.d.ts.map