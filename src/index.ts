// Components
export { BaseChart } from './components/BaseChart';
export { LineChart } from './components/LineChart';
export { BarChart } from './components/BarChart';
export { PieChart } from './components/PieChart';
export { ScatterChart } from './components/ScatterChart';
export { ClusterChart } from './components/ClusterChart';
export { CalendarHeatmapChart } from './components/CalendarHeatmapChart';
export { SankeyChart } from './components/SankeyChart';
export { GanttChart } from './components/GanttChart';
export { RegressionChart } from './components/RegressionChart';

// Legacy components (old API)
export { OldCalendarHeatmapChart } from './components/legacy/OldCalendarHeatmapChart';
export { OldStackedBarChart } from './components/legacy/OldStackedBarChart';
export { OldSankeyChart } from './components/legacy/OldSankeyChart';
export { OldScatterChart } from './components/legacy/OldScatterChart';
export { OldClusterChart } from './components/legacy/OldClusterChart';
export { OldRegressionChart } from './components/legacy/OldRegressionChart';
export { OldGanttChart } from './components/legacy/OldGanttChart';
export { OldLineChart } from './components/legacy/OldLineChart';
export { OldBarChart } from './components/legacy/OldBarChart';
export { OldPieChart } from './components/legacy/OldPieChart';

// Hooks
export { useECharts } from './hooks/useECharts';

// Individual chart hooks (advanced usage)
export { 
    useChartInstance,
    useChartResize,
    useChartOptions,
    useChartEvents
} from './hooks/echarts';

// Utils
export { lightTheme, darkTheme } from './utils/themes';
export {
    extractPoints,
    performKMeansClustering,
    clusterPointsToScatterData
} from './utils/legacy/regression';

// Date formatting utilities
export { formatDateForChart, looksLikeDate, detectAxisType, preprocessDateFields } from './utils/dateFormatting';
export type { DateFormatType } from './utils/dateFormatting';

// Error handling utilities
export {
    ChartError,
    EChartsLoadError,
    ChartInitError,
    DataValidationError,
    ChartRenderError,
    TransformError,
    ChartErrorCode,
    createChartError,
    isChartError,
    isRecoverableError,
    safeAsync,
    safeSync
} from './utils/errors';

export {
    ChartErrorBoundary,
    withChartErrorBoundary,
    useChartErrorHandler
} from './components/ChartErrorBoundary';

export {
    validateChartData,
    validateChartProps,
    validateFieldMapping,
    validateDimensions,
    validateTheme,
    assertValidation,
    validateInDevelopment
} from './utils/validation';

// Types
export type {
    EChartsInstance,
    ChartDataPoint,
    ChartSeries,
    ChartAxis,
    ChartTheme,
    BaseChartProps,
    ChartRef,
    CalendarHeatmapDataPoint,
    CalendarConfig,
    VisualMapConfig,
    StackedBarData,
    StackedBarDataSeries,
    SankeyData,
    LineStyleConfig,
    LegendConfig,
    TooltipConfig,
    // Scatter chart types
    ScatterDataPoint,
    ScatterSeries,
    ScatterChartData,
    ClusterPoint,
    ClusterResult,
    // Cluster chart types
    ClusterChartData,
    ClusterChartDataPoint,
    ClusterVisualMapPiece,
    // Regression chart types
    RegressionChartData,
    RegressionChartDataPoint,
    RegressionMethod,
    // ecStat Transform types
    DataTransformOption,
    EcStatClusteringTransformOption,
    EcStatRegressionTransformOption,
    EcStatTransformOption,
    DatasetOptionWithTransforms,
    // ECharts series types
    EChartsOption,
    SeriesOption,
    BarSeriesOption,
    LineSeriesOption,
    PieSeriesOption,
    HeatmapSeriesOption,
    ScatterSeriesOption,
    TitleOption,
    LegendComponentOption,
    TooltipOption,
    XAXisOption,
    YAXisOption,
    VisualMapComponentOption,
    CalendarOption,
} from './types';

// New component types (from ergonomic types)
export type { 
    LineChartProps, 
    BarChartProps, 
    PieChartProps,
    ScatterChartProps,
    ClusterChartProps,
    CalendarHeatmapProps,
    SankeyChartProps,
    SankeyNode,
    SankeyLink,
    GanttChartProps,
    GanttTask,
    GanttCategory,
    TaskBarStyle,
    CategoryLabelStyle,
    TimelineStyle,
    StatusStyleMap,
    PriorityStyleMap,
    GanttDataZoomConfig,
    RegressionChartProps
} from './types';

// Legacy component types
export type { OldLineChartProps } from './components/legacy/OldLineChart';
export type { OldBarChartProps } from './components/legacy/OldBarChart';
export type { OldPieChartProps } from './components/legacy/OldPieChart';
export type { OldCalendarHeatmapChartProps } from './components/legacy/OldCalendarHeatmapChart';
export type { OldStackedBarChartProps } from './components/legacy/OldStackedBarChart';
export type { OldSankeyChartProps } from './components/legacy/OldSankeyChart';
export type { OldScatterChartProps } from './components/legacy/OldScatterChart';
export type { OldClusterChartProps } from './components/legacy/OldClusterChart';
export type { OldRegressionChartProps } from './components/legacy/OldRegressionChart';
export type { OldGanttChartProps } from './components/legacy/OldGanttChart';

// Ergonomic types (now the main types)
export type {
    BaseErgonomicChartProps,
    DataPoint,
    AxisConfig,
    ScatterChartProps as ErgonomicScatterChartProps,
    AreaChartProps,
    ErgonomicChartRef
} from './types';

// CSS injection for styling (optimized for modern bundlers)
if (typeof document !== 'undefined' && !document.getElementById('aqc-charts-styles')) {
    const style = document.createElement('style');
    style.id = 'aqc-charts-styles';
    style.textContent = `
    @keyframes aqc-charts-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .aqc-charts-container {
      box-sizing: border-box;
    }
    
    .aqc-charts-loading {
      backdrop-filter: blur(2px);
    }
    
    .aqc-charts-error {
      border: 1px dashed #ff4d4f;
      border-radius: 4px;
    }
    
    .aqc-charts-spinner {
      animation: spin 1s linear infinite;
    }
  `;
    document.head.appendChild(style);
}