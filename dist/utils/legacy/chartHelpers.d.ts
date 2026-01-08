/**
 * @deprecated Legacy helper functions for creating ECharts options.
 * These functions are provided for backward compatibility.
 * Consider using the ergonomic chart components (LineChart, BarChart, etc.) instead.
 */
import type { EChartsOption } from 'echarts/types/dist/shared';
/**
 * Common series item structure
 */
interface SeriesInputItem {
    name: string;
    data: number[];
    color?: string;
}
/**
 * Create a basic line chart option
 * @deprecated Use the LineChart component instead
 */
export declare function createLineChartOption(data: {
    categories: string[];
    series: SeriesInputItem[];
    title?: string;
}): EChartsOption;
/**
 * Create a basic bar chart option
 * @deprecated Use the BarChart component instead
 */
export declare function createBarChartOption(data: {
    categories: string[];
    series: SeriesInputItem[];
    title?: string;
}): EChartsOption;
/**
 * Create a basic pie chart option
 * @deprecated Use the PieChart component instead
 */
export declare function createPieChartOption(data: {
    data: Array<{
        name: string;
        value: number;
    }>;
    title?: string;
}): EChartsOption;
/**
 * Create a basic sankey chart option
 * @deprecated Use the SankeyChart component instead
 */
export declare function createSankeyChartOption(data: {
    nodes: Array<{
        readonly name: string;
        readonly value?: number;
        readonly depth?: number;
        readonly itemStyle?: unknown;
        readonly label?: unknown;
        readonly emphasis?: unknown;
    }>;
    links: Array<{
        readonly source: string | number;
        readonly target: string | number;
        readonly value: number;
        readonly lineStyle?: unknown;
        readonly emphasis?: unknown;
    }>;
    layout?: 'none' | 'circular';
    orient?: 'horizontal' | 'vertical';
    nodeAlign?: 'justify' | 'left' | 'right';
    nodeGap?: number;
    nodeWidth?: number;
    iterations?: number;
    title?: string;
}): EChartsOption;
/**
 * Merge ECharts options (simple deep merge)
 * @deprecated Use spread operator or a proper merge utility instead
 */
export declare function mergeOptions(base: EChartsOption, override: Partial<EChartsOption>): EChartsOption;
export {};
//# sourceMappingURL=chartHelpers.d.ts.map