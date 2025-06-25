/**
 * Helper functions for creating ECharts options easily
 */

import type { EChartsOption } from 'echarts/types/dist/shared';

/**
 * Create a basic line chart option
 */
export function createLineChartOption(data: {
  categories: string[];
  series: Array<{
    name: string;
    data: number[];
    color?: string;
  }>;
  title?: string;
}): EChartsOption {
  const option: any = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: data.title ? (data.series.length > 1 ? 100 : 80) : (data.series.length > 1 ? 60 : 40),
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.categories,
      boundaryGap: false
    },
    yAxis: {
      type: 'value'
    },
    series: data.series.map(s => {
      const seriesItem: any = {
        name: s.name,
        type: 'line' as const,
        data: s.data
      };
      if (s.color) {
        seriesItem.itemStyle = { color: s.color };
      }
      return seriesItem;
    })
  };

  if (data.title) {
    option.title = {
      text: data.title,
      left: 'center'
    };
  }

  if (data.series.length > 1) {
    option.legend = {
      data: data.series.map(s => s.name),
      top: data.title ? 60 : 20
    };
  }

  return option;
}

/**
 * Create a basic bar chart option
 */
export function createBarChartOption(data: {
  categories: string[];
  series: Array<{
    name: string;
    data: number[];
    color?: string;
  }>;
  title?: string;
}): EChartsOption {
  const option: any = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: data.title ? (data.series.length > 1 ? 100 : 80) : (data.series.length > 1 ? 60 : 40),
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.categories
    },
    yAxis: {
      type: 'value'
    },
    series: data.series.map(s => {
      const seriesItem: any = {
        name: s.name,
        type: 'bar' as const,
        data: s.data
      };
      if (s.color) {
        seriesItem.itemStyle = { color: s.color };
      }
      return seriesItem;
    })
  };

  if (data.title) {
    option.title = {
      text: data.title,
      left: 'center'
    };
  }

  if (data.series.length > 1) {
    option.legend = {
      data: data.series.map(s => s.name),
      top: data.title ? 60 : 20
    };
  }

  return option;
}

/**
 * Create a basic pie chart option
 */
export function createPieChartOption(data: {
  data: Array<{
    name: string;
    value: number;
  }>;
  title?: string;
}): EChartsOption {
  const option: any = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      data: data.data.map(d => d.name),
      top: data.title ? 60 : 20
    },
    series: [{
      name: 'Data',
      type: 'pie' as const,
      radius: '50%',
      data: data.data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  if (data.title) {
    option.title = {
      text: data.title,
      left: 'center'
    };
  }

  return option;
}

/**
 * Create a basic sankey chart option
 */
export function createSankeyChartOption(data: {
  nodes: Array<{
    readonly name: string;
    readonly value?: number;
    readonly depth?: number;
    readonly itemStyle?: unknown;
    readonly label?: unknown;
    readonly emphasis?: unknown;
  }>;
  links: Array<{
    readonly source: string | number;
    readonly target: string | number;
    readonly value: number;
    readonly lineStyle?: unknown;
    readonly emphasis?: unknown;
  }>;
  layout?: 'none' | 'circular';
  orient?: 'horizontal' | 'vertical';
  nodeAlign?: 'justify' | 'left' | 'right';
  nodeGap?: number;
  nodeWidth?: number;
  iterations?: number;
  title?: string;
}): EChartsOption {
  const option: any = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [{
      type: 'sankey',
      layout: data.layout || 'none',
      orient: data.orient || 'horizontal',
      nodeAlign: data.nodeAlign || 'justify',
      nodeGap: data.nodeGap || 8,
      nodeWidth: data.nodeWidth || 20,
      iterations: data.iterations || 32,
      emphasis: {
        focus: 'adjacency'
      },
      data: data.nodes.map(node => {
        const result: any = { name: node.name };
        if (node.value !== undefined) result.value = node.value;
        if (node.depth !== undefined) result.depth = node.depth;
        if (node.itemStyle) result.itemStyle = node.itemStyle;
        if (node.label) result.label = node.label;
        if (node.emphasis) result.emphasis = node.emphasis;
        return result;
      }),
      links: data.links.map(link => {
        const result: any = {
          source: link.source,
          target: link.target,
          value: link.value,
        };
        if (link.lineStyle) result.lineStyle = link.lineStyle;
        if (link.emphasis) result.emphasis = link.emphasis;
        return result;
      })
    }]
  };

  if (data.title) {
    option.title = {
      text: data.title,
      left: 'center'
    };
  }

  return option;
}

/**
 * Merge ECharts options (simple deep merge)
 */
export function mergeOptions(base: EChartsOption, override: Partial<EChartsOption>): EChartsOption {
  const result = { ...base };
  
  for (const key in override) {
    const overrideValue = override[key as keyof EChartsOption];
    const baseValue = result[key as keyof EChartsOption];
    
    if (overrideValue !== undefined) {
      if (
        typeof overrideValue === 'object' && 
        overrideValue !== null && 
        !Array.isArray(overrideValue) &&
        typeof baseValue === 'object' && 
        baseValue !== null && 
        !Array.isArray(baseValue)
      ) {
        // Deep merge objects
        (result as any)[key] = { ...baseValue, ...overrideValue };
      } else {
        // Direct assignment for primitives, arrays, and null values
        (result as any)[key] = overrideValue;
      }
    }
  }
  
  return result;
}