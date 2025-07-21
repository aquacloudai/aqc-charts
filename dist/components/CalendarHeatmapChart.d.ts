import type { CalendarHeatmapProps, ErgonomicChartRef } from '@/types/ergonomic';
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
declare const CalendarHeatmapChart: import("react").ForwardRefExoticComponent<CalendarHeatmapProps & import("react").RefAttributes<ErgonomicChartRef>>;
export { CalendarHeatmapChart };
//# sourceMappingURL=CalendarHeatmapChart.d.ts.map