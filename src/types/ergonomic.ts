import type { EChartsType } from 'echarts/core';

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

// Axis configuration
export interface AxisConfig {
  readonly label?: string;
  readonly type?: 'linear' | 'category' | 'time' | 'log';
  readonly min?: number | string | Date;
  readonly max?: number | string | Date;
  readonly format?: string; // For formatting labels
  readonly grid?: boolean;
  readonly gridColor?: string;
  readonly tickInterval?: number;
  readonly rotate?: number; // For rotated labels
  readonly boundaryGap?: boolean; // For line charts: false = start at axis, true = center on categories
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

// Line Chart Props
export interface LineChartProps extends BaseErgonomicChartProps {
  // Data - array of objects or simple arrays
  readonly data?: readonly DataPoint[] | readonly (readonly [string | number, number])[] | undefined;
  
  // Field mappings for object data
  readonly xField?: string | undefined;
  readonly yField?: string | readonly string[] | undefined; // Multiple y fields for multiple series
  readonly seriesField?: string | undefined; // Field to group data into multiple series
  
  // Line styling
  readonly smooth?: boolean;
  readonly strokeWidth?: number;
  readonly strokeStyle?: 'solid' | 'dashed' | 'dotted';
  readonly showPoints?: boolean;
  readonly pointSize?: number;
  readonly pointShape?: 'circle' | 'square' | 'triangle' | 'diamond';
  
  // Area under curve
  readonly showArea?: boolean;
  readonly areaOpacity?: number;
  readonly areaGradient?: boolean;
  
  // Multiple series options
  readonly series?: readonly {
    readonly name: string;
    readonly data: readonly DataPoint[];
    readonly color?: string;
    readonly smooth?: boolean;
    readonly showArea?: boolean;
  }[] | undefined;
  
  // Axes
  readonly xAxis?: AxisConfig | undefined;
  readonly yAxis?: AxisConfig | undefined;
  
  // Legend and tooltip
  readonly legend?: LegendConfig | undefined;
  readonly tooltip?: TooltipConfig | undefined;
  
  // Zoom and interaction
  readonly zoom?: boolean;
  readonly pan?: boolean;
  readonly brush?: boolean;
}

// Bar Chart Props
export interface BarChartProps extends BaseErgonomicChartProps {
  readonly data?: readonly DataPoint[] | readonly (readonly [string, number])[] | undefined;
  
  // Field mappings
  readonly categoryField?: string | undefined; // For object data
  readonly valueField?: string | readonly string[] | undefined;
  readonly seriesField?: string | undefined;
  
  // Bar styling
  readonly orientation?: 'vertical' | 'horizontal';
  readonly barWidth?: number | string | undefined;
  readonly barGap?: number | string | undefined;
  readonly borderRadius?: number | undefined;
  
  // Stacking
  readonly stack?: boolean;
  readonly stackType?: 'normal' | 'percent';
  readonly showPercentage?: boolean; // Display values as percentages of stack total
  
  // Multiple series
  readonly series?: readonly {
    readonly name: string;
    readonly data: readonly DataPoint[];
    readonly color?: string;
    readonly stack?: string;
  }[] | undefined;
  
  // Axes
  readonly xAxis?: AxisConfig | undefined;
  readonly yAxis?: AxisConfig | undefined;
  
  // Legend and tooltip
  readonly legend?: LegendConfig | undefined;
  readonly tooltip?: TooltipConfig | undefined;
  
  // Sorting
  readonly sortBy?: 'value' | 'category' | 'none';
  readonly sortOrder?: 'asc' | 'desc';
}

// Pie Chart Props
export interface PieChartProps extends BaseErgonomicChartProps {
  readonly data: readonly DataPoint[] | readonly { readonly name: string; readonly value: number }[];
  
  // Field mappings
  readonly nameField?: string;
  readonly valueField?: string;
  
  // Pie styling
  readonly radius?: number | readonly [number, number]; // Inner and outer radius for donut
  readonly startAngle?: number;
  readonly roseType?: boolean; // Rose/nightingale chart
  
  // Labels
  readonly showLabels?: boolean;
  readonly labelPosition?: 'inside' | 'outside' | 'center';
  readonly showValues?: boolean;
  readonly showPercentages?: boolean;
  readonly labelFormat?: string | ((params: any) => string) | undefined;
  
  // Legend and tooltip
  readonly legend?: LegendConfig | undefined;
  readonly tooltip?: TooltipConfig | undefined;
  
  // Interaction
  readonly selectedMode?: 'single' | 'multiple' | false;
  readonly emphasis?: boolean;
}

// Scatter Chart Props
export interface ScatterChartProps extends BaseErgonomicChartProps {
  readonly data: readonly DataPoint[] | readonly (readonly [number, number])[] | readonly (readonly [number, number, number])[];
  
  // Field mappings
  readonly xField?: string;
  readonly yField?: string;
  readonly sizeField?: string; // For bubble charts
  readonly colorField?: string; // For color-coded points
  readonly seriesField?: string;
  
  // Point styling
  readonly pointSize?: number | readonly [number, number]; // Min and max for size field
  readonly pointShape?: 'circle' | 'square' | 'triangle' | 'diamond';
  readonly pointOpacity?: number;
  
  // Multiple series
  readonly series?: readonly {
    readonly name: string;
    readonly data: readonly DataPoint[];
    readonly color?: string;
    readonly pointSize?: number;
    readonly pointShape?: string;
  }[];
  
  // Axes
  readonly xAxis?: AxisConfig | undefined;
  readonly yAxis?: AxisConfig | undefined;
  
  // Legend and tooltip
  readonly legend?: LegendConfig | undefined;
  readonly tooltip?: TooltipConfig | undefined;
  
  // Regression line
  readonly showTrendline?: boolean;
  readonly trendlineType?: 'linear' | 'polynomial' | 'exponential';
}

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

// Area Chart Props (extends LineChart)
export interface AreaChartProps extends Omit<LineChartProps, 'showArea'> {
  readonly stacked?: boolean;
  readonly stackType?: 'normal' | 'percent';
  readonly opacity?: number;
}

// Chart ref interface for ergonomic components
export interface ErgonomicChartRef {
  readonly getChart: () => EChartsType | null;
  readonly exportImage: (format?: 'png' | 'jpeg' | 'svg') => string;
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