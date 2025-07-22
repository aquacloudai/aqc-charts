import type { BaseErgonomicChartProps, DataPoint } from './base';
import type { LegendConfig, TooltipConfig } from './config';
export interface GanttTask {
    readonly id: string;
    readonly name: string;
    readonly category: string;
    readonly startTime: Date | string | number;
    readonly endTime: Date | string | number;
    readonly color?: string;
    readonly status?: 'planned' | 'in-progress' | 'completed' | 'delayed' | 'cancelled' | string;
    readonly priority?: 'low' | 'medium' | 'high' | 'critical' | number;
    readonly progress?: number;
    readonly assignee?: string;
    readonly description?: string;
    readonly tags?: readonly string[];
    readonly dependencies?: readonly string[];
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
export interface GanttCategory {
    readonly name: string;
    readonly label?: string;
    readonly color?: string;
    readonly group?: string;
    readonly order?: number;
    readonly style?: {
        readonly backgroundColor?: string;
        readonly textColor?: string;
        readonly fontSize?: number;
        readonly fontWeight?: 'normal' | 'bold' | number;
        readonly borderColor?: string;
        readonly borderWidth?: number;
    };
}
export interface TaskBarStyle {
    readonly height?: number | string;
    readonly borderRadius?: number;
    readonly borderWidth?: number;
    readonly borderColor?: string;
    readonly showProgress?: boolean;
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
        readonly elevation?: number;
    };
}
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
    readonly customShape?: string;
    readonly showGroupHeaders?: boolean;
    readonly groupHeaderStyle?: {
        readonly backgroundColor?: string;
        readonly textColor?: string;
        readonly fontSize?: number;
        readonly fontWeight?: 'normal' | 'bold' | number;
    };
}
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
        readonly glowColor?: string;
    };
}
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
export interface GanttChartProps extends BaseErgonomicChartProps {
    readonly data: readonly DataPoint[] | {
        readonly tasks: readonly GanttTask[];
        readonly categories: readonly GanttCategory[];
    };
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
    readonly tasks?: readonly GanttTask[] | undefined;
    readonly categories?: readonly GanttCategory[] | undefined;
    readonly categoryWidth?: number | undefined;
    readonly taskHeight?: number | string | undefined;
    readonly categorySpacing?: number | undefined;
    readonly groupSpacing?: number | undefined;
    readonly taskBarStyle?: TaskBarStyle | undefined;
    readonly statusStyles?: StatusStyleMap | undefined;
    readonly priorityStyles?: PriorityStyleMap | undefined;
    readonly categoryLabelStyle?: CategoryLabelStyle | undefined;
    readonly showCategoryLabels?: boolean | undefined;
    readonly categoryColors?: readonly string[] | undefined;
    readonly timelineStyle?: TimelineStyle | undefined;
    readonly timeRange?: readonly [Date | string | number, Date | string | number] | undefined;
    readonly timeFormat?: string | ((date: Date) => string) | undefined;
    readonly dataZoom?: GanttDataZoomConfig | boolean | undefined;
    readonly allowPan?: boolean | undefined;
    readonly allowZoom?: boolean | undefined;
    readonly initialZoomLevel?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' | undefined;
    readonly draggable?: boolean | undefined;
    readonly resizable?: boolean | undefined;
    readonly selectable?: boolean | undefined;
    readonly showTaskTooltips?: boolean | undefined;
    readonly showDependencies?: boolean | undefined;
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
    readonly showProgress?: boolean | undefined;
    readonly showTaskProgress?: boolean | undefined;
    readonly progressStyle?: {
        readonly backgroundColor?: string;
        readonly color?: string;
        readonly opacity?: number;
        readonly showPercentage?: boolean;
    } | undefined;
    readonly groupByCategory?: boolean | undefined;
    readonly groupByAssignee?: boolean | undefined;
    readonly filterByStatus?: readonly string[] | undefined;
    readonly filterByPriority?: readonly (string | number)[] | undefined;
    readonly sortBy?: 'startTime' | 'endTime' | 'priority' | 'category' | 'name' | undefined;
    readonly sortOrder?: 'asc' | 'desc' | undefined;
    readonly onTaskClick?: ((task: GanttTask, event: any) => void) | undefined;
    readonly onTaskDrag?: ((task: GanttTask, newStartTime: Date, newEndTime: Date) => void) | undefined;
    readonly onTaskResize?: ((task: GanttTask, newStartTime: Date, newEndTime: Date) => void) | undefined;
    readonly onCategoryClick?: ((category: GanttCategory, event: any) => void) | undefined;
    readonly onTimeRangeChange?: ((startTime: Date, endTime: Date) => void) | undefined;
    readonly legend?: LegendConfig | undefined;
    readonly tooltip?: TooltipConfig | undefined;
}
//# sourceMappingURL=gantt.d.ts.map