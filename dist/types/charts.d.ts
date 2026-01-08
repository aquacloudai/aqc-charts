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
    readonly seriesConfig?: Record<string, {
        readonly color?: string;
        readonly smooth?: boolean;
        readonly showArea?: boolean;
        readonly strokeStyle?: 'solid' | 'dashed' | 'dotted';
        readonly strokeWidth?: number;
        readonly pointSize?: number;
        readonly pointShape?: 'circle' | 'square' | 'triangle' | 'diamond';
        readonly showPoints?: boolean;
        readonly areaOpacity?: number;
        readonly yAxisIndex?: number;
    }> | undefined;
    readonly series?: readonly {
        readonly name: string;
        readonly data: readonly DataPoint[];
        readonly color?: string;
        readonly smooth?: boolean;
        readonly showArea?: boolean;
        readonly strokeStyle?: 'solid' | 'dashed' | 'dotted';
        readonly strokeWidth?: number;
        readonly pointSize?: number;
        readonly pointShape?: 'circle' | 'square' | 'triangle' | 'diamond';
        readonly showPoints?: boolean;
        readonly yAxisIndex?: number;
    }[] | undefined;
    readonly xAxis?: AxisConfig | undefined;
    readonly yAxis?: AxisConfig | readonly AxisConfig[] | undefined;
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
    readonly showLabels?: boolean;
    readonly showAbsoluteValues?: boolean;
    readonly showPercentageLabels?: boolean;
    readonly series?: readonly {
        readonly name: string;
        readonly data: readonly DataPoint[];
        readonly color?: string;
        readonly stack?: string;
        readonly yAxisIndex?: number;
    }[] | undefined;
    readonly xAxis?: AxisConfig | undefined;
    readonly yAxis?: AxisConfig | readonly AxisConfig[] | undefined;
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
    readonly labelWrapLength?: number | undefined;
    readonly legend?: LegendConfig | undefined;
    readonly tooltip?: TooltipConfig | undefined;
    readonly selectedMode?: 'single' | 'multiple' | false;
    readonly emphasis?: boolean;
}
export interface JitterConfig {
    readonly width?: number;
    readonly height?: number;
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
    readonly jitter?: boolean | JitterConfig;
    readonly jitterOverlap?: boolean;
    readonly series?: readonly {
        readonly name: string;
        readonly data: readonly DataPoint[];
        readonly color?: string;
        readonly pointSize?: number;
        readonly pointShape?: string;
        readonly jitter?: boolean | JitterConfig;
        readonly jitterOverlap?: boolean;
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
export interface CombinedChartProps extends BaseErgonomicChartProps {
    readonly data: readonly DataPoint[];
    readonly xField?: string;
    readonly series: readonly {
        readonly field: string;
        readonly type: 'line' | 'bar';
        readonly name: string;
        readonly color?: string;
        readonly yAxisIndex?: number;
        readonly smooth?: boolean;
        readonly strokeWidth?: number;
        readonly strokeStyle?: 'solid' | 'dashed' | 'dotted';
        readonly showPoints?: boolean;
        readonly pointSize?: number;
        readonly showArea?: boolean;
        readonly areaOpacity?: number;
        readonly barWidth?: number | string;
        readonly stack?: string;
        readonly showLabels?: boolean;
    }[];
    readonly xAxis?: AxisConfig;
    readonly yAxis?: readonly AxisConfig[];
    readonly legend?: LegendConfig;
    readonly tooltip?: TooltipConfig;
    readonly zoom?: boolean;
    readonly pan?: boolean;
    readonly brush?: boolean;
}
export interface GeoChartProps extends BaseErgonomicChartProps {
    readonly data?: readonly {
        readonly name: string;
        readonly value: number;
    }[];
    readonly mapName: string;
    readonly mapUrl?: string;
    readonly mapType?: 'geojson' | 'svg';
    readonly mapSpecialAreas?: Record<string, {
        readonly left: number;
        readonly top: number;
        readonly width: number;
    }>;
    readonly chartType?: 'map' | 'geo';
    readonly nameField?: string;
    readonly valueField?: string;
    readonly visualMap?: {
        readonly show?: boolean;
        readonly min?: number;
        readonly max?: number;
        readonly left?: string | number;
        readonly right?: string | number;
        readonly top?: string | number;
        readonly bottom?: string | number;
        readonly colors?: readonly string[];
        readonly text?: [string, string];
        readonly calculable?: boolean;
        readonly orient?: 'horizontal' | 'vertical';
    };
    readonly geo?: {
        readonly map?: string;
        readonly roam?: boolean | 'scale' | 'move';
        readonly layoutCenter?: readonly [string, string];
        readonly layoutSize?: string | number;
        readonly selectedMode?: 'single' | 'multiple' | boolean;
        readonly scaleLimit?: {
            readonly min?: number;
            readonly max?: number;
        };
        readonly itemStyle?: {
            readonly areaColor?: string;
            readonly borderColor?: string;
            readonly borderWidth?: number;
        };
        readonly emphasis?: {
            readonly itemStyle?: {
                readonly areaColor?: string;
                readonly borderColor?: string;
                readonly borderWidth?: number;
            };
            readonly label?: {
                readonly show?: boolean;
                readonly color?: string;
            };
        };
        readonly select?: {
            readonly itemStyle?: {
                readonly areaColor?: string;
                readonly borderColor?: string;
                readonly borderWidth?: number;
            };
            readonly label?: {
                readonly show?: boolean;
                readonly color?: string;
            };
        };
        readonly regions?: readonly {
            readonly name: string;
            readonly itemStyle?: {
                readonly areaColor?: string;
                readonly borderColor?: string;
                readonly borderWidth?: number;
            };
            readonly emphasis?: {
                readonly itemStyle?: {
                    readonly areaColor?: string;
                    readonly borderColor?: string;
                    readonly borderWidth?: number;
                };
            };
            readonly select?: {
                readonly itemStyle?: {
                    readonly areaColor?: string;
                    readonly borderColor?: string;
                    readonly borderWidth?: number;
                };
            };
            readonly tooltip?: {
                readonly show?: boolean;
                readonly position?: string | readonly [number, number];
                readonly alwaysShowContent?: boolean;
                readonly enterable?: boolean;
                readonly extraCssText?: string;
                readonly formatter?: string | ((params: any) => string);
            };
        }[];
        readonly tooltip?: {
            readonly show?: boolean;
            readonly confine?: boolean;
            readonly formatter?: string | ((params: any) => string);
        };
    };
    readonly roam?: boolean | 'scale' | 'move';
    readonly scaleLimit?: {
        readonly min?: number;
        readonly max?: number;
    };
    readonly itemStyle?: {
        readonly normal?: {
            readonly areaColor?: string;
            readonly borderColor?: string;
            readonly borderWidth?: number;
        };
        readonly emphasis?: {
            readonly areaColor?: string;
            readonly borderColor?: string;
            readonly borderWidth?: number;
        };
    };
    readonly showLabels?: boolean;
    readonly labelPosition?: 'inside' | 'outside';
    readonly tooltip?: TooltipConfig | undefined;
    readonly toolbox?: {
        readonly show?: boolean;
        readonly features?: {
            readonly dataView?: boolean;
            readonly restore?: boolean;
            readonly saveAsImage?: boolean;
        };
    };
    readonly additionalSeries?: readonly any[];
    readonly grid?: any;
    readonly xAxis?: any;
    readonly yAxis?: any;
    readonly onSelectChanged?: (params: any) => void;
    readonly onMapLoad?: () => void;
    readonly onMapError?: (error: Error) => void;
}
//# sourceMappingURL=charts.d.ts.map