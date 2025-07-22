import type { EChartsOption } from 'echarts/types/dist/shared';
import type { DataPoint, AxisConfig, LegendConfig, TooltipConfig, LineChartProps, BarChartProps, PieChartProps, CalendarHeatmapProps, SankeyChartProps, GanttChartProps, RegressionChartProps } from '@/types';
export declare const COLOR_PALETTES: {
    readonly default: readonly ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"];
    readonly vibrant: readonly ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE"];
    readonly pastel: readonly ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA", "#FFD9BA", "#E6E6FA", "#D3FFD3", "#FFCCFF", "#FFEFD5"];
    readonly business: readonly ["#2E4057", "#048A81", "#54C6EB", "#F8B500", "#B83A4B", "#5C7A89", "#A8E6CF", "#FFB6B3", "#C7CEEA"];
    readonly earth: readonly ["#8B4513", "#228B22", "#4682B4", "#DAA520", "#CD853F", "#32CD32", "#6495ED", "#FF8C00", "#9ACD32"];
};
export declare function isObjectData(data: readonly any[]): data is readonly DataPoint[];
export declare function extractUniqueValues(data: readonly DataPoint[], field: string): (string | number | Date)[];
export declare function groupDataByField(data: readonly DataPoint[], field: string): Record<string, DataPoint[]>;
export declare function detectDataType(values: (string | number | Date | null | undefined)[]): 'numeric' | 'categorical' | 'time';
export declare function buildBaseOption(props: any): Partial<EChartsOption>;
export declare function buildAxisOption(config?: AxisConfig, dataType?: 'numeric' | 'categorical' | 'time', theme?: string): any;
export declare function buildLegendOption(config?: LegendConfig, hasTitle?: boolean, hasSubtitle?: boolean, hasDataZoom?: boolean, theme?: string): any;
export declare function calculateGridSpacing(legendConfig?: LegendConfig, hasTitle?: boolean, hasSubtitle?: boolean, hasDataZoom?: boolean): any;
export declare function generateChartKey(theme?: string, colorPalette?: readonly string[]): string;
export declare function buildTooltipOption(config?: TooltipConfig, theme?: string): any;
export declare function buildLineChartOption(props: LineChartProps): EChartsOption;
export declare function buildBarChartOption(props: BarChartProps): EChartsOption;
export declare function buildPieChartOption(props: PieChartProps): EChartsOption;
export declare function buildScatterChartOption(props: any): EChartsOption;
export declare function buildClusterChartOption(props: any): EChartsOption;
export declare function buildCalendarHeatmapOption(props: CalendarHeatmapProps): EChartsOption;
export declare function buildSankeyChartOption(props: SankeyChartProps): EChartsOption;
export declare function buildGanttChartOption(props: GanttChartProps): EChartsOption;
export declare function buildRegressionChartOption(props: RegressionChartProps): EChartsOption;
//# sourceMappingURL=ergonomic.d.ts.map