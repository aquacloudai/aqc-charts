import type { EChartsOption } from 'echarts/types/dist/shared';
import type { AxisConfig, LegendConfig, TooltipConfig, ChartLogo } from '@/types';
/**
 * Props used by buildBaseOption function
 * All properties explicitly allow undefined to support exactOptionalPropertyTypes
 */
interface BaseOptionProps {
    readonly theme?: 'light' | 'dark' | 'auto' | undefined;
    readonly title?: string | undefined;
    readonly subtitle?: string | undefined;
    readonly titlePosition?: 'left' | 'center' | 'right' | undefined;
    readonly animate?: boolean | undefined;
    readonly animationDuration?: number | undefined;
    readonly backgroundColor?: string | undefined;
    readonly colorPalette?: readonly string[] | undefined;
    readonly logo?: ChartLogo | undefined;
    readonly width?: number | string | undefined;
    readonly height?: number | string | undefined;
}
/**
 * Record type for ECharts option objects
 * eslint-disable-next-line @typescript-eslint/no-explicit-any
 * Using Record<string, any> because ECharts option objects are dynamic
 * and need to support spreading
 */
type EChartsOptionRecord = Record<string, any>;
export declare function buildBaseOption(props: BaseOptionProps): Partial<EChartsOption>;
export declare function buildAxisOption(config?: AxisConfig, dataType?: 'numeric' | 'categorical' | 'time', theme?: string): EChartsOptionRecord;
export declare function buildLegendOption(config?: LegendConfig, hasTitle?: boolean, hasSubtitle?: boolean, hasDataZoom?: boolean, theme?: string): EChartsOptionRecord;
export declare function calculateGridSpacing(legendConfig?: LegendConfig, hasTitle?: boolean, hasSubtitle?: boolean, hasDataZoom?: boolean): EChartsOptionRecord;
export declare function generateChartKey(theme?: string, colorPalette?: readonly string[]): string;
export declare function buildTooltipOption(config?: TooltipConfig, theme?: string): EChartsOptionRecord;
export {};
//# sourceMappingURL=base-options.d.ts.map