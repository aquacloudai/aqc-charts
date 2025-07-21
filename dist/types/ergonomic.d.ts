import type { EChartsType } from 'echarts/core';
export interface BaseErgonomicChartProps {
    readonly width?: number | string;
    readonly height?: number | string;
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly theme?: 'light' | 'dark' | 'auto';
    readonly colorPalette?: readonly string[] | undefined;
    readonly backgroundColor?: string | undefined;
    readonly title?: string | undefined;
    readonly subtitle?: string | undefined;
    readonly titlePosition?: 'left' | 'center' | 'right';
    readonly loading?: boolean;
    readonly disabled?: boolean;
    readonly animate?: boolean;
    readonly animationDuration?: number | undefined;
    readonly responsive?: boolean;
    readonly maintainAspectRatio?: boolean;
    readonly onChartReady?: (chart: EChartsType) => void;
    readonly onDataPointClick?: (data: any, event: any) => void;
    readonly onDataPointHover?: (data: any, event: any) => void;
    readonly customOption?: Record<string, any> | undefined;
}
export interface DataPoint {
    readonly [key: string]: string | number | Date | null | undefined;
}
export interface AxisConfig {
    readonly label?: string;
    readonly type?: 'linear' | 'category' | 'time' | 'log';
    readonly min?: number | string | Date;
    readonly max?: number | string | Date;
    readonly format?: string;
    readonly grid?: boolean;
    readonly gridColor?: string;
    readonly tickInterval?: number;
    readonly rotate?: number;
    readonly boundaryGap?: boolean;
}
export interface LegendConfig {
    readonly show?: boolean;
    readonly position?: 'top' | 'bottom' | 'left' | 'right';
    readonly align?: 'start' | 'center' | 'end';
    readonly orientation?: 'horizontal' | 'vertical';
}
export interface TooltipConfig {
    readonly show?: boolean;
    readonly trigger?: 'item' | 'axis';
    readonly format?: string | ((params: any) => string);
    readonly backgroundColor?: string | undefined;
    readonly borderColor?: string;
    readonly textColor?: string;
}
export interface LineChartProps extends BaseErgonomicChartProps {
    readonly data?: readonly DataPoint[] | readonly (readonly [string | number, number])[] | undefined;
    readonly xField?: string | undefined;
    readonly yField?: string | readonly string[] | undefined;
    readonly seriesField?: string | undefined;
    readonly smooth?: boolean;
    readonly strokeWidth?: number;
    readonly strokeStyle?: 'solid' | 'dashed' | 'dotted';
    readonly showPoints?: boolean;
    readonly pointSize?: number;
    readonly pointShape?: 'circle' | 'square' | 'triangle' | 'diamond';
    readonly showArea?: boolean;
    readonly areaOpacity?: number;
    readonly areaGradient?: boolean;
    readonly series?: readonly {
        readonly name: string;
        readonly data: readonly DataPoint[];
        readonly color?: string;
        readonly smooth?: boolean;
        readonly showArea?: boolean;
    }[] | undefined;
    readonly xAxis?: AxisConfig | undefined;
    readonly yAxis?: AxisConfig | undefined;
    readonly legend?: LegendConfig | undefined;
    readonly tooltip?: TooltipConfig | undefined;
    readonly zoom?: boolean;
    readonly pan?: boolean;
    readonly brush?: boolean;
}
export interface BarChartProps extends BaseErgonomicChartProps {
    readonly data?: readonly DataPoint[] | readonly (readonly [string, number])[] | undefined;
    readonly categoryField?: string | undefined;
    readonly valueField?: string | readonly string[] | undefined;
    readonly seriesField?: string | undefined;
    readonly orientation?: 'vertical' | 'horizontal';
    readonly barWidth?: number | string | undefined;
    readonly barGap?: number | string | undefined;
    readonly borderRadius?: number | undefined;
    readonly stack?: boolean;
    readonly stackType?: 'normal' | 'percent';
    readonly showPercentage?: boolean;
    readonly series?: readonly {
        readonly name: string;
        readonly data: readonly DataPoint[];
        readonly color?: string;
        readonly stack?: string;
    }[] | undefined;
    readonly xAxis?: AxisConfig | undefined;
    readonly yAxis?: AxisConfig | undefined;
    readonly legend?: LegendConfig | undefined;
    readonly tooltip?: TooltipConfig | undefined;
    readonly sortBy?: 'value' | 'category' | 'none';
    readonly sortOrder?: 'asc' | 'desc';
}
export interface PieChartProps extends BaseErgonomicChartProps {
    readonly data: readonly DataPoint[] | readonly {
        readonly name: string;
        readonly value: number;
    }[];
    readonly nameField?: string;
    readonly valueField?: string;
    readonly radius?: number | readonly [number, number];
    readonly startAngle?: number;
    readonly roseType?: boolean;
    readonly showLabels?: boolean;
    readonly labelPosition?: 'inside' | 'outside' | 'center';
    readonly showValues?: boolean;
    readonly showPercentages?: boolean;
    readonly labelFormat?: string | ((params: any) => string) | undefined;
    readonly legend?: LegendConfig | undefined;
    readonly tooltip?: TooltipConfig | undefined;
    readonly selectedMode?: 'single' | 'multiple' | false;
    readonly emphasis?: boolean;
}
export interface ScatterChartProps extends BaseErgonomicChartProps {
    readonly data: readonly DataPoint[] | readonly (readonly [number, number])[] | readonly (readonly [number, number, number])[];
    readonly xField?: string;
    readonly yField?: string;
    readonly sizeField?: string;
    readonly colorField?: string;
    readonly seriesField?: string;
    readonly pointSize?: number | readonly [number, number];
    readonly pointShape?: 'circle' | 'square' | 'triangle' | 'diamond';
    readonly pointOpacity?: number;
    readonly series?: readonly {
        readonly name: string;
        readonly data: readonly DataPoint[];
        readonly color?: string;
        readonly pointSize?: number;
        readonly pointShape?: string;
    }[];
    readonly xAxis?: AxisConfig | undefined;
    readonly yAxis?: AxisConfig | undefined;
    readonly legend?: LegendConfig | undefined;
    readonly tooltip?: TooltipConfig | undefined;
    readonly showTrendline?: boolean;
    readonly trendlineType?: 'linear' | 'polynomial' | 'exponential';
}
export interface ClusterChartProps extends BaseErgonomicChartProps {
    readonly data: readonly DataPoint[] | readonly (readonly [number, number])[];
    readonly xField?: string;
    readonly yField?: string;
    readonly nameField?: string;
    readonly clusterCount?: number;
    readonly clusterMethod?: 'kmeans' | 'hierarchical';
    readonly pointSize?: number;
    readonly pointOpacity?: number;
    readonly showClusterCenters?: boolean;
    readonly centerSymbol?: string;
    readonly centerSize?: number;
    readonly clusterColors?: readonly string[];
    readonly showVisualMap?: boolean;
    readonly visualMapPosition?: 'left' | 'right' | 'top' | 'bottom';
    readonly xAxis?: AxisConfig | undefined;
    readonly yAxis?: AxisConfig | undefined;
    readonly legend?: LegendConfig | undefined;
    readonly tooltip?: TooltipConfig | undefined;
}
export interface CalendarHeatmapProps extends BaseErgonomicChartProps {
    readonly data: readonly DataPoint[] | readonly {
        readonly date: string;
        readonly value: number;
    }[];
    readonly dateField?: string;
    readonly valueField?: string;
    readonly year?: number | readonly number[] | undefined;
    readonly range?: readonly [string, string] | undefined;
    readonly startOfWeek?: 'sunday' | 'monday';
    readonly cellSize?: number | readonly [number, number] | undefined;
    readonly colorScale?: readonly string[] | undefined;
    readonly showWeekLabel?: boolean | undefined;
    readonly showMonthLabel?: boolean | undefined;
    readonly showYearLabel?: boolean | undefined;
    readonly valueFormat?: string | ((value: number) => string) | undefined;
    readonly showValues?: boolean | undefined;
    readonly cellBorderColor?: string | undefined;
    readonly cellBorderWidth?: number | undefined;
    readonly splitNumber?: number | undefined;
    readonly legend?: LegendConfig | undefined;
    readonly tooltip?: TooltipConfig | undefined;
    readonly orient?: 'horizontal' | 'vertical' | undefined;
    readonly monthGap?: number | undefined;
    readonly yearGap?: number | undefined;
}
export interface AreaChartProps extends Omit<LineChartProps, 'showArea'> {
    readonly stacked?: boolean;
    readonly stackType?: 'normal' | 'percent';
    readonly opacity?: number;
}
export interface ErgonomicChartRef {
    readonly getChart: () => EChartsType | null;
    readonly exportImage: (format?: 'png' | 'jpeg' | 'svg') => string;
    readonly resize: () => void;
    readonly showLoading: (text?: string) => void;
    readonly hideLoading: () => void;
    readonly highlight: (dataIndex: number, seriesIndex?: number) => void;
    readonly clearHighlight: () => void;
    readonly updateData: (newData: readonly DataPoint[]) => void;
    readonly selectSlice?: (dataIndex: number) => void;
    readonly unselectSlice?: (dataIndex: number) => void;
}
//# sourceMappingURL=ergonomic.d.ts.map