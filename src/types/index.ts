// Re-export ECharts types directly
export type {
    EChartsOption,
    SeriesOption,
    TitleOption,
    LegendComponentOption,
    TooltipOption,
    XAXisOption,
    YAXisOption,
    VisualMapComponentOption,
    CalendarOption,
    BarSeriesOption,
    LineSeriesOption,
    PieSeriesOption,
    HeatmapSeriesOption,
    ScatterSeriesOption
} from 'echarts/types/dist/shared';

// ECharts instance interface
export interface EChartsInstance {
    setOption: (option: unknown, notMerge?: boolean, lazyUpdate?: boolean) => void;
    getOption: () => unknown;
    resize: (opts?: { width?: number; height?: number }) => void;
    dispatchAction: (payload: unknown) => void;
    on: (eventName: string, handler: (...args: unknown[]) => void) => void;
    off: (eventName: string, handler?: (...args: unknown[]) => void) => void;
    dispose: () => void;
    showLoading: (type?: string, opts?: unknown) => void;
    hideLoading: () => void;
    getDataURL: (opts?: unknown) => string;
    getConnectedDataURL: (opts?: unknown) => string;
}

export interface BaseChartProps {
    // Core props - just the essentials for easy chart creation
    readonly title?: string;
    readonly width?: number | string;
    readonly height?: number | string;

    // Behavior props
    readonly theme?: 'light' | 'dark';
    readonly loading?: boolean;
    readonly notMerge?: boolean;
    readonly lazyUpdate?: boolean;

    // Event handlers
    readonly onChartReady?: (chart: EChartsInstance) => void;
    readonly onClick?: (params: unknown, chart: EChartsInstance) => void;
    readonly onDoubleClick?: (params: unknown, chart: EChartsInstance) => void;
    readonly onMouseOver?: (params: unknown, chart: EChartsInstance) => void;
    readonly onMouseOut?: (params: unknown, chart: EChartsInstance) => void;
    readonly onDataZoom?: (params: unknown, chart: EChartsInstance) => void;
    readonly onBrush?: (params: unknown, chart: EChartsInstance) => void;

    // Style props
    readonly className?: string;
    readonly style?: React.CSSProperties;

    // Main configuration - use full ECharts option object
    readonly option: import('echarts/types/dist/shared').EChartsOption;
    readonly renderer?: 'canvas' | 'svg';
    readonly locale?: string;
}

// Add back simple compatibility types for existing components
export interface ChartDataPoint {
    readonly name: string;
    readonly value: number | readonly number[];
    readonly itemStyle?: unknown;
    readonly label?: unknown;
    readonly emphasis?: unknown;
    readonly [key: string]: unknown;
}

export interface ChartSeries {
    readonly name: string;
    readonly type: 'line' | 'bar' | 'pie' | 'scatter' | 'radar' | 'funnel' | 'gauge' | 'heatmap' | 'sankey';
    readonly data: readonly (number | ChartDataPoint)[];
    readonly color?: string;
    readonly [key: string]: unknown;
}

// Import the specific types we need
import type {
    XAXisOption as ImportedXAXisOption,
    YAXisOption as ImportedYAXisOption,
    LegendComponentOption as ImportedLegendComponentOption,
    TooltipOption as ImportedTooltipOption,
    VisualMapComponentOption as ImportedVisualMapComponentOption,
    CalendarOption as ImportedCalendarOption,
} from 'echarts/types/dist/shared';

export type ChartAxis = ImportedXAXisOption | ImportedYAXisOption;
export type ChartTheme = { readonly color?: readonly string[]; readonly [key: string]: unknown };
export type LegendConfig = ImportedLegendComponentOption;
export type TooltipConfig = ImportedTooltipOption;
export type VisualMapConfig = ImportedVisualMapComponentOption;
export type CalendarConfig = ImportedCalendarOption;
export type LineStyleConfig = { readonly type?: string; readonly width?: number; readonly color?: string; readonly opacity?: number };

export interface ChartRef {
    getEChartsInstance: () => EChartsInstance | null;
    refresh: () => void;
}

// Convenience interfaces for specific chart types
export interface CalendarHeatmapDataPoint {
    readonly date: string; // YYYY-MM-DD format
    readonly value: number;
}

export interface StackedBarDataSeries {
    readonly name: string;
    readonly data: readonly number[];
    readonly color?: string;
}

export interface StackedBarData {
    readonly categories: readonly string[];
    readonly series: readonly StackedBarDataSeries[];
}

export interface SankeyNode {
    readonly name: string;
    readonly value?: number;
    readonly depth?: number;
    readonly itemStyle?: unknown;
    readonly label?: unknown;
    readonly emphasis?: unknown;
}

export interface SankeyLink {
    readonly source: string | number;
    readonly target: string | number;
    readonly value: number;
    readonly lineStyle?: unknown;
    readonly emphasis?: unknown;
}

export interface SankeyData {
    readonly nodes: readonly SankeyNode[];
    readonly links: readonly SankeyLink[];
}

// Scatter chart specific types
export interface ScatterDataPoint {
    readonly value: readonly [number, number] | readonly [number, number, number]; // [x, y] or [x, y, size]
    readonly name?: string;
    readonly itemStyle?: unknown;
    readonly label?: unknown;
    readonly emphasis?: unknown;
    readonly symbolSize?: number | readonly number[];
    readonly symbol?: string;
    readonly [key: string]: unknown;
}

export interface ScatterSeries {
    readonly name: string;
    readonly type: 'scatter';
    readonly data: readonly ScatterDataPoint[];
    readonly color?: string;
    readonly symbolSize?: number | readonly number[] | ((value: readonly number[], params: unknown) => number);
    readonly symbol?: string;
    readonly itemStyle?: unknown;
    readonly label?: unknown;
    readonly emphasis?: unknown;
    readonly large?: boolean;
    readonly largeThreshold?: number;
    readonly progressive?: number;
    readonly progressiveThreshold?: number;
    readonly [key: string]: unknown;
}


export interface ClusterPoint {
    readonly x: number;
    readonly y: number;
    readonly cluster?: number;
    readonly name?: string;
    readonly [key: string]: unknown;
}

export interface ClusterResult {
    readonly points: readonly ClusterPoint[];
    readonly centroids: readonly [number, number][];
    readonly clusters: number;
}

// Scatter chart data structure
export interface ScatterChartData {
    readonly series: readonly ScatterSeries[];
    readonly xAxis?: {
        readonly name?: string;
        readonly type?: 'value' | 'category' | 'time' | 'log';
        readonly min?: number | string;
        readonly max?: number | string;
        readonly scale?: boolean;
        readonly [key: string]: unknown;
    };
    readonly yAxis?: {
        readonly name?: string;
        readonly type?: 'value' | 'category' | 'time' | 'log';
        readonly min?: number | string;
        readonly max?: number | string;
        readonly scale?: boolean;
        readonly [key: string]: unknown;
    };
}

// Cluster chart specific types
export interface ClusterChartDataPoint {
    readonly value: readonly [number, number]; // [x, y] coordinates
    readonly name?: string;
    readonly [key: string]: unknown;
}

export interface ClusterChartData {
    readonly data: readonly ClusterChartDataPoint[];
    readonly xAxis?: {
        readonly name?: string;
        readonly type?: 'value' | 'category' | 'time' | 'log';
        readonly min?: number | string;
        readonly max?: number | string;
        readonly scale?: boolean;
        readonly [key: string]: unknown;
    };
    readonly yAxis?: {
        readonly name?: string;
        readonly type?: 'value' | 'category' | 'time' | 'log';
        readonly min?: number | string;
        readonly max?: number | string;
        readonly scale?: boolean;
        readonly [key: string]: unknown;
    };
}

export interface ClusterVisualMapPiece {
    readonly value: number;
    readonly label: string;
    readonly color: string;
}

// Regression chart specific types
export interface RegressionChartDataPoint {
    readonly value: readonly [number, number]; // [x, y] coordinates
    readonly name?: string;
    readonly [key: string]: unknown;
}

export interface RegressionChartData {
    readonly data: readonly RegressionChartDataPoint[];
    readonly xAxis?: {
        readonly name?: string;
        readonly type?: 'value' | 'category' | 'time' | 'log';
        readonly min?: number | string;
        readonly max?: number | string;
        readonly scale?: boolean;
        readonly splitLine?: {
            readonly lineStyle?: {
                readonly type?: 'solid' | 'dashed' | 'dotted';
                readonly [key: string]: unknown;
            };
            readonly [key: string]: unknown;
        };
        readonly [key: string]: unknown;
    };
    readonly yAxis?: {
        readonly name?: string;
        readonly type?: 'value' | 'category' | 'time' | 'log';
        readonly min?: number | string;
        readonly max?: number | string;
        readonly scale?: boolean;
        readonly splitLine?: {
            readonly lineStyle?: {
                readonly type?: 'solid' | 'dashed' | 'dotted';
                readonly [key: string]: unknown;
            };
            readonly [key: string]: unknown;
        };
        readonly [key: string]: unknown;
    };
}

export type RegressionMethod = 'linear' | 'exponential' | 'logarithmic' | 'polynomial';

// ECharts ecStat Transform Types
export interface DataTransformOption {
    readonly type: string;
    readonly config?: unknown;
    readonly print?: boolean;
}

// ecStat Clustering Transform
export interface EcStatClusteringTransformOption extends DataTransformOption {
    readonly type: 'ecStat:clustering';
    readonly config: {
        readonly clusterCount: number;
        readonly outputType?: 'single' | 'multiple';
        readonly outputClusterIndexDimension?: number;
        readonly stepCount?: number;
        readonly d?: number;
        readonly [key: string]: unknown;
    };
}

// ecStat Regression Transform  
export interface EcStatRegressionTransformOption extends DataTransformOption {
    readonly type: 'ecStat:regression';
    readonly config: {
        readonly method: RegressionMethod;
        readonly order?: number; // For polynomial regression
        readonly formulaOn?: 'start' | 'end' | boolean;
        readonly [key: string]: unknown;
    };
}

// Generic ecStat Transform (for flexibility)
export interface EcStatTransformOption extends DataTransformOption {
    readonly type: `ecStat:${string}`;
    readonly config: {
        readonly [key: string]: unknown;
    };
}

// Dataset option with transforms
export interface DatasetOptionWithTransforms {
    readonly source?: readonly unknown[][];
    readonly transform?: 
        | EcStatClusteringTransformOption 
        | EcStatRegressionTransformOption 
        | EcStatTransformOption
        | DataTransformOption;
    readonly [key: string]: unknown;
}