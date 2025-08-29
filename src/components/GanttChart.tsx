import { forwardRef, useMemo, useImperativeHandle } from 'react';
import type { EChartsType } from 'echarts/core';
import type { GanttChartProps, ErgonomicChartRef, GanttTask, GanttCategory } from '@/types';
import { useECharts } from '@/hooks/useECharts';
import { buildGanttChartOption } from '@/utils/chart-builders';
import { filterDOMProps } from '@/utils/domProps';

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
 * 
 * @example
 * // Highly customized Gantt chart with status-based styling
 * <GanttChart
 *   tasks={projectTasks}
 *   categories={departments}
 *   title="Q1 Project Schedule"
 *   theme="dark"
 *   taskBarStyle={{
 *     height: 0.8,
 *     borderRadius: 6,
 *     showProgress: true,
 *     textStyle: { 
 *       position: 'inside',
 *       showDuration: true 
 *     }
 *   }}
 *   categoryLabelStyle={{
 *     width: 150,
 *     shape: 'pill',
 *     backgroundColor: '#2a2a2a',
 *     textColor: '#ffffff'
 *   }}
 *   statusStyles={{
 *     'completed': { backgroundColor: '#4CAF50' },
 *     'in-progress': { backgroundColor: '#2196F3' },
 *     'delayed': { backgroundColor: '#FF9800' }
 *   }}
 *   dataZoom={{ type: 'both' }}
 *   sortBy="priority"
 *   sortOrder="desc"
 *   onTaskClick={(task) => alert('Task clicked: ' + task.name)}
 * />
 */
const GanttChart = forwardRef<ErgonomicChartRef, GanttChartProps>(({
  // Chart dimensions
  width = '100%',
  height = 600,
  className,
  style,
  
  // Data and field mappings
  data,
  idField = 'id',
  nameField = 'name',
  categoryField = 'category',
  startTimeField = 'startTime',
  endTimeField = 'endTime',
  colorField = 'color',
  statusField = 'status',
  priorityField = 'priority',
  progressField = 'progress',
  assigneeField = 'assignee',
  tasks,
  categories,
  
  // Styling
  theme = 'light',
  colorPalette,
  backgroundColor,
  
  // Title
  title,
  subtitle,
  titlePosition = 'center',
  
  // Layout and spacing
  categoryWidth = 120,
  taskHeight = 0.6,
  categorySpacing = 2,
  groupSpacing = 8,
  
  // Task bar styling
  taskBarStyle,
  statusStyles,
  priorityStyles,
  
  // Category styling
  categoryLabelStyle,
  showCategoryLabels = true,
  categoryColors,
  
  // Timeline styling
  timelineStyle,
  timeRange,
  timeFormat,
  
  // Zoom and navigation
  dataZoom = true,
  allowPan = true,
  allowZoom = true,
  initialZoomLevel,
  
  // Interactions
  draggable = false,
  resizable = false,
  selectable = false,
  showTaskTooltips = true,
  showDependencies = false,
  
  // Milestones and markers
  showMilestones = false,
  milestoneStyle,
  todayMarker = false,
  
  // Progress and status
  showProgress = false,
  showTaskProgress = true,
  progressStyle,
  
  // Grouping and filtering
  groupByCategory = false,
  groupByAssignee = false,
  filterByStatus,
  filterByPriority,
  sortBy,
  sortOrder = 'asc',
  
  // Configuration
  legend,
  tooltip,
  
  // States
  loading = false,
  disabled: _disabled = false,
  animate = true,
  animationDuration,
  
  // Events
  onChartReady,
  onDataPointClick,
  onDataPointHover,
  onTaskClick,
  onTaskDrag: _onTaskDrag,
  onTaskResize: _onTaskResize,
  onCategoryClick,
  onTimeRangeChange,
  
  // Advanced
  customOption,
  responsive: _responsive = true,
  
  ...restProps
}, ref) => {
  const domProps = filterDOMProps(restProps);
  
  // Build ECharts option from ergonomic props
  const chartOption = useMemo(() => {
    return buildGanttChartOption({
      data: data || undefined,
      idField,
      nameField,
      categoryField,
      startTimeField,
      endTimeField,
      colorField,
      statusField,
      priorityField,
      progressField,
      assigneeField,
      tasks,
      categories,
      theme,
      colorPalette,
      backgroundColor,
      title,
      subtitle,
      titlePosition,
      categoryWidth,
      taskHeight,
      categorySpacing,
      groupSpacing,
      taskBarStyle,
      statusStyles,
      priorityStyles,
      categoryLabelStyle,
      showCategoryLabels,
      categoryColors,
      timelineStyle,
      timeRange,
      timeFormat,
      dataZoom,
      allowPan,
      allowZoom,
      initialZoomLevel,
      draggable,
      resizable,
      selectable,
      showTaskTooltips,
      showDependencies,
      showMilestones,
      milestoneStyle,
      todayMarker,
      showProgress,
      showTaskProgress,
      progressStyle,
      groupByCategory,
      groupByAssignee,
      filterByStatus,
      filterByPriority,
      sortBy,
      sortOrder,
      legend,
      tooltip,
      animate,
      animationDuration,
      customOption,
    });
  }, [
    data, idField, nameField, categoryField, startTimeField, endTimeField,
    colorField, statusField, priorityField, progressField, assigneeField,
    tasks, categories, theme, colorPalette, backgroundColor,
    title, subtitle, titlePosition, categoryWidth, taskHeight,
    categorySpacing, groupSpacing, taskBarStyle, statusStyles, priorityStyles,
    categoryLabelStyle, showCategoryLabels, categoryColors,
    timelineStyle, timeRange, timeFormat, dataZoom, allowPan, allowZoom,
    initialZoomLevel, draggable, resizable, selectable, showTaskTooltips,
    showDependencies, showMilestones, milestoneStyle, todayMarker,
    showProgress, showTaskProgress, progressStyle, groupByCategory,
    groupByAssignee, filterByStatus, filterByPriority, sortBy, sortOrder,
    legend, tooltip, animate, animationDuration, customOption
  ]);
  
  // Handle chart interactions
  const chartEvents = useMemo(() => {
    const events: Record<string, any> = {};
    
    if (onDataPointClick || onTaskClick) {
      events.click = (params: any, chart: EChartsType) => {
        if (params.seriesIndex === 0) { // Task series
          const [_categoryIndex, startTime, endTime, taskName, taskId] = params.value;
          const taskData: GanttTask = {
            id: taskId,
            name: taskName,
            category: '', // We'd need to get this from the categories array
            startTime: new Date(startTime),
            endTime: new Date(endTime),
          };
          
          onTaskClick?.(taskData, params);
          onDataPointClick?.(params, { chart, event: params });
        } else if (params.seriesIndex === 1) { // Category series
          const [_categoryIndex, categoryName, categoryLabel] = params.value;
          const categoryData: GanttCategory = {
            name: categoryName,
            label: categoryLabel,
          };
          
          onCategoryClick?.(categoryData, params);
        }
      };
    }
    
    if (onDataPointHover) {
      events.mouseover = (params: any, chart: EChartsType) => {
        onDataPointHover(params, { chart, event: params });
      };
    }
    
    return Object.keys(events).length > 0 ? events : undefined;
  }, [onDataPointClick, onDataPointHover, onTaskClick, onCategoryClick]);

  // Use the ECharts hook
  const {
    containerRef,
    loading: chartLoading,
    error,
    getEChartsInstance,
    resize,
    showLoading,
    hideLoading,
  } = useECharts({
    option: chartOption,
    theme,
    loading,
    events: chartEvents,
    onChartReady,
  });
  
  // Export image functionality
  const exportImage = (format: 'png' | 'jpeg' | 'svg' = 'png'): string => {
    const chart = getEChartsInstance();
    if (!chart) return '';
    
    return chart.getDataURL({
      type: format,
      pixelRatio: 2,
      backgroundColor: backgroundColor || '#fff',
    });
  };
  
  // Highlight functionality for tasks
  const highlight = (taskId: string) => {
    const chart = getEChartsInstance();
    if (!chart) return;
    
    const option = chart.getOption() as any;
    const taskSeries = option.series?.[0];
    if (!taskSeries?.data) return;
    
    const taskIndex = taskSeries.data.findIndex((item: any) => item.value[4] === taskId);
    if (taskIndex >= 0) {
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: taskIndex,
      });
    }
  };
  
  const clearHighlight = () => {
    const chart = getEChartsInstance();
    if (!chart) return;
    
    chart.dispatchAction({
      type: 'downplay',
    });
  };
  
  // Zoom to specific time range
  const zoomToRange = (startTime: Date, endTime: Date) => {
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
  };
  
  // Focus on specific task
  const focusTask = (taskId: string) => {
    const chart = getEChartsInstance();
    if (!chart) return;
    
    const option = chart.getOption() as any;
    const taskSeries = option.series?.[0];
    if (!taskSeries?.data) return;
    
    const task = taskSeries.data.find((item: any) => item.value[4] === taskId);
    if (task) {
      const [, startTime, endTime] = task.value;
      const buffer = (endTime - startTime) * 0.2; // 20% padding
      zoomToRange(new Date(startTime - buffer), new Date(endTime + buffer));
      highlight(taskId);
    }
  };
  
  // Update chart data
  const updateData = (newData: any) => {
    const chart = getEChartsInstance();
    if (!chart) return;
    
    const newOption = buildGanttChartOption({
      data: newData,
      idField, nameField, categoryField, startTimeField, endTimeField,
      colorField, statusField, priorityField, progressField, assigneeField,
      tasks, categories, theme, colorPalette, backgroundColor,
      title, subtitle, titlePosition, categoryWidth, taskHeight,
      categorySpacing, groupSpacing, taskBarStyle, statusStyles, priorityStyles,
      categoryLabelStyle, showCategoryLabels, categoryColors,
      timelineStyle, timeRange, timeFormat, dataZoom, allowPan, allowZoom,
      initialZoomLevel, draggable, resizable, selectable, showTaskTooltips,
      showDependencies, showMilestones, milestoneStyle, todayMarker,
      showProgress, showTaskProgress, progressStyle, groupByCategory,
      groupByAssignee, filterByStatus, filterByPriority, sortBy, sortOrder,
      legend, tooltip, animate, animationDuration, customOption,
    });
    
    chart.setOption(newOption as any);
  };
  
  // Expose ergonomic API through ref
  useImperativeHandle(ref, () => ({
    getChart: getEChartsInstance,
    exportImage,
    resize,
    showLoading: () => showLoading(),
    hideLoading,
    highlight: (dataIndex: number) => highlight(String(dataIndex)), // Convert for compatibility
    clearHighlight,
    updateData,
    // Gantt-specific methods
    focusTask,
    zoomToRange,
    highlightTask: highlight,
  }), [getEChartsInstance, exportImage, resize, showLoading, hideLoading, highlight, clearHighlight, updateData, focusTask, zoomToRange]);
  
  // Error state
  if (error) {
    return (
      <div
        className={`aqc-charts-error ${className || ''}`}
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff4d4f',
          fontSize: '14px',
          border: '1px dashed #ff4d4f',
          borderRadius: '4px',
          ...style,
        }}
      >
        Error: {error.message || 'Failed to render chart'}
      </div>
    );
  }
  
  // Container style
  const containerStyle = useMemo(() => ({
    width,
    height,
    position: 'relative' as const,
    ...style,
  }), [width, height, style]);
  
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
      {(chartLoading || loading) && (
        <div 
          className="aqc-charts-loading"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            color: '#666',
          }}
        >
          <div className="aqc-charts-spinner" style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #1890ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px',
          }} />
          Loading...
        </div>
      )}
    </div>
  );
});

GanttChart.displayName = 'GanttChart';

export { GanttChart };
export type { GanttChartProps };