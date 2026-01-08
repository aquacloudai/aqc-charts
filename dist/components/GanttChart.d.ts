import React from 'react';
import type { GanttChartProps, ErgonomicChartRef } from '@/types';
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
declare const GanttChart: React.ForwardRefExoticComponent<GanttChartProps & React.RefAttributes<ErgonomicChartRef>>;
export { GanttChart };
export type { GanttChartProps };
//# sourceMappingURL=GanttChart.d.ts.map