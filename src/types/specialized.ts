import type { BaseErgonomicChartProps, DataPoint } from './base';
import type { AxisConfig, LegendConfig, TooltipConfig } from './config';

// Cluster Chart Props
export interface ClusterChartProps extends BaseErgonomicChartProps {
  readonly data: readonly DataPoint[] | readonly (readonly [number, number])[];
  
  // Field mappings for object data
  readonly xField?: string;
  readonly yField?: string;
  readonly nameField?: string;
  
  // Clustering configuration
  readonly clusterCount?: number;
  readonly clusterMethod?: 'kmeans' | 'hierarchical';
  
  // Visual styling
  readonly pointSize?: number;
  readonly pointOpacity?: number;
  readonly showClusterCenters?: boolean;
  readonly centerSymbol?: string;
  readonly centerSize?: number;
  
  // Cluster coloring
  readonly clusterColors?: readonly string[];
  readonly showVisualMap?: boolean;
  readonly visualMapPosition?: 'left' | 'right' | 'top' | 'bottom';
  
  // Axes
  readonly xAxis?: AxisConfig | undefined;
  readonly yAxis?: AxisConfig | undefined;
  
  // Legend and tooltip
  readonly legend?: LegendConfig | undefined;
  readonly tooltip?: TooltipConfig | undefined;
}

// Calendar Heatmap Chart Props
export interface CalendarHeatmapProps extends BaseErgonomicChartProps {
  readonly data: readonly DataPoint[] | readonly { readonly date: string; readonly value: number }[];
  
  // Field mappings for object data
  readonly dateField?: string;
  readonly valueField?: string;
  
  // Calendar configuration
  readonly year?: number | readonly number[] | undefined; // Single year or array of years
  readonly range?: readonly [string, string] | undefined; // Date range ['YYYY-MM-DD', 'YYYY-MM-DD']
  readonly startOfWeek?: 'sunday' | 'monday';
  readonly cellSize?: number | readonly [number, number] | undefined; // Width, height of cells
  
  // Visual styling
  readonly colorScale?: readonly string[] | undefined; // Color gradient [min, max] or [min, mid, max]
  readonly showWeekLabel?: boolean | undefined;
  readonly showMonthLabel?: boolean | undefined;
  readonly showYearLabel?: boolean | undefined;
  
  // Value formatting
  readonly valueFormat?: string | ((value: number) => string) | undefined;
  readonly showValues?: boolean | undefined; // Show values in cells
  
  // Interaction
  readonly cellBorderColor?: string | undefined;
  readonly cellBorderWidth?: number | undefined;
  readonly splitNumber?: number | undefined; // Number of segments in the color scale
  
  // Legend and tooltip
  readonly legend?: LegendConfig | undefined;
  readonly tooltip?: TooltipConfig | undefined;
  
  // Layout
  readonly orient?: 'horizontal' | 'vertical' | undefined;
  readonly monthGap?: number | undefined; // Gap between months
  readonly yearGap?: number | undefined; // Gap between years (for multi-year view)
}

// Regression Chart Props
export interface RegressionChartProps extends BaseErgonomicChartProps {
  readonly data: readonly DataPoint[] | readonly (readonly [number, number])[];
  
  // Field mappings for object data
  readonly xField?: string | undefined;
  readonly yField?: string | undefined;
  
  // Regression configuration
  readonly method?: 'linear' | 'exponential' | 'logarithmic' | 'polynomial' | undefined;
  readonly order?: number | undefined; // For polynomial regression
  
  // Scatter points styling
  readonly pointSize?: number | undefined;
  readonly pointShape?: 'circle' | 'square' | 'triangle' | 'diamond' | undefined;
  readonly pointOpacity?: number | undefined;
  readonly showPoints?: boolean | undefined;
  
  // Regression line styling
  readonly lineWidth?: number | undefined;
  readonly lineStyle?: 'solid' | 'dashed' | 'dotted' | undefined;
  readonly lineColor?: string | undefined;
  readonly lineOpacity?: number | undefined;
  readonly showLine?: boolean | undefined;
  
  // Regression equation display
  readonly showEquation?: boolean | undefined;
  readonly equationPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | undefined;
  readonly showRSquared?: boolean | undefined;
  readonly equationFormatter?: string | ((equation: string, rSquared: number) => string) | undefined;
  
  // Axes
  readonly xAxis?: AxisConfig | undefined;
  readonly yAxis?: AxisConfig | undefined;
  
  // Legend and tooltip
  readonly legend?: LegendConfig | undefined;
  readonly tooltip?: TooltipConfig | undefined;
  
  // Labels
  readonly pointsLabel?: string | undefined; // Label for scatter points series
  readonly regressionLabel?: string | undefined; // Label for regression line series
}