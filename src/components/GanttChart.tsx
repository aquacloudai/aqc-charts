import React, { forwardRef, useImperativeHandle, useMemo, useCallback, useEffect } from 'react';
import type { EChartsType } from 'echarts/core';
import type { GanttChartProps, ErgonomicChartRef, GanttTask, GanttCategory } from '@/types';
import { useChartComponent } from '@/hooks/useChartComponent';
import { buildGanttChartOption } from '@/utils/chart-builders';

/**
 * Ergonomic GanttChart component with extensive customization options
 *
 * @example
 * // Simple project timeline with tasks and categories
 * <GanttChart
 *   data={{
 *     tasks: [
 *       {
 *         id: 'task1',
 *         name: 'Design Phase',
 *         category: 'Development',
 *         startTime: '2024-01-01',
 *         endTime: '2024-01-15',
 *         status: 'completed'
 *       },
 *       {
 *         id: 'task2',
 *         name: 'Implementation',
 *         category: 'Development',
 *         startTime: '2024-01-10',
 *         endTime: '2024-02-01',
 *         status: 'in-progress',
 *         progress: 65
 *       }
 *     ],
 *     categories: [
 *       { name: 'Development', label: 'Development Team' },
 *       { name: 'Marketing', label: 'Marketing Department' }
 *     ]
 *   }}
 *   title="Project Timeline"
 *   showTaskProgress
 *   todayMarker
 * />
 */
const GanttChart = forwardRef<ErgonomicChartRef, GanttChartProps>((props, ref) => {
  const {
    className,
    onTaskClick,
    onCategoryClick,
    onTimeRangeChange,
    onDataPointClick,
  } = props;

  // Memoize the build function to ensure stable reference
  const buildOption = useMemo(() => buildGanttChartOption, []);

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
    chartType: 'gantt',
  });

  // Get chart instance for Gantt-specific event handling
  const chartInstance = getEChartsInstance();

  // Gantt-specific event handling for task and category clicks
  useEffect(() => {
    if (!chartInstance) return;

    const handleClick = (params: { seriesIndex: number; value: unknown[] }, chart: EChartsType) => {
      if (params.seriesIndex === 0) { // Task series
        const [_categoryIndex, startTime, endTime, taskName, taskId] = params.value as [number, number, number, string, string];
        const taskData: GanttTask = {
          id: taskId,
          name: taskName,
          category: '',
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        };

        onTaskClick?.(taskData, params);
        onDataPointClick?.(params, { chart, event: params });
      } else if (params.seriesIndex === 1) { // Category series
        const [_categoryIndex, categoryName, categoryLabel] = params.value as [number, string, string];
        const categoryData: GanttCategory = {
          name: categoryName,
          label: categoryLabel,
        };

        onCategoryClick?.(categoryData, params);
      }
    };

    if (onTaskClick || onCategoryClick || onDataPointClick) {
      chartInstance.on('click', handleClick as (...args: unknown[]) => void);
    }

    return () => {
      chartInstance.off('click', handleClick as (...args: unknown[]) => void);
    };
  }, [chartInstance, onTaskClick, onCategoryClick, onDataPointClick]);

  // Gantt-specific: Highlight task by ID
  const highlightTask = useCallback((taskId: string) => {
    const chart = getEChartsInstance();
    if (!chart) return;

    const option = chart.getOption() as { series?: Array<{ data?: Array<{ value: unknown[] }> }> };
    const taskSeries = option.series?.[0];
    if (!taskSeries?.data) return;

    const taskIndex = taskSeries.data.findIndex((item) => item.value[4] === taskId);
    if (taskIndex >= 0) {
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: taskIndex,
      });
    }
  }, [getEChartsInstance]);

  // Gantt-specific: Zoom to specific time range
  const zoomToRange = useCallback((startTime: Date, endTime: Date) => {
    const chart = getEChartsInstance();
    if (!chart) return;

    const startMs = startTime.getTime();
    const endMs = endTime.getTime();

    chart.dispatchAction({
      type: 'dataZoom',
      startValue: startMs,
      endValue: endMs,
    });

    onTimeRangeChange?.(startTime, endTime);
  }, [getEChartsInstance, onTimeRangeChange]);

  // Gantt-specific: Focus on specific task
  const focusTask = useCallback((taskId: string) => {
    const chart = getEChartsInstance();
    if (!chart) return;

    const option = chart.getOption() as { series?: Array<{ data?: Array<{ value: unknown[] }> }> };
    const taskSeries = option.series?.[0];
    if (!taskSeries?.data) return;

    const task = taskSeries.data.find((item) => item.value[4] === taskId);
    if (task) {
      const [, startTime, endTime] = task.value as [unknown, number, number];
      const buffer = (endTime - startTime) * 0.2; // 20% padding
      zoomToRange(new Date(startTime - buffer), new Date(endTime + buffer));
      highlightTask(taskId);
    }
  }, [getEChartsInstance, zoomToRange, highlightTask]);

  // Expose ergonomic API through ref (including gantt-specific methods)
  useImperativeHandle(ref, () => ({
    ...refMethods,
    // Override highlight to work with task IDs
    highlight: (dataIndex: number) => highlightTask(String(dataIndex)),
    // Gantt-specific methods
    focusTask,
    zoomToRange,
    highlightTask,
  }), [refMethods, focusTask, zoomToRange, highlightTask]);

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

GanttChart.displayName = 'GanttChart';

export { GanttChart };
export type { GanttChartProps };
