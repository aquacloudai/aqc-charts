/**
 * Dynamic ECharts loader utility
 * Loads ECharts from CDN and makes it available globally
 */
export interface EChartsLoadingOptions {
    version?: string;
    theme?: string;
    locale?: string;
}
interface EChartsGlobal {
    init: (dom: HTMLElement, theme?: string | object, opts?: any) => any;
    dispose: (chart: any) => void;
    [key: string]: any;
}
declare global {
    interface Window {
        echarts?: EChartsGlobal;
    }
}
/**
 * Load ECharts dynamically from CDN
 */
export declare function loadECharts(options?: EChartsLoadingOptions): Promise<EChartsGlobal>;
/**
 * Check if ECharts is available
 */
export declare function isEChartsLoaded(): boolean;
/**
 * Get ECharts instance (throws if not loaded)
 */
export declare function getECharts(): EChartsGlobal;
/**
 * Initialize ECharts loader with automatic loading
 */
export declare function initEChartsLoader(options?: EChartsLoadingOptions): Promise<EChartsGlobal>;
export {};
//# sourceMappingURL=EChartsLoader.d.ts.map