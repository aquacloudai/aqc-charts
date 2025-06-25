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
    HeatmapSeriesOption
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