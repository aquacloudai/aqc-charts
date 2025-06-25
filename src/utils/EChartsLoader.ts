interface EChartsModule {
    init: (dom: HTMLElement, theme?: string, opts?: unknown) => unknown;
    dispose: (target: HTMLElement | unknown) => void;
    [key: string]: unknown;
}

export class EChartsLoader {
    private static instance: EChartsLoader | null = null;
    private loadPromise: Promise<EChartsModule> | null = null;
    private echarts: EChartsModule | null = null;

    private constructor() {
        // Private constructor for singleton
    }

    static getInstance(): EChartsLoader {
        if (!EChartsLoader.instance) {
            EChartsLoader.instance = new EChartsLoader();
        }
        return EChartsLoader.instance;
    }

    async load(): Promise<EChartsModule> {
        if (this.echarts) {
            return this.echarts;
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = new Promise<EChartsModule>((resolve, reject) => {
            // Check if ECharts is already loaded
            if (typeof window !== 'undefined') {
                const globalECharts = (window as typeof window & { echarts?: EChartsModule }).echarts;
                if (globalECharts) {
                    this.echarts = globalECharts;
                    resolve(this.echarts);
                    return;
                }
            }

            // Load ECharts from CDN
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/echarts@latest/dist/echarts.min.js';
            script.async = true;
            script.crossOrigin = 'anonymous';

            script.addEventListener('load', () => {
                const globalECharts = (window as typeof window & { echarts?: EChartsModule }).echarts;
                if (globalECharts) {
                    this.echarts = globalECharts;
                    resolve(this.echarts);
                } else {
                    reject(new Error('ECharts failed to load'));
                }
            });

            script.addEventListener('error', () => {
                reject(new Error('Failed to load ECharts from CDN'));
            });

            document.head.appendChild(script);
        });

        return this.loadPromise;
    }

    getECharts(): EChartsModule | null {
        return this.echarts;
    }
}