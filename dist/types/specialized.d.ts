import type { BaseErgonomicChartProps, DataPoint } from './base';
import type { AxisConfig, LegendConfig, TooltipConfig } from './config';
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
export interface RegressionChartProps extends BaseErgonomicChartProps {
    readonly data: readonly DataPoint[] | readonly (readonly [number, number])[];
    readonly xField?: string | undefined;
    readonly yField?: string | undefined;
    readonly method?: 'linear' | 'exponential' | 'logarithmic' | 'polynomial' | undefined;
    readonly order?: number | undefined;
    readonly pointSize?: number | undefined;
    readonly pointShape?: 'circle' | 'square' | 'triangle' | 'diamond' | undefined;
    readonly pointOpacity?: number | undefined;
    readonly showPoints?: boolean | undefined;
    readonly lineWidth?: number | undefined;
    readonly lineStyle?: 'solid' | 'dashed' | 'dotted' | undefined;
    readonly lineColor?: string | undefined;
    readonly lineOpacity?: number | undefined;
    readonly showLine?: boolean | undefined;
    readonly showEquation?: boolean | undefined;
    readonly equationPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | undefined;
    readonly showRSquared?: boolean | undefined;
    readonly equationFormatter?: string | ((equation: string, rSquared: number) => string) | undefined;
    readonly xAxis?: AxisConfig | undefined;
    readonly yAxis?: AxisConfig | undefined;
    readonly legend?: LegendConfig | undefined;
    readonly tooltip?: TooltipConfig | undefined;
    readonly pointsLabel?: string | undefined;
    readonly regressionLabel?: string | undefined;
}
//# sourceMappingURL=specialized.d.ts.map