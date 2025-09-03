export type { EChartsOption, SeriesOption, TitleOption, LegendComponentOption, TooltipOption, XAXisOption, YAXisOption, VisualMapComponentOption, CalendarOption, BarSeriesOption, LineSeriesOption, PieSeriesOption, HeatmapSeriesOption, ScatterSeriesOption } from 'echarts/types/dist/shared';
export interface EChartsInstance {
    setOption: (option: unknown, opts?: {
        notMerge?: boolean;
        lazyUpdate?: boolean;
        silent?: boolean;
    } | boolean) => void;
    getOption: () => unknown;
    resize: (opts?: {
        width?: number;
        height?: number;
        silent?: boolean;
    }) => void;
    dispatchAction: (payload: unknown) => void;
    on: (eventName: string, handler: (...args: unknown[]) => void) => void;
    off: (eventName: string, handler?: (...args: unknown[]) => void) => void;
    dispose: () => void;
    showLoading: (type?: string, opts?: unknown) => void;
    hideLoading: () => void;
    getDataURL: (opts?: unknown) => string;
    getConnectedDataURL: (opts?: unknown) => string;
    clear: () => void;
}
export type { ChartLogo } from './base';
export interface BaseChartProps {
    readonly title?: string;
    readonly width?: number | string;
    readonly height?: number | string;
    readonly theme?: 'light' | 'dark';
    readonly loading?: boolean;
    readonly notMerge?: boolean;
    readonly lazyUpdate?: boolean;
    readonly logo?: import('./base').ChartLogo;
    readonly onChartReady?: (chart: import('echarts/core').EChartsType) => void;
    readonly onClick?: (params: unknown, chart: import('echarts/core').EChartsType) => void;
    readonly onDoubleClick?: (params: unknown, chart: import('echarts/core').EChartsType) => void;
    readonly onMouseOver?: (params: unknown, chart: import('echarts/core').EChartsType) => void;
    readonly onMouseOut?: (params: unknown, chart: import('echarts/core').EChartsType) => void;
    readonly onDataZoom?: (params: unknown, chart: import('echarts/core').EChartsType) => void;
    readonly onBrush?: (params: unknown, chart: import('echarts/core').EChartsType) => void;
    readonly onLegendDoubleClick?: (legendName: string, chart: import('echarts/core').EChartsType) => void;
    readonly onSeriesDoubleClick?: (seriesName: string, chart: import('echarts/core').EChartsType) => void;
    readonly legendDoubleClickDelay?: number;
    readonly enableLegendDoubleClickSelection?: boolean;
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly option: import('echarts/types/dist/shared').EChartsOption;
    readonly renderer?: 'canvas' | 'svg';
    readonly locale?: string;
}
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
import type { XAXisOption as ImportedXAXisOption, YAXisOption as ImportedYAXisOption, VisualMapComponentOption as ImportedVisualMapComponentOption, CalendarOption as ImportedCalendarOption } from 'echarts/types/dist/shared';
export type ChartAxis = ImportedXAXisOption | ImportedYAXisOption;
export type ChartTheme = {
    readonly color?: readonly string[];
    readonly [key: string]: unknown;
};
export type VisualMapConfig = ImportedVisualMapComponentOption;
export type CalendarConfig = ImportedCalendarOption;
export type LineStyleConfig = {
    readonly type?: string;
    readonly width?: number;
    readonly color?: string;
    readonly opacity?: number;
};
export interface ChartRef {
    getEChartsInstance: () => import('echarts/core').EChartsType | null;
    refresh: () => void;
    clear: () => void;
    resize: () => void;
    showLoading: () => void;
    hideLoading: () => void;
    dispose: () => void;
    exportImage?: (opts?: {
        type?: 'png' | 'jpeg' | 'svg';
        pixelRatio?: number;
        backgroundColor?: string;
        excludeComponents?: string[];
    }) => string;
    saveAsImage?: (filename?: string, opts?: {
        type?: 'png' | 'jpeg' | 'svg';
        pixelRatio?: number;
        backgroundColor?: string;
        excludeComponents?: string[];
    }) => void;
}
export interface CalendarHeatmapDataPoint {
    readonly date: string;
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
export interface SankeyData {
    readonly nodes: readonly import('./sankey').SankeyNode[];
    readonly links: readonly import('./sankey').SankeyLink[];
}
export interface ScatterDataPoint {
    readonly value: readonly [number, number] | readonly [number, number, number];
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
export interface ClusterChartDataPoint {
    readonly value: readonly [number, number];
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
export interface RegressionChartDataPoint {
    readonly value: readonly [number, number];
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
export interface DataTransformOption {
    readonly type: string;
    readonly config?: unknown;
    readonly print?: boolean;
}
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
export interface EcStatRegressionTransformOption extends DataTransformOption {
    readonly type: 'ecStat:regression';
    readonly config: {
        readonly method: RegressionMethod;
        readonly order?: number;
        readonly formulaOn?: 'start' | 'end' | boolean;
        readonly [key: string]: unknown;
    };
}
export interface EcStatTransformOption extends DataTransformOption {
    readonly type: `ecStat:${string}`;
    readonly config: {
        readonly [key: string]: unknown;
    };
}
export interface DatasetOptionWithTransforms {
    readonly source?: readonly unknown[][];
    readonly transform?: EcStatClusteringTransformOption | EcStatRegressionTransformOption | EcStatTransformOption | DataTransformOption;
    readonly [key: string]: unknown;
}
//# sourceMappingURL=legacy.d.ts.map