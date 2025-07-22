import type { BaseErgonomicChartProps, DataPoint } from './base';
import type { AxisConfig, LegendConfig, TooltipConfig } from './config';
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
export interface AreaChartProps extends Omit<LineChartProps, 'showArea'> {
    readonly stacked?: boolean;
    readonly stackType?: 'normal' | 'percent';
    readonly opacity?: number;
}
//# sourceMappingURL=charts.d.ts.map