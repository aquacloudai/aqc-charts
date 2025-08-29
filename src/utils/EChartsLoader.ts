/**
 * Dynamic ECharts loader utility
 * Loads ECharts from CDN and makes it available globally
 */

import { EChartsLoadError, TransformError, ChartErrorCode, safeAsync } from './errors';

export interface EChartsLoadingOptions {
  version?: string;
  theme?: string;
  locale?: string;
  retryAttempts?: number;
  retryDelay?: number;
  timeout?: number;
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
let loadAttempts = 0;

/**
 * Wait for a specified amount of time
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Load a script with timeout and retry logic
 */
function loadScript(src: string, name: string, timeout: number = 30000): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    let timeoutId: number;
    let isResolved = false;

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      script.onload = null;
      script.onerror = null;
    };

    script.onload = () => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        resolve();
      }
    };

    script.onerror = () => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        reject(new Error(`Failed to load ${name} from ${src}`));
      }
    };

    // Set timeout
    timeoutId = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        reject(new Error(`Timeout loading ${name} from ${src}`));
      }
    }, timeout) as any;

    document.head.appendChild(script);
  });
}

/**
 * Load ECharts dynamically from CDN with enhanced error handling
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

  const {
    version = '6.0.0',
    retryAttempts = 3,
    retryDelay = 1000,
    timeout = 30000
  } = options;

  loadingPromise = safeAsync(async () => {
    // Check if already loaded (in case of race condition)
    if (window.echarts && window.ecStat) {
      isLoaded = true;
      return window.echarts;
    }

    let lastError: Error | null = null;

    // Retry logic
    for (let attempt = 0; attempt < retryAttempts; attempt++) {
      try {
        loadAttempts++;

        // Load both scripts in parallel
        await Promise.all([
          loadScript(
            `https://cdn.jsdelivr.net/npm/echarts@${version}/dist/echarts.min.js`,
            'ECharts',
            timeout
          ),
          loadScript(
            'https://cdn.jsdelivr.net/npm/echarts-stat@1.2.0/dist/ecStat.min.js',
            'ecStat',
            timeout
          )
        ]);

        // Verify both libraries are available
        if (!window.echarts) {
          throw new Error('ECharts library not available after loading');
        }

        if (!window.ecStat) {
          throw new Error('ecStat library not available after loading');
        }

        // Register ecStat transforms with better error handling
        try {
          if (window.ecStat.transform.clustering) {
            window.echarts.registerTransform(window.ecStat.transform.clustering);
          }
          if (window.ecStat.transform.regression) {
            window.echarts.registerTransform(window.ecStat.transform.regression);
          }
          if (window.ecStat.transform.histogram) {
            window.echarts.registerTransform(window.ecStat.transform.histogram);
          }
        } catch (transformError) {
          throw new TransformError(
            'ecStat registration',
            transformError as Error,
            { 
              echartsVersion: version, 
              attempt: attempt + 1,
              availableTransforms: Object.keys(window.ecStat?.transform || {})
            }
          );
        }

        isLoaded = true;
        return window.echarts;

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on the last attempt
        if (attempt < retryAttempts - 1) {
          console.warn(`ECharts loading attempt ${attempt + 1} failed, retrying in ${retryDelay}ms...`, error);
          await delay(retryDelay * (attempt + 1)); // Exponential backoff
        }
      }
    }

    // All attempts failed
    throw new EChartsLoadError(lastError || new Error('Unknown loading error'), {
      version,
      attempts: retryAttempts,
      totalLoadAttempts: loadAttempts,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      online: typeof navigator !== 'undefined' ? navigator.onLine : true
    });

  }, ChartErrorCode.ECHARTS_LOAD_FAILED, { version, retryAttempts });

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