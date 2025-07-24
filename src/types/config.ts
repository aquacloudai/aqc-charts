// Axis configuration
export interface AxisConfig {
  readonly label?: string;
  readonly type?: 'linear' | 'category' | 'time' | 'log' | 'value';
  readonly min?: number | string | Date;
  readonly max?: number | string | Date;
  readonly format?: string; // For formatting labels
  readonly grid?: boolean;
  readonly gridColor?: string;
  readonly tickInterval?: number;
  readonly rotate?: number; // For rotated labels
  readonly boundaryGap?: boolean; // For line charts: false = start at axis, true = center on categories
  readonly parseDate?: boolean; // Explicitly control date parsing (default: false for safety)
  
  // Additional ECharts axis properties
  readonly name?: string;
  readonly nameLocation?: 'start' | 'middle' | 'end';
  readonly nameGap?: number;
  readonly position?: 'left' | 'right' | 'top' | 'bottom';
  readonly data?: readonly any[]; // For category axis
}

// Legend configuration
export interface LegendConfig {
  readonly show?: boolean;
  readonly position?: 'top' | 'bottom' | 'left' | 'right';
  readonly align?: 'start' | 'center' | 'end';
  readonly orientation?: 'horizontal' | 'vertical';
}

// Tooltip configuration
export interface TooltipConfig {
  readonly show?: boolean;
  readonly trigger?: 'item' | 'axis';
  readonly format?: string | ((params: any) => string);
  readonly backgroundColor?: string | undefined;
  readonly borderColor?: string;
  readonly textColor?: string;
}