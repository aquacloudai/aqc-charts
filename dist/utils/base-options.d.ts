import type { EChartsOption } from 'echarts/types/dist/shared';
import type { AxisConfig, LegendConfig, TooltipConfig } from '@/types';
export declare function buildBaseOption(props: any): Partial<EChartsOption>;
export declare function buildAxisOption(config?: AxisConfig, dataType?: 'numeric' | 'categorical' | 'time', theme?: string): any;
export declare function buildLegendOption(config?: LegendConfig, hasTitle?: boolean, hasSubtitle?: boolean, hasDataZoom?: boolean, theme?: string): any;
export declare function calculateGridSpacing(legendConfig?: LegendConfig, hasTitle?: boolean, hasSubtitle?: boolean, hasDataZoom?: boolean): any;
export declare function generateChartKey(theme?: string, colorPalette?: readonly string[]): string;
export declare function buildTooltipOption(config?: TooltipConfig, theme?: string): any;
//# sourceMappingURL=base-options.d.ts.map