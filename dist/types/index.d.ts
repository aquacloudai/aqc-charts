export interface EChartsInstance {
    setOption: (option: unknown, notMerge?: boolean, lazyUpdate?: boolean) => void;
    getOption: () => unknown;
    resize: (opts?: {
        width?: number;
        height?: number;
    }) => void;
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
export interface LineStyleConfig {
    readonly type?: 'solid' | 'dashed' | 'dotted';
    readonly width?: number;
    readonly color?: string;
    readonly opacity?: number;
}
export interface ChartSeries {
    readonly name: string;
    readonly type: 'line' | 'bar' | 'pie' | 'scatter' | 'radar' | 'funnel' | 'gauge' | 'heatmap';
    readonly data: readonly (number | ChartDataPoint)[];
    readonly color?: string;
    readonly smooth?: boolean;
    readonly stack?: string | undefined;
    readonly yAxisIndex?: number;
    readonly coordinateSystem?: 'cartesian2d' | 'calendar' | 'geo' | 'parallel' | 'polar' | 'radar' | 'single';
    readonly lineStyle?: LineStyleConfig;
    readonly symbol?: 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow' | 'none';
    readonly symbolSize?: number;
    readonly connectNulls?: boolean;
    readonly areaStyle?: unknown;
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
export interface LegendConfig {
    readonly show?: boolean;
    readonly type?: 'plain' | 'scroll';
    readonly orient?: 'horizontal' | 'vertical';
    readonly left?: number | string;
    readonly top?: number | string;
    readonly right?: number | string;
    readonly bottom?: number | string;
    readonly width?: number | string;
    readonly height?: number | string;
    readonly align?: 'auto' | 'left' | 'right';
    readonly padding?: number | readonly number[];
    readonly itemGap?: number;
    readonly itemWidth?: number;
    readonly itemHeight?: number;
    readonly formatter?: string | ((name: string) => string);
    readonly selectedMode?: boolean | 'single' | 'multiple';
    readonly inactiveColor?: string;
    readonly selected?: Record<string, boolean>;
    readonly textStyle?: {
        readonly color?: string;
        readonly fontStyle?: 'normal' | 'italic' | 'oblique';
        readonly fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
        readonly fontSize?: number;
        readonly fontFamily?: string;
    };
    readonly pageTextStyle?: {
        readonly color?: string;
        readonly fontSize?: number;
    };
    readonly animation?: boolean;
    readonly animationDurationUpdate?: number;
}
export interface TooltipConfig {
    readonly show?: boolean;
    readonly trigger?: 'item' | 'axis' | 'none';
    readonly axisPointer?: {
        readonly type?: 'line' | 'shadow' | 'none' | 'cross';
        readonly axis?: 'auto' | 'x' | 'y' | 'angle' | 'radius';
    };
    readonly formatter?: string | ((params: unknown) => string);
    readonly backgroundColor?: string;
    readonly borderColor?: string;
    readonly borderWidth?: number;
    readonly padding?: number | readonly number[];
    readonly textStyle?: {
        readonly color?: string;
        readonly fontSize?: number;
        readonly fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
    };
    readonly position?: unknown;
    readonly confine?: boolean;
    readonly transitionDuration?: number;
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
    readonly series?: readonly ChartSeries[];
    readonly xAxis?: ChartAxis | readonly ChartAxis[];
    readonly yAxis?: ChartAxis | readonly ChartAxis[];
    readonly title?: string | {
        readonly text?: string;
        readonly subtext?: string;
        readonly [key: string]: unknown;
    };
    readonly subtitle?: string;
    readonly width?: number | string;
    readonly height?: number | string;
    readonly legend?: LegendConfig;
    readonly tooltip?: TooltipConfig;
    readonly theme?: 'light' | 'dark' | ChartTheme;
    readonly loading?: boolean;
    readonly notMerge?: boolean;
    readonly lazyUpdate?: boolean;
    readonly onChartReady?: (chart: EChartsInstance) => void;
    readonly onClick?: (params: unknown, chart: EChartsInstance) => void;
    readonly onDoubleClick?: (params: unknown, chart: EChartsInstance) => void;
    readonly onMouseOver?: (params: unknown, chart: EChartsInstance) => void;
    readonly onMouseOut?: (params: unknown, chart: EChartsInstance) => void;
    readonly onDataZoom?: (params: unknown, chart: EChartsInstance) => void;
    readonly onBrush?: (params: unknown, chart: EChartsInstance) => void;
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly option?: unknown;
    readonly renderer?: 'canvas' | 'svg';
    readonly locale?: string;
}
export interface ChartRef {
    getEChartsInstance: () => EChartsInstance | null;
    refresh: () => void;
}
export interface CalendarHeatmapDataPoint {
    readonly date: string;
    readonly value: number;
}
export interface CalendarConfig {
    readonly range?: string | readonly string[] | number;
    readonly cellSize?: readonly [number | 'auto', number | 'auto'] | number | 'auto';
    readonly splitLine?: {
        readonly show?: boolean;
        readonly lineStyle?: unknown;
    };
    readonly itemStyle?: {
        readonly color?: string;
        readonly borderColor?: string;
        readonly borderWidth?: number;
        readonly borderRadius?: number;
    };
    readonly dayLabel?: {
        readonly show?: boolean;
        readonly firstDay?: number;
        readonly position?: 'start' | 'end';
        readonly margin?: number;
        readonly nameMap?: readonly string[] | 'en' | 'cn';
        readonly color?: string;
        readonly fontSize?: number;
    };
    readonly monthLabel?: {
        readonly show?: boolean;
        readonly position?: 'start' | 'end';
        readonly margin?: number;
        readonly nameMap?: readonly string[] | 'en' | 'cn';
        readonly formatter?: string | ((params: {
            nameMap: string;
            yyyy: string;
            yy: string;
            MM: string;
            M: string;
        }) => string);
        readonly color?: string;
        readonly fontSize?: number;
    };
    readonly yearLabel?: {
        readonly show?: boolean;
        readonly position?: 'top' | 'bottom' | 'left' | 'right';
        readonly margin?: number;
        readonly formatter?: string | ((params: {
            start: string;
            end: string;
        }) => string);
        readonly color?: string;
        readonly fontSize?: number;
    };
    readonly orient?: 'horizontal' | 'vertical';
    readonly left?: number | string;
    readonly top?: number | string;
    readonly right?: number | string;
    readonly bottom?: number | string;
    readonly width?: number | string;
    readonly height?: number | string;
}
export interface VisualMapConfig {
    readonly type?: 'continuous' | 'piecewise';
    readonly min?: number;
    readonly max?: number;
    readonly range?: readonly [number, number];
    readonly calculable?: boolean;
    readonly realtime?: boolean;
    readonly inverse?: boolean;
    readonly precision?: number;
    readonly itemWidth?: number;
    readonly itemHeight?: number;
    readonly align?: 'auto' | 'left' | 'right';
    readonly text?: readonly [string, string];
    readonly textGap?: number;
    readonly show?: boolean;
    readonly dimension?: number | string;
    readonly seriesIndex?: number | readonly number[];
    readonly hoverLink?: boolean;
    readonly inRange?: {
        readonly color?: readonly string[];
        readonly colorAlpha?: readonly number[];
        readonly opacity?: readonly number[];
        readonly colorLightness?: readonly number[];
        readonly colorSaturation?: readonly number[];
        readonly colorHue?: readonly number[];
    };
    readonly outOfRange?: {
        readonly color?: readonly string[];
        readonly colorAlpha?: readonly number[];
        readonly opacity?: readonly number[];
        readonly colorLightness?: readonly number[];
        readonly colorSaturation?: readonly number[];
        readonly colorHue?: readonly number[];
    };
    readonly controller?: {
        readonly inRange?: {
            readonly color?: readonly string[];
            readonly colorAlpha?: readonly number[];
            readonly opacity?: readonly number[];
            readonly colorLightness?: readonly number[];
            readonly colorSaturation?: readonly number[];
            readonly colorHue?: readonly number[];
        };
        readonly outOfRange?: {
            readonly color?: readonly string[];
            readonly colorAlpha?: readonly number[];
            readonly opacity?: readonly number[];
            readonly colorLightness?: readonly number[];
            readonly colorSaturation?: readonly number[];
            readonly colorHue?: readonly number[];
        };
    };
    readonly zlevel?: number;
    readonly z?: number;
    readonly left?: number | string;
    readonly top?: number | string;
    readonly right?: number | string;
    readonly bottom?: number | string;
    readonly orient?: 'horizontal' | 'vertical';
    readonly padding?: number | readonly number[];
    readonly backgroundColor?: string;
    readonly borderColor?: string;
    readonly borderWidth?: number;
    readonly color?: readonly string[];
    readonly textStyle?: unknown;
    readonly formatter?: string | ((value: number) => string);
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
//# sourceMappingURL=index.d.ts.map