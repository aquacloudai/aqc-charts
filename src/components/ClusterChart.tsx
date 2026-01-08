import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import type { ClusterChartProps, ErgonomicChartRef } from '@/types';
import { useChartComponent } from '@/hooks/useChartComponent';
import { buildClusterChartOption } from '@/utils/chart-builders';

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
const ClusterChart = forwardRef<ErgonomicChartRef, ClusterChartProps>((props, ref) => {
  const { className } = props;

  // Memoize the build function to ensure stable reference
  const buildOption = useMemo(() => buildClusterChartOption, []);

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
    chartType: 'cluster',
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

ClusterChart.displayName = 'ClusterChart';

export { ClusterChart };
