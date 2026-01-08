import React, { forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import type { SankeyChartProps, ErgonomicChartRef } from '@/types';
import { useChartComponent } from '@/hooks/useChartComponent';
import { buildSankeyChartOption } from '@/utils/chart-builders';

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
const SankeyChart = forwardRef<ErgonomicChartRef, SankeyChartProps>((props, ref) => {
  const { className } = props;

  // Memoize the build function to ensure stable reference
  const buildOption = useMemo(() => buildSankeyChartOption, []);

  const {
    containerRef,
    containerStyle,
    domProps,
    refMethods,
    renderError,
    renderLoading,
    error,
    getEChartsInstance,
  } = useChartComponent({
    props,
    buildOption,
    chartType: 'sankey',
  });

  // Sankey-specific: Focus on specific node functionality
  const focusNode = useCallback((nodeName: string) => {
    const chart = getEChartsInstance();
    if (!chart) return;

    // Find the node index
    const option = chart.getOption() as { series?: Array<{ data?: Array<{ name: string }> }> };
    const series = option.series?.[0];
    if (!series?.data) return;

    const nodeIndex = series.data.findIndex((node) => node.name === nodeName);
    if (nodeIndex >= 0) {
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: nodeIndex,
      });
    }
  }, [getEChartsInstance]);

  // Expose ergonomic API through ref (including sankey-specific methods)
  useImperativeHandle(ref, () => ({
    ...refMethods,
    focusNode,
  }), [refMethods, focusNode]);

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

SankeyChart.displayName = 'SankeyChart';

export { SankeyChart };
