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
    readonly type: 'line' | 'bar' | 'pie' | 'scatter' | 'radar' | 'funnel' | 'gauge';
    readonly data: readonly (number | ChartDataPoint)[];
    readonly color?: string;
    readonly smooth?: boolean;
    readonly stack?: string;
    readonly yAxisIndex?: number;
    readonly [key: string]: unknown;
}

export interface ChartAxis {
    readonly type?: 'category' | 'value' | 'time' | 'log';
    readonly data?: readonly string[];
    readonly name?: string;
    readonly position?: 'top' | 'bottom' | 'left' | 'right';
    readonly axisLabel?: unknown;
    readonly axisLine?: unknown;
    readonly axisTick?: unknown;
    readonly splitLine?: unknown;
    readonly [key: string]: unknown;
}

export interface ChartTheme {
    readonly backgroundColor?: string;
    readonly textStyle?: unknown;
    readonly title?: unknown;
    readonly legend?: unknown;
    readonly grid?: unknown;
    readonly categoryAxis?: unknown;
    readonly valueAxis?: unknown;
    readonly color?: readonly string[];
}

export interface BaseChartProps {
    // Data props
    readonly series?: readonly ChartSeries[];
    readonly xAxis?: ChartAxis | readonly ChartAxis[];
    readonly yAxis?: ChartAxis | readonly ChartAxis[];

    // Layout props
    readonly title?: string | { readonly text?: string; readonly subtext?: string; readonly [key: string]: unknown };
    readonly subtitle?: string;
    readonly width?: number | string;
    readonly height?: number | string;

    // Behavior props
    readonly theme?: 'light' | 'dark' | ChartTheme;
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

    // Advanced props
    readonly option?: unknown; // Raw ECharts option for advanced use cases
    readonly renderer?: 'canvas' | 'svg';
    readonly locale?: string;
}

export interface ChartRef {
    getEChartsInstance: () => EChartsInstance | null;
    refresh: () => void;
}