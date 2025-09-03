import type { EChartsType } from 'echarts/core';
export interface ChartLogo {
    readonly src: string;
    readonly position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    readonly width?: number;
    readonly height?: number;
    readonly x?: number;
    readonly y?: number;
    readonly opacity?: number;
    readonly onSaveOnly?: boolean;
}
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
    readonly logo?: ChartLogo;
    readonly loading?: boolean;
    readonly disabled?: boolean;
    readonly animate?: boolean;
    readonly animationDuration?: number | undefined;
    readonly responsive?: boolean;
    readonly maintainAspectRatio?: boolean;
    readonly onChartReady?: (chart: EChartsType) => void;
    readonly onDataPointClick?: (data: any, event: any) => void;
    readonly onDataPointHover?: (data: any, event: any) => void;
    readonly onLegendDoubleClick?: (legendName: string, chart: EChartsType) => void;
    readonly onSeriesDoubleClick?: (seriesName: string, chart: EChartsType) => void;
    readonly legendDoubleClickDelay?: number;
    readonly enableLegendDoubleClickSelection?: boolean;
    readonly customOption?: Record<string, any> | undefined;
}
export interface DataPoint {
    readonly [key: string]: string | number | Date | null | undefined;
}
export interface ErgonomicChartRef {
    readonly getChart: () => EChartsType | null;
    readonly exportImage: (format?: 'png' | 'jpeg' | 'svg', opts?: {
        pixelRatio?: number;
        backgroundColor?: string;
        excludeComponents?: string[];
    }) => string;
    readonly saveAsImage?: (filename?: string, opts?: {
        type?: 'png' | 'jpeg' | 'svg';
        pixelRatio?: number;
        backgroundColor?: string;
        excludeComponents?: string[];
    }) => void;
    readonly resize: () => void;
    readonly showLoading: (text?: string) => void;
    readonly hideLoading: () => void;
    readonly highlight: (dataIndex: number, seriesIndex?: number) => void;
    readonly clearHighlight: () => void;
    readonly updateData: (newData: readonly DataPoint[]) => void;
    readonly selectSlice?: (dataIndex: number) => void;
    readonly unselectSlice?: (dataIndex: number) => void;
}
//# sourceMappingURL=base.d.ts.map