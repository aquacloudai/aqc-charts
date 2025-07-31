import type { EChartsType } from 'echarts/core';

// Logo configuration for ergonomic charts
export interface ChartLogo {
  readonly src: string; // Image URL or base64 data
  readonly position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  readonly width?: number;
  readonly height?: number;
  readonly x?: number; // Custom x position (overrides position)
  readonly y?: number; // Custom y position (overrides position)
  readonly opacity?: number;
  readonly onSaveOnly?: boolean; // Only show logo when saving/exporting
}

// Common props shared across all ergonomic chart components
export interface BaseErgonomicChartProps {
  // Chart dimensions
  readonly width?: number | string;
  readonly height?: number | string;
  
  // Styling
  readonly className?: string;
  readonly style?: React.CSSProperties;
  
  // Theme and colors
  readonly theme?: 'light' | 'dark' | 'auto';
  readonly colorPalette?: readonly string[] | undefined;
  readonly backgroundColor?: string | undefined;
  
  // Title and labels
  readonly title?: string | undefined;
  readonly subtitle?: string | undefined;
  readonly titlePosition?: 'left' | 'center' | 'right';
  
  // Logo/watermark
  readonly logo?: ChartLogo;
  
  // Loading and interaction states
  readonly loading?: boolean;
  readonly disabled?: boolean;
  
  // Animation
  readonly animate?: boolean;
  readonly animationDuration?: number | undefined;
  
  // Responsive behavior
  readonly responsive?: boolean;
  readonly maintainAspectRatio?: boolean;
  
  // Event handlers
  readonly onChartReady?: (chart: EChartsType) => void;
  readonly onDataPointClick?: (data: any, event: any) => void;
  readonly onDataPointHover?: (data: any, event: any) => void;
  
  // Advanced customization escape hatch
  readonly customOption?: Record<string, any> | undefined;
}

// Generic data point for most chart types
export interface DataPoint {
  readonly [key: string]: string | number | Date | null | undefined;
}

// Chart ref interface for ergonomic components
export interface ErgonomicChartRef {
  readonly getChart: () => EChartsType | null;
  readonly exportImage: (format?: 'png' | 'jpeg' | 'svg', opts?: { pixelRatio?: number; backgroundColor?: string; excludeComponents?: string[] }) => string;
  readonly saveAsImage?: (filename?: string, opts?: { type?: 'png' | 'jpeg' | 'svg'; pixelRatio?: number; backgroundColor?: string; excludeComponents?: string[] }) => void;
  readonly resize: () => void;
  readonly showLoading: (text?: string) => void;
  readonly hideLoading: () => void;
  readonly highlight: (dataIndex: number, seriesIndex?: number) => void;
  readonly clearHighlight: () => void;
  readonly updateData: (newData: readonly DataPoint[]) => void;
  // Pie chart specific methods
  readonly selectSlice?: (dataIndex: number) => void;
  readonly unselectSlice?: (dataIndex: number) => void;
}