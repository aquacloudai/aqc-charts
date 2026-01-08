import type { ChartLogo } from '@/types';

/**
 * Logo graphic option for ECharts
 */
export interface LogoGraphicOption {
  type: 'image';
  style: {
    image: string;
    x: number;
    y: number;
    width: number;
    height: number;
    opacity?: number;
  };
  z?: number;
  silent?: boolean;
}

/**
 * Generic graphic element in ECharts option
 */
interface GraphicElement {
  type?: string;
  [key: string]: unknown;
}

/**
 * Chart option with optional graphic property
 * Using Record<string, any> for flexibility with ECharts' complex type system
 */
// biome-ignore lint/suspicious/noExplicitAny: ECharts options require dynamic object types
type ChartOptionWithGraphic = Record<string, any>;

export const calculateLogoPosition = (
  logo: ChartLogo,
  chartWidth: number,
  chartHeight: number
): { x: number; y: number } => {
  const logoWidth = logo.width || 100;
  const logoHeight = logo.height || 50;
  const padding = 10;

  // If custom x,y are provided, use them
  if (logo.x !== undefined && logo.y !== undefined) {
    return { x: logo.x, y: logo.y };
  }

  // Calculate position based on preset positions
  switch (logo.position || 'bottom-right') {
    case 'top-left':
      return { x: padding, y: padding };
    case 'top-right':
      return { x: chartWidth - logoWidth - padding, y: padding };
    case 'bottom-left':
      return { x: padding, y: chartHeight - logoHeight - padding };
    case 'bottom-right':
      return { x: chartWidth - logoWidth - padding, y: chartHeight - logoHeight - padding };
    case 'center':
      return { 
        x: (chartWidth - logoWidth) / 2, 
        y: (chartHeight - logoHeight) / 2 
      };
    default:
      return { x: chartWidth - logoWidth - padding, y: chartHeight - logoHeight - padding };
  }
};

export const createLogoGraphic = (
  logo: ChartLogo,
  chartWidth: number,
  chartHeight: number
): LogoGraphicOption => {
  const position = calculateLogoPosition(logo, chartWidth, chartHeight);
  
  return {
    type: 'image',
    style: {
      image: logo.src,
      x: position.x,
      y: position.y,
      width: logo.width || 100,
      height: logo.height || 50,
      opacity: logo.opacity || 1,
    },
    z: 1000, // High z-index to appear above chart elements
    silent: true, // Don't trigger events
  };
};

export const addLogoToOption = <T extends ChartOptionWithGraphic>(
  option: T,
  logo: ChartLogo,
  chartWidth: number,
  chartHeight: number
): T => {
  if (!logo) return option;

  const logoGraphic = createLogoGraphic(logo, chartWidth, chartHeight);

  return {
    ...option,
    graphic: [
      ...(Array.isArray(option.graphic) ? option.graphic : option.graphic ? [option.graphic] : []),
      logoGraphic,
    ],
  };
};

export const removeLogoFromOption = <T extends ChartOptionWithGraphic>(option: T): T => {
  if (!option.graphic) return option;

  // Remove image graphics (assumed to be logos)
  const filteredGraphics = Array.isArray(option.graphic)
    ? option.graphic.filter((graphic: GraphicElement) => graphic.type !== 'image')
    : option.graphic.type !== 'image' ? [option.graphic] : [];

  return {
    ...option,
    graphic: filteredGraphics.length > 0 ? filteredGraphics : undefined,
  };
};