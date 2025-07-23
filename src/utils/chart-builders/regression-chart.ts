import type { EChartsOption } from 'echarts/types/dist/shared';
import type { RegressionChartProps } from '@/types';

import { isObjectData } from '../data-processing';
import {
  buildBaseOption,
  buildAxisOption,
  buildLegendOption,
  calculateGridSpacing,
  buildTooltipOption,
} from '../base-options';

export function buildRegressionChartOption(props: RegressionChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  if (!props.data || props.data.length === 0) {
    return { ...baseOption, series: [] };
  }
  
  // Process data into the format needed for ecStat regression
  let sourceData: number[][];
  
  if (isObjectData(props.data)) {
    const xField = props.xField || 'x';
    const yField = props.yField || 'y';
    sourceData = props.data.map((item: any) => [
      Number(item[xField]) || 0,
      Number(item[yField]) || 0,
    ]);
  } else {
    sourceData = props.data.map((point: any) => {
      if (Array.isArray(point)) {
        return [Number(point[0]) || 0, Number(point[1]) || 0];
      }
      return [0, 0];
    });
  }
  
  // Default regression configuration
  const method = props.method || 'linear';
  const order = props.order || (method === 'polynomial' ? 2 : undefined);
  const showPoints = props.showPoints !== false;
  const showLine = props.showLine !== false;
  const showEquation = props.showEquation !== false;
  const _showRSquared = props.showRSquared !== false; // Available for future use
  
  // Point and line styling
  const pointSize = props.pointSize || 8;
  const pointShape = props.pointShape || 'circle';
  const pointOpacity = props.pointOpacity || 0.7;
  const lineWidth = props.lineWidth || 2;
  const lineStyle = props.lineStyle || 'solid';
  const lineColor = props.lineColor;
  const lineOpacity = props.lineOpacity || 1;
  
  // Labels
  const pointsLabel = props.pointsLabel || 'Data Points';
  const regressionLabel = props.regressionLabel || 'Regression Line';
  
  // Build datasets with ecStat regression transform
  const datasets: any[] = [
    {
      source: sourceData
    }
  ];
  
  // Add regression transform dataset if regression line should be shown
  if (showLine) {
    const regressionConfig: any = {
      method,
      formulaOn: showEquation ? (props.equationPosition === 'top-left' || props.equationPosition === 'bottom-left' ? 'start' : 'end') : false,
    };
    
    if (method === 'polynomial' && order !== undefined) {
      regressionConfig.order = order;
    }
    
    datasets.push({
      transform: {
        type: 'ecStat:regression',
        config: regressionConfig,
      }
    });
  }
  
  // Build series
  const series: any[] = [];
  
  // Scatter points series
  if (showPoints) {
    series.push({
      name: pointsLabel,
      type: 'scatter',
      datasetIndex: 0,
      symbolSize: pointSize,
      symbol: pointShape,
      itemStyle: {
        opacity: pointOpacity,
      },
      emphasis: {
        focus: 'series',
      },
    });
  }
  
  // Regression line series
  if (showLine) {
    const lineSeriesStyle: any = {
      width: lineWidth,
      type: lineStyle === 'dashed' ? 'dashed' : lineStyle === 'dotted' ? 'dotted' : 'solid',
      opacity: lineOpacity,
    };
    
    if (lineColor) {
      lineSeriesStyle.color = lineColor;
    }
    
    series.push({
      name: regressionLabel,
      type: 'line',
      datasetIndex: 1,
      symbolSize: 0,
      symbol: 'none',
      lineStyle: lineSeriesStyle,
      emphasis: {
        focus: 'series',
      },
      encode: { 
        tooltip: [0, 1]
      },
    });
  }
  
  // Build equation display if enabled
  const equationGraphic: any[] = [];
  if (showEquation && showLine) {
    const position = props.equationPosition || 'top-right';
    let x: string | number = '90%';
    let y: string | number = '10%';
    
    switch (position) {
      case 'top-left':
        x = '5%';
        y = '15%';
        break;
      case 'top-right':
        x = '90%';
        y = '15%';
        break;
      case 'bottom-left':
        x = '5%';
        y = '85%';
        break;
      case 'bottom-right':
        x = '90%';
        y = '85%';
        break;
    }
    
    // Note: The actual equation will be calculated by ecStat transform
    // This is a placeholder that will be updated by the transform
    equationGraphic.push({
      type: 'text',
      left: x,
      top: y,
      style: {
        text: 'Calculating equation...',
        fontSize: 12,
        fill: props.theme === 'dark' ? '#cccccc' : '#666666',
      },
    });
  }
  
  return {
    ...baseOption,
    dataset: datasets,
    grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, false),
    xAxis: {
      ...buildAxisOption(props.xAxis, 'numeric', props.theme),
      type: 'value',
      scale: true,
    },
    yAxis: {
      ...buildAxisOption(props.yAxis, 'numeric', props.theme),
      type: 'value',
      scale: true,
    },
    series,
    legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
    tooltip: buildTooltipOption(props.tooltip, props.theme),
    ...(equationGraphic.length > 0 && { graphic: equationGraphic }),
    ...props.customOption,
  };
}