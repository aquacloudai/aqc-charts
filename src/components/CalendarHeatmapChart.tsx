import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import type { CalendarHeatmapProps, ErgonomicChartRef } from '@/types';
import { useChartComponent } from '@/hooks/useChartComponent';
import { buildCalendarHeatmapOption } from '@/utils/chart-builders';

/**
 * Ergonomic CalendarHeatmapChart component with intuitive props
 *
 * @example
 * // Simple calendar heatmap with object data
 * <CalendarHeatmapChart
 *   data={[
 *     { date: '2023-01-01', value: 10 },
 *     { date: '2023-01-02', value: 25 },
 *     { date: '2023-01-03', value: 15 }
 *   ]}
 *   year={2023}
 *   colorScale={['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']}
 * />
 *
 * @example
 * // Multi-year calendar heatmap with custom fields
 * <CalendarHeatmapChart
 *   data={commitData}
 *   dateField="commit_date"
 *   valueField="commits_count"
 *   year={[2022, 2023]}
 *   showValues
 *   cellSize={[20, 20]}
 * />
 *
 * @example
 * // Calendar heatmap with custom styling
 * <CalendarHeatmapChart
 *   data={activityData}
 *   year={2023}
 *   colorScale={['#f0f0f0', '#d6e685', '#8cc665', '#44a340', '#1e6823']}
 *   cellBorderColor="#ccc"
 *   orient="vertical"
 *   showWeekLabel={false}
 * />
 */
const CalendarHeatmapChart = forwardRef<ErgonomicChartRef, CalendarHeatmapProps>((props, ref) => {
  const { className } = props;

  // Memoize the build function to ensure stable reference
  const buildOption = useMemo(() => buildCalendarHeatmapOption, []);

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
    chartType: 'calendar-heatmap',
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

CalendarHeatmapChart.displayName = 'CalendarHeatmapChart';

export { CalendarHeatmapChart };
