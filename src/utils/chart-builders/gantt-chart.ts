import type { EChartsOption } from 'echarts/types/dist/shared';
import type {
  GanttChartProps,
  GanttTask,
  GanttCategory,
  TaskBarStyle,
  CategoryLabelStyle,
  TimelineStyle,
  StatusStyleMap,
  PriorityStyleMap,
  DataPoint,
} from '@/types';

import { COLOR_PALETTES } from '../color-palettes';
import {
  isObjectData,
} from '../data-processing';
import {
  buildBaseOption,
  buildLegendOption,
  buildTooltipOption,
} from '../base-options';

export function buildGanttChartOption(props: GanttChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  const isDark = props.theme === 'dark';
  
  let tasks: GanttTask[] = [];
  let categories: GanttCategory[] = [];
  
  // Handle different data input formats
  if (props.tasks && props.categories) {
    // Direct tasks and categories provided
    tasks = [...props.tasks];
    categories = [...props.categories];
  } else if (props.data) {
    if (Array.isArray(props.data) && isObjectData(props.data)) {
      // Flat data format - need to extract tasks and categories
      const flatData = props.data as DataPoint[];
      const idField = props.idField || 'id';
      const nameField = props.nameField || 'name';
      const categoryField = props.categoryField || 'category';
      const startTimeField = props.startTimeField || 'startTime';
      const endTimeField = props.endTimeField || 'endTime';
      const colorField = props.colorField || 'color';
      const statusField = props.statusField || 'status';
      const priorityField = props.priorityField || 'priority';
      const progressField = props.progressField || 'progress';
      const assigneeField = props.assigneeField || 'assignee';
      
      // Extract unique categories
      const categorySet = new Set<string>();
      flatData.forEach(item => {
        const category = String(item[categoryField] || '');
        if (category) categorySet.add(category);
      });
      
      // Convert to category objects
      categories = Array.from(categorySet).map(name => ({ name }));
      
      // Convert to task objects
      tasks = flatData.map(item => {
        const taskProps: any = {
          id: String(item[idField] || ''),
          name: String(item[nameField] || ''),
          category: String(item[categoryField] || ''),
          startTime: item[startTimeField] || new Date(),
          endTime: item[endTimeField] || new Date(),
        };
        
        if (item[colorField]) taskProps.color = String(item[colorField]);
        if (item[statusField]) taskProps.status = String(item[statusField]);
        if (item[priorityField] !== undefined) taskProps.priority = item[priorityField];
        if (item[progressField] !== undefined) taskProps.progress = Number(item[progressField]);
        if (item[assigneeField]) taskProps.assignee = String(item[assigneeField]);
        
        return taskProps as GanttTask;
      });
    } else {
      // Assume data is in { tasks, categories } format
      const structuredData = props.data as { tasks: GanttTask[]; categories: GanttCategory[] };
      tasks = structuredData.tasks && Array.isArray(structuredData.tasks) ? [...structuredData.tasks] : [];
      categories = structuredData.categories && Array.isArray(structuredData.categories) ? [...structuredData.categories] : [];
    }
  }
  
  // Sort and group categories
  if (props.sortBy === 'category' || props.groupByCategory) {
    categories.sort((a, b) => {
      const orderA = a.order ?? 0;
      const orderB = b.order ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
  }
  
  // Sort tasks
  if (props.sortBy) {
    tasks.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (props.sortBy) {
        case 'startTime':
          aVal = new Date(a.startTime).getTime();
          bVal = new Date(b.startTime).getTime();
          break;
        case 'endTime':
          aVal = new Date(a.endTime).getTime();
          bVal = new Date(b.endTime).getTime();
          break;
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'priority':
          // Convert priority to numeric for sorting
          const priorityMap = { low: 1, medium: 2, high: 3, critical: 4 };
          aVal = typeof a.priority === 'number' ? a.priority : (priorityMap[a.priority as keyof typeof priorityMap] || 0);
          bVal = typeof b.priority === 'number' ? b.priority : (priorityMap[b.priority as keyof typeof priorityMap] || 0);
          break;
        default:
          return 0;
      }
      
      const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return props.sortOrder === 'desc' ? -result : result;
    });
  }
  
  // Apply filters
  if (props.filterByStatus && props.filterByStatus.length > 0) {
    tasks = tasks.filter(task => task.status && props.filterByStatus!.includes(task.status));
  }
  
  if (props.filterByPriority && props.filterByPriority.length > 0) {
    tasks = tasks.filter(task => task.priority && props.filterByPriority!.includes(task.priority));
  }
  
  // Create category index map
  const categoryMap = new Map(categories.map((cat, index) => [cat.name, index]));
  
  // Default style configurations
  const defaultTaskBarStyle: TaskBarStyle = {
    height: 0.6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: isDark ? '#404040' : '#e0e0e0',
    showProgress: props.showTaskProgress !== false,
    textStyle: {
      color: isDark ? '#ffffff' : '#000000',
      fontSize: 12,
      position: 'inside',
      showDuration: false,
      showProgress: false,
    },
    hoverStyle: {
      elevation: 2,
      opacity: 0.9,
    },
  };
  
  const taskBarStyle = { ...defaultTaskBarStyle, ...props.taskBarStyle };
  
  const defaultCategoryLabelStyle: CategoryLabelStyle = {
    width: props.categoryWidth || 120,
    backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
    textColor: isDark ? '#ffffff' : '#333333',
    fontSize: 12,
    fontWeight: 'normal',
    padding: [6, 12],
    borderRadius: 4,
    borderColor: isDark ? '#404040' : '#e0e0e0',
    borderWidth: 1,
    position: 'left',
    shape: 'rounded',
  };
  
  const categoryLabelStyle = { ...defaultCategoryLabelStyle, ...props.categoryLabelStyle };
  
  const defaultTimelineStyle: TimelineStyle = {
    position: 'top',
    showGrid: true,
    gridStyle: {
      color: isDark ? '#404040' : '#e9e9e9',
      width: 1,
      type: 'solid',
      opacity: 0.8,
    },
    tickStyle: {
      color: isDark ? '#666666' : '#999999',
      width: 1,
      length: 5,
    },
    labelStyle: {
      color: isDark ? '#cccccc' : '#666666',
      fontSize: 12,
      fontWeight: 'normal',
    },
  };
  
  const timelineStyle = { ...defaultTimelineStyle, ...props.timelineStyle };
  
  // Default status styles
  const defaultStatusStyles: StatusStyleMap = {
    'planned': {
      backgroundColor: isDark ? '#404040' : '#e0e0e0',
      color: isDark ? '#cccccc' : '#666666',
      borderColor: isDark ? '#666666' : '#cccccc',
    },
    'in-progress': {
      backgroundColor: '#4CAF50',
      color: '#ffffff',
      borderColor: '#45a049',
    },
    'completed': {
      backgroundColor: '#2196F3',
      color: '#ffffff',
      borderColor: '#1976D2',
    },
    'delayed': {
      backgroundColor: '#FF9800',
      color: '#ffffff',
      borderColor: '#F57C00',
    },
    'cancelled': {
      backgroundColor: '#f44336',
      color: '#ffffff',
      borderColor: '#d32f2f',
    },
  };
  
  const statusStyles = { ...defaultStatusStyles, ...props.statusStyles };
  
  // Default priority styles
  const defaultPriorityStyles: PriorityStyleMap = {
    'low': {
      backgroundColor: isDark ? '#2c3e50' : '#ecf0f1',
      borderColor: isDark ? '#34495e' : '#bdc3c7',
    },
    'medium': {
      backgroundColor: '#3498db',
      borderColor: '#2980b9',
    },
    'high': {
      backgroundColor: '#e67e22',
      borderColor: '#d35400',
    },
    'critical': {
      backgroundColor: '#e74c3c',
      borderColor: '#c0392b',
      glowColor: '#ff6b6b',
    },
  };
  
  const priorityStyles = { ...defaultPriorityStyles, ...props.priorityStyles };
  
  // Process tasks for rendering
  const processedTasks = tasks.map((task, taskIndex) => {
    const categoryIndex = categoryMap.get(task.category) ?? 0;
    const startTime = new Date(task.startTime).getTime();
    const endTime = new Date(task.endTime).getTime();
    
    // Determine task styling
    const statusStyle = task.status ? statusStyles[task.status] : null;
    const priorityStyle = task.priority ? priorityStyles[String(task.priority)] : null;
    const customStyle = task.style;
    
    // Final task color with priority: custom > status > priority > color prop > palette
    const taskColor = customStyle?.backgroundColor ||
      statusStyle?.backgroundColor ||
      priorityStyle?.backgroundColor ||
      task.color ||
      (props.colorPalette && props.colorPalette[taskIndex % props.colorPalette.length]) ||
      COLOR_PALETTES.default[taskIndex % COLOR_PALETTES.default.length];
      
    return {
      name: task.name,
      value: [
        categoryIndex,
        startTime,
        endTime,
        task.name,
        task.id,
        taskColor,
        task.progress || 0,
        task.status || '',
        task.priority || '',
        task.assignee || '',
      ],
      itemStyle: {
        color: taskColor,
        borderColor: customStyle?.borderColor || statusStyle?.borderColor || priorityStyle?.borderColor || taskBarStyle.borderColor,
        borderWidth: customStyle?.borderWidth || taskBarStyle.borderWidth,
        borderRadius: customStyle?.borderRadius || taskBarStyle.borderRadius,
        opacity: customStyle?.opacity,
      },
      emphasis: {
        itemStyle: {
          opacity: taskBarStyle.hoverStyle?.opacity || 1,
          borderColor: taskBarStyle.hoverStyle?.borderColor,
          borderWidth: taskBarStyle.hoverStyle?.borderWidth || (taskBarStyle.borderWidth! + 1),
        },
      },
    };
  });
  
  // Process categories for labels (currently unused but may be needed for future enhancements)
  // const processedCategories = categories.map((category, index) => ({
  //   name: category.name,
  //   value: [index, category.name, category.label || category.name],
  //   itemStyle: {
  //     color: category.color || categoryLabelStyle.backgroundColor,
  //     borderColor: category.style?.borderColor || categoryLabelStyle.borderColor,
  //     borderWidth: category.style?.borderWidth || categoryLabelStyle.borderWidth,
  //   },
  //   textStyle: {
  //     color: category.style?.textColor || categoryLabelStyle.textColor,
  //     fontSize: category.style?.fontSize || categoryLabelStyle.fontSize,
  //     fontWeight: category.style?.fontWeight || categoryLabelStyle.fontWeight,
  //   },
  // }));
  
  // Custom render function for task bars (simplified version)
  const renderTaskItem = (params: any, api: any) => {
    const categoryIndex = api.value(0);
    const startTime = api.value(1);
    const endTime = api.value(2);
    const _taskName = api.value(3); // Task name (unused in render but available)
    const _progress = api.value(6); // Progress (unused in current render but available)
    
    const timeStart = api.coord([startTime, categoryIndex]);
    const timeEnd = api.coord([endTime, categoryIndex]);
    
    const barLength = Math.max(timeEnd[0] - timeStart[0], 2);
    const barHeight = api.size([0, 1])[1] * (typeof taskBarStyle.height === 'number' ? taskBarStyle.height : 0.6);
    const x = timeStart[0];
    const y = timeStart[1] - barHeight / 2;
    
    return {
      type: 'rect',
      shape: { x, y, width: barLength, height: barHeight },
      style: {
        fill: api.style().fill,
        stroke: api.style().stroke,
        lineWidth: api.style().lineWidth,
      },
    };
  };
  
  // Build data zoom configuration
  const dataZoomConfig = [];
  if (props.dataZoom !== false) {
    const zoomConfig = typeof props.dataZoom === 'boolean' ? {} : (props.dataZoom || {});
    const showSlider = zoomConfig.type === 'slider' || zoomConfig.type === 'both' || zoomConfig.show !== false;
    
    if (showSlider) {
      dataZoomConfig.push({
        type: 'slider',
        xAxisIndex: 0,
        height: zoomConfig.height || 20,
        bottom: 0,
        start: 0,
        end: 50,
      });
    }
  }
  
  // Add today marker if enabled
  const todayMarkerSeries: any[] = [];
  if (props.todayMarker) {
    const todayConfig = typeof props.todayMarker === 'boolean' ? {} : props.todayMarker;
    const today = new Date().getTime();
    
    todayMarkerSeries.push({
      type: 'line' as const,
      markLine: {
        silent: true,
        symbol: 'none',
        data: [{ xAxis: today }],
        lineStyle: {
          color: todayConfig.color || '#ff4444',
          width: todayConfig.width || 2,
          type: todayConfig.style || 'dashed',
        },
      },
    });
  }
  
  return {
    ...baseOption,
    grid: {
      show: timelineStyle.showGrid || false,
      left: (categoryLabelStyle.width! + 20) || 140,
      right: 20,
      top: timelineStyle.position === 'top' ? 60 : 20,
      bottom: (props.dataZoom !== false ? 40 : 20) + (timelineStyle.position === 'bottom' ? 40 : 0),
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      borderWidth: 0,
    },
    xAxis: {
      type: 'time',
      position: timelineStyle.position || 'top',
      splitLine: {
        show: timelineStyle.showGrid || false,
        lineStyle: {
          color: timelineStyle.gridStyle?.color || (isDark ? '#404040' : '#e9e9e9'),
          width: timelineStyle.gridStyle?.width || 1,
          type: timelineStyle.gridStyle?.type || 'solid',
          opacity: timelineStyle.gridStyle?.opacity || 0.8,
        },
      },
      ...(props.timeRange && {
        min: new Date(props.timeRange[0]).getTime(),
        max: new Date(props.timeRange[1]).getTime(),
      }),
    },
    yAxis: {
      type: 'category',
      data: categories.map(cat => cat.label || cat.name),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
      inverse: true,
    },
    ...(dataZoomConfig.length > 0 && { dataZoom: dataZoomConfig }),
    series: [
      // Main task series
      {
        type: 'custom',
        renderItem: renderTaskItem,
        encode: {
          x: [1, 2],
          y: 0,
          tooltip: [0, 1, 2, 3, 4],
        },
        data: processedTasks,
        z: 10,
      },
      ...todayMarkerSeries,
    ],
    tooltip: props.tooltip ? buildTooltipOption(props.tooltip, props.theme) : {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.seriesIndex === 0) {
          const [categoryIndex, startTime, endTime, taskName, _taskId] = params.value;
          const start = new Date(startTime).toLocaleString();
          const end = new Date(endTime).toLocaleString();
          const duration = Math.round((endTime - startTime) / (1000 * 60 * 60 * 24 * 10)) / 100;
          const category = categories[categoryIndex]?.name || 'Unknown';
          
          return `
            <strong>${taskName}</strong><br/>
            Category: ${category}<br/>
            Start: ${start}<br/>
            End: ${end}<br/>
            Duration: ${duration} days
          `;
        }
        return '';
      },
    },
    legend: props.legend ? buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme) : undefined,
    ...props.customOption,
  };
}