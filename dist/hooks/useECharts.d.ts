import type { EChartsInstance, ChartTheme } from '@/types';
interface UseEChartsOptions {
    readonly renderer?: 'canvas' | 'svg';
    readonly locale?: string;
    readonly [key: string]: unknown;
}
interface UseEChartsReturn {
    readonly chart: EChartsInstance | null;
    readonly loading: boolean;
    readonly error: string | null;
    readonly resize: () => void;
    readonly refresh: () => void;
}
export declare const useECharts: (containerRef: React.RefObject<HTMLDivElement | null>, option: unknown, theme?: string | ChartTheme, opts?: UseEChartsOptions, notMerge?: boolean, lazyUpdate?: boolean) => UseEChartsReturn;
export {};
//# sourceMappingURL=useECharts.d.ts.map