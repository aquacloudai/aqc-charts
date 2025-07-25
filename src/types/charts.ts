import type { BaseErgonomicChartProps, DataPoint } from './base';
import type { AxisConfig, LegendConfig, TooltipConfig } from './config';

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
  
  // Individual series configuration (for data-driven charts)
  readonly seriesConfig?: Record<string, {
    readonly color?: string;
    readonly smooth?: boolean;
    readonly showArea?: boolean;
    readonly strokeStyle?: 'solid' | 'dashed' | 'dotted';
    readonly strokeWidth?: number;
    readonly pointSize?: number;
    readonly pointShape?: 'circle' | 'square' | 'triangle' | 'diamond';
    readonly showPoints?: boolean;
    readonly areaOpacity?: number;
    readonly yAxisIndex?: number; // Which Y axis to use (0 for first, 1 for second, etc.)
  }> | undefined;
  
  // Multiple series options
  readonly series?: readonly {
    readonly name: string;
    readonly data: readonly DataPoint[];
    readonly color?: string;
    readonly smooth?: boolean;
    readonly showArea?: boolean;
    readonly strokeStyle?: 'solid' | 'dashed' | 'dotted';
    readonly strokeWidth?: number;
    readonly pointSize?: number;
    readonly pointShape?: 'circle' | 'square' | 'triangle' | 'diamond';
    readonly showPoints?: boolean;
    readonly yAxisIndex?: number; // Which Y axis to use (0 for first, 1 for second, etc.)
  }[] | undefined;
  
  // Axes
  readonly xAxis?: AxisConfig | undefined;
  readonly yAxis?: AxisConfig | readonly AxisConfig[] | undefined; // Support single or multiple y-axes
  
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
  
  // Label visibility
  readonly showLabels?: boolean; // Show/hide data labels on bars
  readonly showAbsoluteValues?: boolean; // Show absolute values on bars
  readonly showPercentageLabels?: boolean; // Show percentage labels on bars (for stacked charts)
  
  // Multiple series
  readonly series?: readonly {
    readonly name: string;
    readonly data: readonly DataPoint[];
    readonly color?: string;
    readonly stack?: string;
    readonly yAxisIndex?: number; // Which Y axis to use (0 for first, 1 for second, etc.)
  }[] | undefined;
  
  // Axes
  readonly xAxis?: AxisConfig | undefined;
  readonly yAxis?: AxisConfig | readonly AxisConfig[] | undefined; // Support single or multiple y-axes
  
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

// Area Chart Props (extends LineChart)
export interface AreaChartProps extends Omit<LineChartProps, 'showArea'> {
  readonly stacked?: boolean;
  readonly stackType?: 'normal' | 'percent';
  readonly opacity?: number;
}

// Combined Chart Props
export interface CombinedChartProps extends BaseErgonomicChartProps {
  readonly data: readonly DataPoint[];
  
  // Field mappings
  readonly xField?: string;
  
  // Series configuration for mixed chart types
  readonly series: readonly {
    readonly field: string; // Data field to use for this series
    readonly type: 'line' | 'bar'; // Chart type for this series
    readonly name: string; // Display name
    readonly color?: string; // Series color
    readonly yAxisIndex?: number; // Which Y axis to use (0 or 1)
    
    // Line-specific options
    readonly smooth?: boolean;
    readonly strokeWidth?: number;
    readonly strokeStyle?: 'solid' | 'dashed' | 'dotted';
    readonly showPoints?: boolean;
    readonly pointSize?: number;
    readonly showArea?: boolean;
    readonly areaOpacity?: number;
    
    // Bar-specific options
    readonly barWidth?: number | string;
    readonly stack?: string; // Stack name for grouping bars
    readonly showLabels?: boolean;
  }[];
  
  // Axes (can have dual Y axes)
  readonly xAxis?: AxisConfig;
  readonly yAxis?: readonly AxisConfig[];
  
  // Legend and tooltip
  readonly legend?: LegendConfig;
  readonly tooltip?: TooltipConfig;
  
  // Zoom and interaction
  readonly zoom?: boolean;
  readonly pan?: boolean;
  readonly brush?: boolean;
}

// Geo Chart Props
export interface GeoChartProps extends BaseErgonomicChartProps {
  readonly data?: readonly { readonly name: string; readonly value: number }[];
  
  // Map configuration
  readonly mapName: string; // Registered map name (e.g., 'Norway', 'USA')
  readonly mapUrl?: string; // URL to GeoJSON data
  readonly mapType?: 'geojson' | 'svg'; // Type of map data
  readonly mapSpecialAreas?: Record<string, {
    readonly left: number;
    readonly top: number;
    readonly width: number;
  }>; // Special positioning for regions like Alaska, Hawaii
  
  // Chart type - determines whether to use 'map' series or 'geo' coordinate system
  readonly chartType?: 'map' | 'geo';
  
  // Field mappings
  readonly nameField?: string;
  readonly valueField?: string;
  
  // Visual map configuration (for 'map' type charts)
  readonly visualMap?: {
    readonly show?: boolean;
    readonly min?: number;
    readonly max?: number;
    readonly left?: string | number;
    readonly right?: string | number;
    readonly top?: string | number;
    readonly bottom?: string | number;
    readonly colors?: readonly string[];
    readonly text?: [string, string]; // [high, low] labels
    readonly calculable?: boolean;
    readonly orient?: 'horizontal' | 'vertical';
  };
  
  // Geo coordinate system configuration (for 'geo' type charts)
  readonly geo?: {
    readonly map?: string; // Map name
    readonly roam?: boolean | 'scale' | 'move';
    readonly layoutCenter?: readonly [string, string]; // e.g., ['50%', '50%']
    readonly layoutSize?: string | number; // e.g., '100%'
    readonly selectedMode?: 'single' | 'multiple' | boolean;
    readonly scaleLimit?: {
      readonly min?: number;
      readonly max?: number;
    };
    readonly itemStyle?: {
      readonly areaColor?: string; // Note: ECharts uses areaColor, not color for geo areas
      readonly borderColor?: string;
      readonly borderWidth?: number;
    };
    readonly emphasis?: {
      readonly itemStyle?: {
        readonly areaColor?: string;
        readonly borderColor?: string;
        readonly borderWidth?: number;
      };
      readonly label?: {
        readonly show?: boolean;
        readonly color?: string;
      };
    };
    readonly select?: {
      readonly itemStyle?: {
        readonly areaColor?: string;
        readonly borderColor?: string;
        readonly borderWidth?: number;
      };
      readonly label?: {
        readonly show?: boolean;
        readonly color?: string;
      };
    };
    readonly regions?: readonly {
      readonly name: string;
      readonly itemStyle?: {
        readonly areaColor?: string;
        readonly borderColor?: string;
        readonly borderWidth?: number;
      };
      readonly emphasis?: {
        readonly itemStyle?: {
          readonly areaColor?: string;
          readonly borderColor?: string;
          readonly borderWidth?: number;
        };
      };
      readonly select?: {
        readonly itemStyle?: {
          readonly areaColor?: string;
          readonly borderColor?: string;
          readonly borderWidth?: number;
        };
      };
      readonly tooltip?: {
        readonly show?: boolean;
        readonly position?: string | readonly [number, number];
        readonly alwaysShowContent?: boolean;
        readonly enterable?: boolean;
        readonly extraCssText?: string;
        readonly formatter?: string | ((params: any) => string);
      };
    }[];
    readonly tooltip?: {
      readonly show?: boolean;
      readonly confine?: boolean;
      readonly formatter?: string | ((params: any) => string);
    };
  };
  
  // Map styling (for 'map' type charts)
  readonly roam?: boolean | 'scale' | 'move'; // Enable zoom/pan
  readonly scaleLimit?: {
    readonly min?: number;
    readonly max?: number;
  };
  readonly itemStyle?: {
    readonly normal?: {
      readonly areaColor?: string;
      readonly borderColor?: string;
      readonly borderWidth?: number;
    };
    readonly emphasis?: {
      readonly areaColor?: string;
      readonly borderColor?: string;
      readonly borderWidth?: number;
    };
  };
  
  // Labels
  readonly showLabels?: boolean;
  readonly labelPosition?: 'inside' | 'outside';
  
  // Tooltip (global)
  readonly tooltip?: TooltipConfig | undefined;
  
  // Toolbox features
  readonly toolbox?: {
    readonly show?: boolean;
    readonly features?: {
      readonly dataView?: boolean;
      readonly restore?: boolean;
      readonly saveAsImage?: boolean;
    };
  };
  
  // Additional series configuration (for complex charts like the Sicily example)
  readonly additionalSeries?: readonly any[];
  readonly grid?: any; // For additional coordinate systems
  readonly xAxis?: any;
  readonly yAxis?: any;
  
  // Event handlers
  readonly onSelectChanged?: (params: any) => void;
  
  // Loading state for map data
  readonly onMapLoad?: () => void;
  readonly onMapError?: (error: Error) => void;
}