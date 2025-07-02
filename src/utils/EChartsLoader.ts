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

let loadingPromise: Promise<EChartsGlobal> | null = null;
let isLoaded = false;

/**
 * Load ECharts dynamically from CDN
 */
export async function loadECharts(options: EChartsLoadingOptions = {}): Promise<EChartsGlobal> {
  // Return immediately if already loaded
  if (isLoaded && window.echarts) {
    return window.echarts;
  }

  // Return existing promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }

  const { version = '5.6.0' } = options;

  loadingPromise = new Promise((resolve, reject) => {
    // Check if already loaded (in case of race condition)
    if (window.echarts) {
      isLoaded = true;
      resolve(window.echarts);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://cdn.jsdelivr.net/npm/echarts@${version}/dist/echarts.min.js`;
    script.async = true;

    // Handle load success
    script.onload = () => {
      if (window.echarts) {
        isLoaded = true;
        resolve(window.echarts);
      } else {
        reject(new Error('ECharts failed to load properly'));
      }
    };

    // Handle load error
    script.onerror = () => {
      reject(new Error(`Failed to load ECharts from CDN (version ${version})`));
    };

    // Add to document
    document.head.appendChild(script);
  });

  return loadingPromise;
}

/**
 * Check if ECharts is available
 */
export function isEChartsLoaded(): boolean {
  return isLoaded && !!window.echarts;
}

/**
 * Get ECharts instance (throws if not loaded)
 */
export function getECharts(): EChartsGlobal {
  if (!window.echarts) {
    throw new Error('ECharts not loaded. Call loadECharts() first.');
  }
  return window.echarts;
}

/**
 * Initialize ECharts loader with automatic loading
 */
export function initEChartsLoader(options?: EChartsLoadingOptions): Promise<EChartsGlobal> {
  return loadECharts(options);
}