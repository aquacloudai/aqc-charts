import '@testing-library/jest-dom';
import { afterEach, beforeAll, vi } from 'vitest';
import * as echarts from 'echarts';

/**
 * Mock requestAnimationFrame to prevent async rendering issues during tests.
 * ECharts uses rAF for rendering which causes errors when DOM is torn down.
 */
beforeAll(() => {
  // Use fake timers to control animation frames
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(performance.now()), 0);
  });

  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    clearTimeout(id);
  });
});

/**
 * Clean up all ECharts instances after each test.
 * This prevents canvas errors when ECharts tries to render after the DOM is torn down.
 */
afterEach(() => {
  // Dispose all ECharts instances to prevent canvas cleanup errors
  const containers = document.querySelectorAll('[_echarts_instance_]');
  containers.forEach((container) => {
    try {
      const instance = echarts.getInstanceByDom(container as HTMLElement);
      if (instance && !instance.isDisposed()) {
        instance.dispose();
      }
    } catch {
      // Ignore errors during cleanup
    }
  });

  // Clear any pending timers
  vi.clearAllTimers();
});

/**
 * Mock canvas context to handle cleanup gracefully.
 */
const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(
  contextId: string,
  options?: CanvasRenderingContext2DSettings
) {
  const context = originalGetContext.call(this, contextId, options);

  // Return a proxy that catches errors on detached canvases
  if (context && contextId === '2d') {
    return new Proxy(context, {
      get(target, prop) {
        const value = target[prop as keyof CanvasRenderingContext2D];
        if (typeof value === 'function') {
          return function(...args: unknown[]) {
            try {
              return (value as Function).apply(target, args);
            } catch {
              // Canvas was detached, ignore
              return undefined;
            }
          };
        }
        return value;
      },
      set(target, prop, value) {
        try {
          (target as any)[prop] = value;
        } catch {
          // Ignore errors on detached canvas
        }
        return true;
      }
    });
  }
  return context;
} as typeof HTMLCanvasElement.prototype.getContext;
