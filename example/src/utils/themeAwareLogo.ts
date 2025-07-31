import type { ChartLogo } from 'aqc-charts';


/**
 * Creates a theme-aware logo configuration that switches between light and dark logos
 * based on the current theme. In dark mode, uses the white logo; in light mode, uses the dark logo.
 */
// Simple base64 test logos (small colored squares)
const TEST_LOGO_DARK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzMzMzMzIiByeD0iOCIvPgo8dGV4dCB4PSIzMCIgeT0iMzUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIj5MT0dPPC90ZXh0Pgo8L3N2Zz4K';

const TEST_LOGO_LIGHT = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjY2NjY2NjIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSI4Ii8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCI+TE9HTzwvdGV4dD4KPHN2Zz4K';

export function createThemeAwareLogo(
  theme: 'light' | 'dark',
  options: {
    position?: ChartLogo['position'];
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    opacity?: number;
    onSaveOnly?: boolean;
  } = {}
): ChartLogo {
  // Use test logos for now - replace with your actual logos later
  const logoSrc = theme === 'dark'
    ? "/logo_m_symbol_white.png"
    : "/logo_m_symbol.png";  // Dark logo for light backgrounds

  return {
    src: logoSrc,
    position: options.position || 'bottom-right',
    width: options.width || 200,
    height: options.height || 60,
    opacity: options.opacity || 0.8,
    onSaveOnly: options.onSaveOnly !== undefined ? options.onSaveOnly : true, // Default to export-only
    ...(options.x !== undefined && { x: options.x }),
    ...(options.y !== undefined && { y: options.y }),
  };
}

/**
 * Logo configurations for different chart positions and sizes
 */
export const LOGO_PRESETS = {
  // Small logo for compact charts
  small: {
    width: 40,
    height: 40,
    opacity: 0.7,
  },

  // Medium logo for standard charts
  medium: {
    width: 60,
    height: 60,
    opacity: 0.8,
  },

  // Large logo for prominent display
  large: {
    width: 80,
    height: 80,
    opacity: 0.9,
  },

  // Watermark style - very subtle
  watermark: {
    width: 50,
    height: 50,
    opacity: 0.3,
    position: 'center' as const,
  },

  // Export-only branding (explicit)
  exportOnly: {
    width: 70,
    height: 70,
    opacity: 0.9,
    onSaveOnly: true,
    position: 'bottom-right' as const,
  },

  // Always visible logos (if needed)
  alwaysVisible: {
    width: 50,
    height: 50,
    opacity: 0.6,
    onSaveOnly: false,
    position: 'bottom-right' as const,
  },
} as const;

/**
 * Creates multiple logo variants for testing different positions
 */
export function createLogoVariants(theme: 'light' | 'dark') {
  return {
    bottomRight: createThemeAwareLogo(theme, {
      position: 'bottom-right',
      ...LOGO_PRESETS.medium
    }),
    topRight: createThemeAwareLogo(theme, {
      position: 'top-right',
      ...LOGO_PRESETS.small
    }),
    bottomLeft: createThemeAwareLogo(theme, {
      position: 'bottom-left',
      ...LOGO_PRESETS.medium
    }),
    topLeft: createThemeAwareLogo(theme, {
      position: 'top-left',
      ...LOGO_PRESETS.small
    }),
    center: createThemeAwareLogo(theme, {
      ...LOGO_PRESETS.watermark
    }),
    exportOnly: createThemeAwareLogo(theme, {
      ...LOGO_PRESETS.exportOnly
    }),
  };
}