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
export declare function useSystemTheme(): 'dark' | 'light';
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
export declare function useResolvedTheme<T extends string | Record<string, unknown>>(theme: T | 'auto' | undefined): T | 'dark' | 'light';
/**
 * Returns whether the system prefers dark mode.
 *
 * @returns boolean - true if system prefers dark mode
 */
export declare function usePrefersDarkMode(): boolean;
//# sourceMappingURL=useSystemTheme.d.ts.map