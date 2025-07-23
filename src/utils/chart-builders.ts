// This file re-exports chart builders from individual modules

import { COLOR_PALETTES } from './color-palettes';
import {
  isObjectData,
  groupDataByField,
  detectDataType,
  mapStrokeStyleToECharts,
} from './data-processing';
import {
  buildBaseOption,
  buildAxisOption,
  buildLegendOption,
  calculateGridSpacing,
  buildTooltipOption,
} from './base-options';

// Re-export everything from the other modules for convenience
export { COLOR_PALETTES } from './color-palettes';
export {
  isObjectData,
  groupDataByField,
  detectDataType,
  mapStrokeStyleToECharts,
} from './data-processing';
export {
  buildBaseOption,
  buildAxisOption,
  buildLegendOption,
  calculateGridSpacing,
  generateChartKey,
  buildTooltipOption,
} from './base-options';

// Re-export basic chart builders from individual files  
export { buildLineChartOption } from './chart-builders/line-chart';
export { buildBarChartOption } from './chart-builders/bar-chart';
export { buildPieChartOption } from './chart-builders/pie-chart';
export { buildScatterChartOption } from './chart-builders/scatter-chart';
export { buildGanttChartOption } from './chart-builders/gantt-chart';

// Re-export advanced chart builders from individual files
export { buildClusterChartOption } from './chart-builders/cluster-chart';
export { buildCalendarHeatmapOption } from './chart-builders/calendar-heatmap-chart';
export { buildRegressionChartOption } from './chart-builders/regression-chart';
export { buildSankeyChartOption } from './chart-builders/sankey-chart';