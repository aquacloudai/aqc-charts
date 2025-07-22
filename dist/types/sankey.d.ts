import type { BaseErgonomicChartProps, DataPoint } from './base';
import type { LegendConfig, TooltipConfig } from './config';
export interface SankeyNode {
    readonly name: string;
    readonly value?: number;
    readonly depth?: number;
    readonly itemStyle?: {
        readonly color?: string;
        readonly borderColor?: string;
        readonly borderWidth?: number;
    };
    readonly label?: {
        readonly show?: boolean;
        readonly position?: 'left' | 'right' | 'top' | 'bottom' | 'inside' | 'insideLeft' | 'insideRight';
        readonly fontSize?: number;
        readonly color?: string;
        readonly formatter?: string | ((params: any) => string);
    };
    readonly emphasis?: Record<string, any>;
}
export interface SankeyLink {
    readonly source: string | number;
    readonly target: string | number;
    readonly value: number;
    readonly lineStyle?: {
        readonly color?: string;
        readonly opacity?: number;
        readonly curveness?: number;
    };
    readonly emphasis?: Record<string, any>;
}
export interface SankeyChartProps extends BaseErgonomicChartProps {
    readonly data: readonly DataPoint[] | {
        readonly nodes: readonly SankeyNode[];
        readonly links: readonly SankeyLink[];
    };
    readonly sourceField?: string | undefined;
    readonly targetField?: string | undefined;
    readonly valueField?: string | undefined;
    readonly nodeNameField?: string | undefined;
    readonly nodes?: readonly SankeyNode[] | undefined;
    readonly links?: readonly SankeyLink[] | undefined;
    readonly layout?: 'none' | 'circular' | undefined;
    readonly orient?: 'horizontal' | 'vertical' | undefined;
    readonly nodeAlign?: 'justify' | 'left' | 'right' | undefined;
    readonly nodeGap?: number | undefined;
    readonly nodeWidth?: number | undefined;
    readonly iterations?: number | undefined;
    readonly nodeColors?: readonly string[] | undefined;
    readonly showNodeValues?: boolean | undefined;
    readonly nodeLabels?: boolean | undefined;
    readonly nodeLabelPosition?: 'left' | 'right' | 'top' | 'bottom' | 'inside' | undefined;
    readonly linkColors?: readonly string[] | undefined;
    readonly linkOpacity?: number | undefined;
    readonly linkCurveness?: number | undefined;
    readonly showLinkLabels?: boolean | undefined;
    readonly focusMode?: 'none' | 'adjacency' | 'trajectory' | undefined;
    readonly blurScope?: 'coordinateSystem' | 'series' | 'global' | undefined;
    readonly legend?: LegendConfig | undefined;
    readonly tooltip?: TooltipConfig | undefined;
}
//# sourceMappingURL=sankey.d.ts.map