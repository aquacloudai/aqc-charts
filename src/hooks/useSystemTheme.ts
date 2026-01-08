import { useSyncExternalStore } from 'react';

/**
 * Subscribes to system color scheme changes using the prefers-color-scheme media query.
 * Returns 'dark' or 'light' based on the user's system preference.
 *
 * This hook leverages ECharts 6's dynamic theme switching capabilities
 * for smooth theme transitions without chart re-initialization.
 */

// Media query for dark mode detection
const darkModeQuery = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null;

// Store for external state sync
function subscribe(callback: () => void): () => void {
  if (!darkModeQuery) return () => {};

  darkModeQuery.addEventListener('change', callback);
  return () => darkModeQuery.removeEventListener('change', callback);
}

function getSnapshot(): boolean {
  return darkModeQuery?.matches ?? false;
}

function getServerSnapshot(): boolean {
  return false; // Default to light mode on server
}

/**
 * Hook that returns the current system color scheme preference.
 * Automatically updates when the user changes their system preference.
 *
 * @returns 'dark' | 'light' - The current system color scheme
 *
 * @example
 * ```tsx
 * const systemTheme = useSystemTheme();
 * // Returns 'dark' or 'light' based on system preference
 * ```
 */
export function useSystemTheme(): 'dark' | 'light' {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isDark ? 'dark' : 'light';
}

/**
 * Hook that resolves a theme value, handling 'auto' by detecting system preference.
 *
 * @param theme - The theme value ('light', 'dark', 'auto', or a custom theme object)
 * @returns The resolved theme value (never 'auto')
 *
 * @example
 * ```tsx
 * const resolvedTheme = useResolvedTheme('auto');
 * // Returns 'dark' or 'light' based on system preference
 *
 * const explicitTheme = useResolvedTheme('dark');
 * // Returns 'dark' (passes through explicit values)
 * ```
 */
export function useResolvedTheme<T extends string | Record<string, unknown>>(
  theme: T | 'auto' | undefined
): T | 'dark' | 'light' {
  const systemTheme = useSystemTheme();

  if (theme === 'auto') {
    return systemTheme;
  }

  return (theme ?? 'light') as T | 'dark' | 'light';
}

/**
 * Returns whether the system prefers dark mode.
 *
 * @returns boolean - true if system prefers dark mode
 */
export function usePrefersDarkMode(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
