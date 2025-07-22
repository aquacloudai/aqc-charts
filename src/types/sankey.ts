import type { BaseErgonomicChartProps, DataPoint } from './base';
import type { LegendConfig, TooltipConfig } from './config';

// Node data structure for Sankey charts
export interface SankeyNode {
  readonly name: string;
  readonly value?: number;
  readonly depth?: number;
  readonly itemStyle?: {
    readonly color?: string;
    readonly borderColor?: string;
    readonly borderWidth?: number;
  };
  readonly label?: {
    readonly show?: boolean;
    readonly position?: 'left' | 'right' | 'top' | 'bottom' | 'inside' | 'insideLeft' | 'insideRight';
    readonly fontSize?: number;
    readonly color?: string;
    readonly formatter?: string | ((params: any) => string);
  };
  readonly emphasis?: Record<string, any>;
}

// Link data structure for Sankey charts
export interface SankeyLink {
  readonly source: string | number;
  readonly target: string | number;
  readonly value: number;
  readonly lineStyle?: {
    readonly color?: string;
    readonly opacity?: number;
    readonly curveness?: number;
  };
  readonly emphasis?: Record<string, any>;
}

// Sankey Chart Props
export interface SankeyChartProps extends BaseErgonomicChartProps {
  readonly data: readonly DataPoint[] | { readonly nodes: readonly SankeyNode[]; readonly links: readonly SankeyLink[] };
  
  // Field mappings for object data
  readonly sourceField?: string | undefined; // For flat data: which field contains the source
  readonly targetField?: string | undefined; // For flat data: which field contains the target
  readonly valueField?: string | undefined; // For flat data: which field contains the value
  readonly nodeNameField?: string | undefined; // For flat data: which field contains node names
  
  // Manual nodes and links (alternative to data)
  readonly nodes?: readonly SankeyNode[] | undefined;
  readonly links?: readonly SankeyLink[] | undefined;
  
  // Layout configuration
  readonly layout?: 'none' | 'circular' | undefined;
  readonly orient?: 'horizontal' | 'vertical' | undefined;
  readonly nodeAlign?: 'justify' | 'left' | 'right' | undefined;
  readonly nodeGap?: number | undefined; // Gap between nodes
  readonly nodeWidth?: number | undefined; // Width of node rectangles
  readonly iterations?: number | undefined; // Layout iterations for optimization
  
  // Node styling
  readonly nodeColors?: readonly string[] | undefined; // Custom colors for nodes
  readonly showNodeValues?: boolean | undefined; // Show values in node labels
  readonly nodeLabels?: boolean | undefined; // Show/hide node labels
  readonly nodeLabelPosition?: 'left' | 'right' | 'top' | 'bottom' | 'inside' | undefined;
  
  // Link styling  
  readonly linkColors?: readonly string[] | undefined; // Custom colors for links
  readonly linkOpacity?: number | undefined; // Link transparency
  readonly linkCurveness?: number | undefined; // How curved the links are (0-1)
  readonly showLinkLabels?: boolean | undefined; // Show values on links
  
  // Focus and emphasis
  readonly focusMode?: 'none' | 'adjacency' | 'trajectory' | undefined; // Hover focus behavior
  readonly blurScope?: 'coordinateSystem' | 'series' | 'global' | undefined;
  
  // Legend and tooltip
  readonly legend?: LegendConfig | undefined;
  readonly tooltip?: TooltipConfig | undefined;
}