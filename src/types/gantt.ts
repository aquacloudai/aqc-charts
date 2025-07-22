import type { BaseErgonomicChartProps, DataPoint } from './base';
import type { LegendConfig, TooltipConfig } from './config';

// Task data structure for Gantt charts
export interface GanttTask {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly startTime: Date | string | number;
  readonly endTime: Date | string | number;
  readonly color?: string;
  readonly status?: 'planned' | 'in-progress' | 'completed' | 'delayed' | 'cancelled' | string;
  readonly priority?: 'low' | 'medium' | 'high' | 'critical' | number;
  readonly progress?: number; // 0-100 percentage
  readonly assignee?: string;
  readonly description?: string;
  readonly tags?: readonly string[];
  readonly dependencies?: readonly string[]; // Task IDs that this task depends on
  // Custom styling for individual tasks
  readonly style?: {
    readonly backgroundColor?: string;
    readonly borderColor?: string;
    readonly borderWidth?: number;
    readonly borderRadius?: number;
    readonly textColor?: string;
    readonly fontSize?: number;
    readonly opacity?: number;
    readonly pattern?: 'solid' | 'striped' | 'dotted' | 'dashed';
  };
}

// Category data structure for Gantt charts
export interface GanttCategory {
  readonly name: string;
  readonly label?: string;
  readonly color?: string;
  readonly group?: string; // For grouping categories
  readonly order?: number; // For custom ordering
  readonly style?: {
    readonly backgroundColor?: string;
    readonly textColor?: string;
    readonly fontSize?: number;
    readonly fontWeight?: 'normal' | 'bold' | number;
    readonly borderColor?: string;
    readonly borderWidth?: number;
  };
}

// Task bar styling configuration
export interface TaskBarStyle {
  readonly height?: number | string; // Height of task bars (0-1 as ratio, or px value)
  readonly borderRadius?: number;
  readonly borderWidth?: number;
  readonly borderColor?: string;
  readonly showProgress?: boolean; // Show progress bars within tasks
  readonly progressStyle?: {
    readonly backgroundColor?: string;
    readonly opacity?: number;
    readonly pattern?: 'solid' | 'striped';
  };
  readonly textStyle?: {
    readonly color?: string;
    readonly fontSize?: number;
    readonly fontWeight?: 'normal' | 'bold' | number;
    readonly position?: 'inside' | 'outside' | 'auto';
    readonly showDuration?: boolean;
    readonly showProgress?: boolean;
  };
  readonly hoverStyle?: {
    readonly backgroundColor?: string;
    readonly borderColor?: string;
    readonly borderWidth?: number;
    readonly opacity?: number;
    readonly elevation?: number; // Shadow/elevation effect
  };
}

// Category label styling configuration
export interface CategoryLabelStyle {
  readonly width?: number;
  readonly backgroundColor?: string;
  readonly textColor?: string;
  readonly fontSize?: number;
  readonly fontWeight?: 'normal' | 'bold' | number;
  readonly padding?: number | readonly [number, number] | readonly [number, number, number, number];
  readonly borderRadius?: number;
  readonly borderColor?: string;
  readonly borderWidth?: number;
  readonly position?: 'left' | 'right';
  readonly shape?: 'rectangle' | 'rounded' | 'pill' | 'arrow' | 'custom';
  readonly customShape?: string; // SVG path for custom shapes
  readonly showGroupHeaders?: boolean;
  readonly groupHeaderStyle?: {
    readonly backgroundColor?: string;
    readonly textColor?: string;
    readonly fontSize?: number;
    readonly fontWeight?: 'normal' | 'bold' | number;
  };
}

// Timeline axis styling configuration
export interface TimelineStyle {
  readonly position?: 'top' | 'bottom';
  readonly showGrid?: boolean;
  readonly gridStyle?: {
    readonly color?: string;
    readonly width?: number;
    readonly type?: 'solid' | 'dashed' | 'dotted';
    readonly opacity?: number;
  };
  readonly tickStyle?: {
    readonly color?: string;
    readonly width?: number;
    readonly length?: number;
  };
  readonly labelStyle?: {
    readonly color?: string;
    readonly fontSize?: number;
    readonly fontWeight?: 'normal' | 'bold' | number;
    readonly rotate?: number;
    readonly format?: string | ((date: Date) => string);
  };
  readonly zoomLevels?: readonly ('hour' | 'day' | 'week' | 'month' | 'quarter' | 'year')[];
}

// Status and priority styling maps
export interface StatusStyleMap {
  readonly [status: string]: {
    readonly color?: string;
    readonly backgroundColor?: string;
    readonly borderColor?: string;
    readonly pattern?: 'solid' | 'striped' | 'dotted' | 'dashed';
    readonly opacity?: number;
  };
}

export interface PriorityStyleMap {
  readonly [priority: string]: {
    readonly color?: string;
    readonly backgroundColor?: string;
    readonly borderColor?: string;
    readonly borderWidth?: number;
    readonly glowColor?: string; // For high priority tasks
  };
}

// Data zoom configuration for Gantt charts
export interface GanttDataZoomConfig {
  readonly show?: boolean;
  readonly type?: 'slider' | 'inside' | 'both';
  readonly position?: 'top' | 'bottom';
  readonly height?: number;
  readonly backgroundColor?: string;
  readonly borderColor?: string;
  readonly handleStyle?: {
    readonly color?: string;
    readonly borderColor?: string;
  };
  readonly dataBackground?: {
    readonly lineStyle?: {
      readonly color?: string;
      readonly width?: number;
    };
    readonly areaStyle?: {
      readonly color?: string;
      readonly opacity?: number;
    };
  };
}

// Gantt Chart Props
export interface GanttChartProps extends BaseErgonomicChartProps {
  readonly data: readonly DataPoint[] | { readonly tasks: readonly GanttTask[]; readonly categories: readonly GanttCategory[] };
  
  // Field mappings for flat data structure
  readonly idField?: string | undefined;
  readonly nameField?: string | undefined;
  readonly categoryField?: string | undefined;
  readonly startTimeField?: string | undefined;
  readonly endTimeField?: string | undefined;
  readonly colorField?: string | undefined;
  readonly statusField?: string | undefined;
  readonly priorityField?: string | undefined;
  readonly progressField?: string | undefined;
  readonly assigneeField?: string | undefined;
  
  // Manual tasks and categories (alternative to data)
  readonly tasks?: readonly GanttTask[] | undefined;
  readonly categories?: readonly GanttCategory[] | undefined;
  
  // Layout and spacing
  readonly categoryWidth?: number | undefined; // Width of the category column
  readonly taskHeight?: number | string | undefined; // Height of task bars (0-1 ratio or px)
  readonly categorySpacing?: number | undefined; // Spacing between categories
  readonly groupSpacing?: number | undefined; // Extra spacing between category groups
  
  // Task bar styling
  readonly taskBarStyle?: TaskBarStyle | undefined;
  readonly statusStyles?: StatusStyleMap | undefined;
  readonly priorityStyles?: PriorityStyleMap | undefined;
  
  // Category styling
  readonly categoryLabelStyle?: CategoryLabelStyle | undefined;
  readonly showCategoryLabels?: boolean | undefined;
  readonly categoryColors?: readonly string[] | undefined;
  
  // Timeline styling  
  readonly timelineStyle?: TimelineStyle | undefined;
  readonly timeRange?: readonly [Date | string | number, Date | string | number] | undefined; // Custom time range
  readonly timeFormat?: string | ((date: Date) => string) | undefined; // Time label formatting
  
  // Zoom and navigation
  readonly dataZoom?: GanttDataZoomConfig | boolean | undefined;
  readonly allowPan?: boolean | undefined;
  readonly allowZoom?: boolean | undefined;
  readonly initialZoomLevel?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' | undefined;
  
  // Interactions
  readonly draggable?: boolean | undefined; // Allow dragging tasks to change dates
  readonly resizable?: boolean | undefined; // Allow resizing tasks to change duration
  readonly selectable?: boolean | undefined; // Allow selecting tasks
  readonly showTaskTooltips?: boolean | undefined;
  readonly showDependencies?: boolean | undefined; // Show dependency lines between tasks
  
  // Milestones and markers
  readonly showMilestones?: boolean | undefined;
  readonly milestoneStyle?: {
    readonly shape?: 'diamond' | 'circle' | 'triangle' | 'star';
    readonly size?: number;
    readonly color?: string;
    readonly borderColor?: string;
    readonly borderWidth?: number;
  } | undefined;
  readonly todayMarker?: boolean | {
    readonly show?: boolean;
    readonly color?: string;
    readonly width?: number;
    readonly style?: 'solid' | 'dashed' | 'dotted';
  } | undefined;
  
  // Progress and status
  readonly showProgress?: boolean | undefined; // Show overall project progress
  readonly showTaskProgress?: boolean | undefined; // Show individual task progress
  readonly progressStyle?: {
    readonly backgroundColor?: string;
    readonly color?: string;
    readonly opacity?: number;
    readonly showPercentage?: boolean;
  } | undefined;
  
  // Grouping and filtering
  readonly groupByCategory?: boolean | undefined;
  readonly groupByAssignee?: boolean | undefined;
  readonly filterByStatus?: readonly string[] | undefined;
  readonly filterByPriority?: readonly (string | number)[] | undefined;
  readonly sortBy?: 'startTime' | 'endTime' | 'priority' | 'category' | 'name' | undefined;
  readonly sortOrder?: 'asc' | 'desc' | undefined;
  
  // Events
  readonly onTaskClick?: ((task: GanttTask, event: any) => void) | undefined;
  readonly onTaskDrag?: ((task: GanttTask, newStartTime: Date, newEndTime: Date) => void) | undefined;
  readonly onTaskResize?: ((task: GanttTask, newStartTime: Date, newEndTime: Date) => void) | undefined;
  readonly onCategoryClick?: ((category: GanttCategory, event: any) => void) | undefined;
  readonly onTimeRangeChange?: ((startTime: Date, endTime: Date) => void) | undefined;
  
  // Legend and tooltip
  readonly legend?: LegendConfig | undefined;
  readonly tooltip?: TooltipConfig | undefined;
}