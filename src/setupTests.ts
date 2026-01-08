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
 * This wraps 2D context methods to catch errors on detached canvases.
 */
const originalGetContext = HTMLCanvasElement.prototype.getContext;

function patchedGetContext(
  this: HTMLCanvasElement,
  contextId: '2d',
  options?: CanvasRenderingContext2DSettings
): CanvasRenderingContext2D | null;
function patchedGetContext(
  this: HTMLCanvasElement,
  contextId: 'bitmaprenderer',
  options?: ImageBitmapRenderingContextSettings
): ImageBitmapRenderingContext | null;
function patchedGetContext(
  this: HTMLCanvasElement,
  contextId: 'webgl',
  options?: WebGLContextAttributes
): WebGLRenderingContext | null;
function patchedGetContext(
  this: HTMLCanvasElement,
  contextId: 'webgl2',
  options?: WebGLContextAttributes
): WebGL2RenderingContext | null;
function patchedGetContext(
  this: HTMLCanvasElement,
  contextId: string,
  options?: unknown
): RenderingContext | null {
  const context = originalGetContext.call(this, contextId, options as CanvasRenderingContext2DSettings);

  // Only wrap 2D context (used by ECharts/zrender)
  if (context && contextId === '2d') {
    const ctx = context as CanvasRenderingContext2D;

    // Wrap methods that might fail on detached canvas
    const methodsToWrap = ['clearRect', 'fillRect', 'strokeRect', 'fill', 'stroke', 'drawImage'] as const;

    for (const methodName of methodsToWrap) {
      const original = ctx[methodName] as Function;
      if (typeof original === 'function') {
        (ctx as unknown as Record<string, Function>)[methodName] = function(...args: unknown[]) {
          try {
            return original.apply(ctx, args);
          } catch {
            // Canvas was detached, ignore
            return undefined;
          }
        };
      }
    }
  }

  return context;
}

HTMLCanvasElement.prototype.getContext = patchedGetContext as typeof HTMLCanvasElement.prototype.getContext;
