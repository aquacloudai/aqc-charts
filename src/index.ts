// Components
export { BaseChart } from './components/BaseChart';
export { LineChart } from './components/LineChart';
export { BarChart } from './components/BarChart';
export { PieChart } from './components/PieChart';
export { CalendarHeatmapChart } from './components/CalendarHeatmapChart';
export { StackedBarChart } from './components/StackedBarChart';
export { SankeyChart } from './components/SankeyChart';
export { ScatterChart } from './components/ScatterChart';
export { ClusterChart } from './components/ClusterChart';
export { RegressionChart } from './components/RegressionChart';
export { GanttChart } from './components/GanttChart';

// Hooks
export { useECharts } from './hooks/useECharts';

// Utils
export { lightTheme, darkTheme } from './utils/themes';
export {
    extractPoints,
    performKMeansClustering,
    clusterPointsToScatterData
} from './utils/regression';

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
    SankeyNode,
    SankeyLink,
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

export type { LineChartProps } from './components/LineChart';
export type { BarChartProps } from './components/BarChart';
export type { PieChartProps } from './components/PieChart';
export type { CalendarHeatmapChartProps } from './components/CalendarHeatmapChart';
export type { StackedBarChartProps } from './components/StackedBarChart';
export type { SankeyChartProps } from './components/SankeyChart';
export type { ScatterChartProps } from './components/ScatterChart';
export type { ClusterChartProps } from './components/ClusterChart';
export type { RegressionChartProps } from './components/RegressionChart';
export type { GanttChartProps } from './components/GanttChart';

// CSS injection for styling (optimized for modern bundlers)
if (typeof document !== 'undefined' && !document.getElementById('aqc-charts-styles')) {
    const style = document.createElement('style');
    style.id = 'aqc-charts-styles';
    style.textContent = `
    @keyframes aqc-charts-spin {
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
  `;
    document.head.appendChild(style);
}