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
 *   onTaskClick={(task) => console.log('Task clicked:', task)}
 * />
 */
declare const GanttChart: import("react").ForwardRefExoticComponent<GanttChartProps & import("react").RefAttributes<ErgonomicChartRef>>;
export { GanttChart };
export type { GanttChartProps };
//# sourceMappingURL=GanttChart.d.ts.map