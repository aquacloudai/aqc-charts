import type { EChartsOption } from 'echarts/types/dist/shared';
import type { SankeyChartProps, SankeyNode, SankeyLink, DataPoint } from '@/types';

import { isObjectData } from '../data-processing';
import {
  buildBaseOption,
  buildLegendOption,
  buildTooltipOption,
} from '../base-options';

export function buildSankeyChartOption(props: SankeyChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  let nodes: SankeyNode[] = [];
  let links: SankeyLink[] = [];
  
  // Handle different data input formats
  if (props.nodes && props.links) {
    // Direct nodes and links provided
    nodes = [...props.nodes];
    links = [...props.links];
  } else if (props.data) {
    if (Array.isArray(props.data) && isObjectData(props.data)) {
      // Flat data format - need to extract nodes and links
      const flatData = props.data as DataPoint[];
      const sourceField = props.sourceField || 'source';
      const targetField = props.targetField || 'target';
      const valueField = props.valueField || 'value';
      
      // Extract unique nodes from source and target fields
      const nodeSet = new Set<string>();
      flatData.forEach(item => {
        const source = String(item[sourceField] || '');
        const target = String(item[targetField] || '');
        if (source) nodeSet.add(source);
        if (target) nodeSet.add(target);
      });
      
      // Convert to node objects
      nodes = Array.from(nodeSet).map(name => ({ name }));
      
      // Convert to link objects
      links = flatData.map(item => ({
        source: String(item[sourceField] || ''),
        target: String(item[targetField] || ''),
        value: Number(item[valueField]) || 0,
      }));
    } else {
      // Assume data is in { nodes, links } format
      const structuredData = props.data as { nodes: SankeyNode[]; links: SankeyLink[] };
      nodes = structuredData.nodes && Array.isArray(structuredData.nodes) ? [...structuredData.nodes] : [];
      links = structuredData.links && Array.isArray(structuredData.links) ? [...structuredData.links] : [];
    }
  }
  
  // Apply node styling and colors
  const processedNodes = nodes.map((node, index) => {
    const processedNode: any = { ...node };
    
    // Apply custom colors if provided
    if (props.nodeColors && props.nodeColors[index]) {
      processedNode.itemStyle = {
        ...processedNode.itemStyle,
        color: props.nodeColors[index],
      };
    }
    
    // Configure labels
    if (props.nodeLabels !== false) {
      processedNode.label = {
        show: true,
        position: props.nodeLabelPosition || (props.orient === 'vertical' ? 'bottom' : 'right'),
        formatter: props.showNodeValues 
          ? `{b}: {c}` 
          : `{b}`,
        ...processedNode.label,
      };
    } else {
      processedNode.label = { show: false };
    }
    
    return processedNode;
  });
  
  // Apply link styling
  const processedLinks = links.map((link, index) => {
    const processedLink: any = { ...link };
    
    // Apply link styling
    processedLink.lineStyle = {
      opacity: props.linkOpacity || 0.6,
      curveness: props.linkCurveness || 0.5,
      ...processedLink.lineStyle,
    };
    
    // Apply custom link colors if provided
    if (props.linkColors && props.linkColors[index]) {
      processedLink.lineStyle.color = props.linkColors[index];
    }
    
    // Show link labels if requested
    if (props.showLinkLabels) {
      processedLink.label = {
        show: true,
        formatter: '{c}',
        ...processedLink.label,
      };
    }
    
    return processedLink;
  });
  
  // Build series configuration
  const series: any = {
    type: 'sankey',
    layout: props.layout || 'none',
    orient: props.orient || 'horizontal', 
    nodeAlign: props.nodeAlign || 'justify',
    nodeGap: props.nodeGap || 8,
    nodeWidth: props.nodeWidth || 20,
    layoutIterations: props.iterations || 32,
    data: processedNodes,
    links: processedLinks,
    emphasis: {
      focus: props.focusMode || 'adjacency',
      ...(props.blurScope && { blurScope: props.blurScope }),
    },
    // Standard spacing
    left: '5%',
    top: props.title ? '15%' : '5%',
    right: '5%',
    bottom: '5%',
  };
  
  return {
    ...baseOption,
    series: [series],
    legend: props.legend ? buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme) : undefined,
    tooltip: props.tooltip ? buildTooltipOption(props.tooltip, props.theme) : {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: (params: any) => {
        if (params.dataType === 'edge') {
          return `${params.data.source} → ${params.data.target}<br/>Value: ${params.data.value}`;
        } else {
          return `${params.data.name}<br/>Value: ${params.data.value || 'N/A'}`;
        }
      },
    },
    ...props.customOption,
  };
}