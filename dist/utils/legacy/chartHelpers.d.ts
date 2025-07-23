/**
 * Helper functions for creating ECharts options easily
 */
import type { EChartsOption } from 'echarts/types/dist/shared';
/**
 * Create a basic line chart option
 */
export declare function createLineChartOption(data: {
    categories: string[];
    series: Array<{
        name: string;
        data: number[];
        color?: string;
    }>;
    title?: string;
}): EChartsOption;
/**
 * Create a basic bar chart option
 */
export declare function createBarChartOption(data: {
    categories: string[];
    series: Array<{
        name: string;
        data: number[];
        color?: string;
    }>;
    title?: string;
}): EChartsOption;
/**
 * Create a basic pie chart option
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
 */
export declare function mergeOptions(base: EChartsOption, override: Partial<EChartsOption>): EChartsOption;
//# sourceMappingURL=chartHelpers.d.ts.map