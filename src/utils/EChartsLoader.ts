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
  registerTransform: (transform: any) => void;
  [key: string]: any;
}

interface EcStatGlobal {
  transform: {
    clustering: any;
    regression: any;
    histogram: any;
  };
  [key: string]: any;
}

declare global {
  interface Window {
    echarts?: EChartsGlobal;
    ecStat?: EcStatGlobal;
  }
}

let loadingPromise: Promise<EChartsGlobal> | null = null;
let isLoaded = false;

/**
 * Load ECharts dynamically from CDN
 */
export async function loadECharts(options: EChartsLoadingOptions = {}): Promise<EChartsGlobal> {
  // Return immediately if already loaded
  if (isLoaded && window.echarts && window.ecStat) {
    return window.echarts;
  }

  // Return existing promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }

  const { version = '5.6.0' } = options;

  loadingPromise = new Promise((resolve, reject) => {
    // Check if already loaded (in case of race condition)
    if (window.echarts && window.ecStat) {
      isLoaded = true;
      resolve(window.echarts);
      return;
    }

    let scriptsLoaded = 0;
    const totalScripts = 2;
    let hasError = false;

    const onScriptLoad = () => {
      scriptsLoaded++;
      if (scriptsLoaded === totalScripts && !hasError) {
        if (window.echarts && window.ecStat) {
          // Register ecStat transforms
          try {
            window.echarts.registerTransform(window.ecStat.transform.clustering);
            window.echarts.registerTransform(window.ecStat.transform.regression);
            window.echarts.registerTransform(window.ecStat.transform.histogram);
            isLoaded = true;
            resolve(window.echarts);
          } catch (error) {
            reject(new Error('Failed to register ecStat transforms'));
          }
        } else {
          reject(new Error('ECharts or ecStat failed to load properly'));
        }
      }
    };

    const onScriptError = (scriptName: string) => {
      if (!hasError) {
        hasError = true;
        reject(new Error(`Failed to load ${scriptName} from CDN`));
      }
    };

    // Load ECharts
    const echartsScript = document.createElement('script');
    echartsScript.src = `https://cdn.jsdelivr.net/npm/echarts@${version}/dist/echarts.min.js`;
    echartsScript.async = true;
    echartsScript.onload = onScriptLoad;
    echartsScript.onerror = () => onScriptError('ECharts');
    document.head.appendChild(echartsScript);

    // Load ecStat
    const ecStatScript = document.createElement('script');
    ecStatScript.src = 'https://cdn.jsdelivr.net/npm/echarts-stat@1.2.0/dist/ecStat.min.js';
    ecStatScript.async = true;
    ecStatScript.onload = onScriptLoad;
    ecStatScript.onerror = () => onScriptError('ecStat');
    document.head.appendChild(ecStatScript);
  });

  return loadingPromise;
}

/**
 * Check if ECharts is available
 */
export function isEChartsLoaded(): boolean {
  return isLoaded && !!window.echarts && !!window.ecStat;
}

/**
 * Get ECharts instance (throws if not loaded)
 */
export function getECharts(): EChartsGlobal {
  if (!window.echarts || !window.ecStat) {
    throw new Error('ECharts and ecStat not loaded. Call loadECharts() first.');
  }
  return window.echarts;
}

/**
 * Initialize ECharts loader with automatic loading
 */
export function initEChartsLoader(options?: EChartsLoadingOptions): Promise<EChartsGlobal> {
  return loadECharts(options);
}