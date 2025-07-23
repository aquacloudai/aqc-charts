import type { EChartsOption } from 'echarts/types/dist/shared';
import type { BarChartProps } from '@/types';

import {
  isObjectData,
  extractUniqueValues,
  groupDataByField,
} from '../data-processing';
import {
  buildBaseOption,
  buildAxisOption,
  buildLegendOption,
  calculateGridSpacing,
  buildTooltipOption,
} from '../base-options';

export function buildBarChartOption(props: BarChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  let series: any[] = [];
  let categoryData: any[] = [];
  
  // Helper function to create label configuration
  const createLabelConfig = (seriesData?: any, allSeriesData?: any, seriesIndex?: number) => {
    if (!props.showLabels && !props.showAbsoluteValues && !props.showPercentageLabels) {
      return { show: false };
    }
    
    return {
      show: true,
      position: (props.orientation === 'horizontal' ? 'right' : 'top') as any,
      formatter: (params: any) => {
        const showAbsolute = props.showAbsoluteValues || props.showLabels;
        const showPercent = props.showPercentageLabels;
        
        // For stacked charts with percentage labels, calculate percentage of stack total
        if (props.stack && showPercent && allSeriesData && typeof seriesIndex === 'number') {
          const dataIndex = params.dataIndex;
          
          // Calculate total for this category across all series
          let total = 0;
          for (let i = 0; i < allSeriesData.length; i++) {
            total += allSeriesData[i][dataIndex] || 0;
          }
          
          const currentValue = params.value;
          const percentage = total > 0 ? Math.round((currentValue / total) * 100) : 0;
          
          if (showAbsolute && showPercent) {
            return `${currentValue} (${percentage}%)`;
          } else if (showPercent) {
            return `${percentage}%`;
          }
        }
        
        // For non-stacked charts or absolute values only
        if (showAbsolute) {
          return params.value;
        }
        
        return params.value;
      }
    };
  };
  
  // Store all series data for percentage calculations if needed
  let allSeriesData: any[] = [];
  
  if (props.series) {
    // First, extract all series data for percentage calculations
    const extractedSeriesData = props.series.map((s) => 
      isObjectData(s.data) && props.valueField 
        ? s.data.map(item => item[props.valueField as string])
        : s.data
    );
    allSeriesData = extractedSeriesData;
    
    series = props.series.map((s, index) => {
      const seriesData = extractedSeriesData[index];
      return {
        name: s.name,
        type: 'bar',
        data: seriesData,
        itemStyle: { 
          color: s.color,
          borderRadius: props.borderRadius 
        },
        stack: s.stack || (props.stack ? 'defaultStack' : undefined),
        barWidth: props.barWidth,
        barGap: props.barGap,
        label: createLabelConfig(seriesData, allSeriesData, index),
      };
    });
    
    if (props.series && props.series[0] && isObjectData(props.series[0].data) && props.categoryField) {
      categoryData = props.series[0].data.map(item => (item as any)[props.categoryField as string]);
    }
  } else if (props.data) {
    if (isObjectData(props.data)) {
      if (props.seriesField) {
        const groups = groupDataByField(props.data, props.seriesField);
        const groupEntries = Object.entries(groups);
        
        // Extract all series data for percentage calculations
        allSeriesData = groupEntries.map(([, groupData]) => 
          groupData.map(item => item[props.valueField as string])
        );
        
        series = groupEntries.map(([name, groupData], index) => {
          const seriesData = groupData.map(item => item[props.valueField as string]);
          return {
            name,
            type: 'bar',
            data: seriesData,
            stack: props.stack ? 'defaultStack' : undefined,
            barWidth: props.barWidth,
            barGap: props.barGap,
            itemStyle: { borderRadius: props.borderRadius },
            label: createLabelConfig(seriesData, allSeriesData, index),
          };
        });
        categoryData = extractUniqueValues(props.data, props.categoryField as string);
      } else {
        if (Array.isArray(props.valueField)) {
          // Extract all series data for percentage calculations
          allSeriesData = props.valueField.map(field => 
            props.data!.map((item: any) => item[field])
          );
          
          series = props.valueField.map((field, index) => {
            const seriesData = props.data!.map((item: any) => item[field]);
            return {
              name: field,
              type: 'bar',
              data: seriesData,
              stack: props.stack ? 'defaultStack' : undefined,
              barWidth: props.barWidth,
              barGap: props.barGap,
              itemStyle: { borderRadius: props.borderRadius },
              label: createLabelConfig(seriesData, allSeriesData, index),
            };
          });
        } else {
          const seriesData = props.data.map((item: any) => item[props.valueField as string]);
          allSeriesData = [seriesData];
          
          series = [{
            type: 'bar',
            data: seriesData,
            stack: props.stack ? 'defaultStack' : undefined,
            barWidth: props.barWidth,
            barGap: props.barGap,
            itemStyle: { borderRadius: props.borderRadius },
            label: createLabelConfig(seriesData, allSeriesData, 0),
          }];
        }
        if (props.data) {
          categoryData = props.data.map((item: any) => item[props.categoryField as string]);
        }
      }
    } else {
      allSeriesData = [props.data];
      
      series = [{
        type: 'bar',
        data: props.data,
        stack: props.stack ? 'defaultStack' : undefined,
        barWidth: props.barWidth,
        barGap: props.barGap,
        itemStyle: { borderRadius: props.borderRadius },
        label: createLabelConfig(props.data, allSeriesData, 0),
      }];
    }
  }
  
  // Handle percentage calculation for stacked bars
  if (props.showPercentage && props.stack && series.length > 1) {
    // Calculate totals for each category
    const totalsByCategory: number[] = [];
    const categoryCount = Math.max(...series.map(s => s.data.length));
    const originalData: number[][] = series.map(s => [...s.data]);
    
    for (let i = 0; i < categoryCount; i++) {
      let sum = 0;
      for (const seriesItem of series) {
        sum += seriesItem.data[i] || 0;
      }
      totalsByCategory.push(sum);
    }
    
    // Convert values to percentages
    series = series.map((seriesItem, seriesIndex) => ({
      ...seriesItem,
      data: seriesItem.data.map((value: number, index: number) => {
        const total = totalsByCategory[index];
        return (total === undefined || total <= 0) ? 0 : value / total;
      }),
      // Update label configuration for percentage mode
      label: {
        show: props.showLabels || props.showAbsoluteValues || props.showPercentageLabels,
        position: (props.orientation === 'horizontal' ? 'right' : 'top') as any,
        formatter: (params: any) => {
          const originalValue = originalData[seriesIndex]?.[params.dataIndex];
          const percentageValue = Math.round(params.value * 100);
          
          if (props.showAbsoluteValues && props.showPercentageLabels) {
            return `${originalValue} (${percentageValue}%)`;
          } else if (props.showPercentageLabels) {
            return `${percentageValue}%`;
          } else if (props.showAbsoluteValues || props.showLabels) {
            return originalValue;
          }
          return `${percentageValue}%`;
        }
      }
    }));
  }
  
  // Handle sorting
  if (props.sortBy && props.sortBy !== 'none') {
    // Implement sorting logic here
  }
  
  const isHorizontal = props.orientation === 'horizontal';
  
  // Handle percentage stacking or showPercentage
  if ((props.stackType === 'percent' || props.showPercentage) && props.stack) {
    const yAxisOptions = isHorizontal 
      ? buildAxisOption(props.yAxis, 'categorical', props.theme)
      : buildAxisOption(props.yAxis, 'numeric', props.theme);
    
    // For showPercentage, we need custom tooltip formatting
    let tooltipConfig = props.tooltip;
    if (props.showPercentage && !props.tooltip?.format) {
      tooltipConfig = {
        ...props.tooltip,
        show: true,
        trigger: 'axis',
        format: (params: any) => {
          if (!Array.isArray(params)) return '';
          
          let result = `${params[0].name}<br/>`;
          for (const param of params) {
            const percentage = Math.round(param.value * 1000) / 10;
            result += `${param.marker}${param.seriesName}: ${percentage}%<br/>`;
          }
          return result;
        }
      };
    }
    
    if (!isHorizontal) {
      if (props.stackType === 'percent') {
        (yAxisOptions as any).max = 100;
        (yAxisOptions as any).axisLabel = {
          ...(yAxisOptions as any).axisLabel,
          formatter: '{value}%'
        };
      } else if (props.showPercentage) {
        (yAxisOptions as any).max = 1;
        (yAxisOptions as any).axisLabel = {
          ...(yAxisOptions as any).axisLabel,
          formatter: (value: number) => `${Math.round(value * 100)}%`
        };
      }
    }
    
    return {
      ...baseOption,
      grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, false),
      xAxis: isHorizontal 
        ? { 
            ...buildAxisOption(props.xAxis, 'numeric', props.theme), 
            ...(props.stackType === 'percent' ? { max: 100, axisLabel: { formatter: '{value}%' } } : {}),
            ...(props.showPercentage && props.stackType !== 'percent' ? { max: 1, axisLabel: { formatter: (value: number) => `${Math.round(value * 100)}%` } } : {})
          }
        : { ...buildAxisOption(props.xAxis, 'categorical', props.theme), data: categoryData, boundaryGap: true },
      yAxis: isHorizontal
        ? { ...yAxisOptions, data: categoryData, boundaryGap: true }
        : yAxisOptions,
      series: series.map(s => ({ ...s, stack: props.stackType === 'percent' ? 'percent' : 'defaultStack' })),
      legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
      tooltip: buildTooltipOption(tooltipConfig, props.theme),
      ...props.customOption,
    };
  }
  
  return {
    ...baseOption,
    grid: calculateGridSpacing(props.legend, !!props.title, !!props.subtitle, false),
    xAxis: isHorizontal 
      ? buildAxisOption(props.xAxis, 'numeric', props.theme)
      : { ...buildAxisOption(props.xAxis, 'categorical', props.theme), data: categoryData, boundaryGap: true },
    yAxis: isHorizontal
      ? { ...buildAxisOption(props.yAxis, 'categorical', props.theme), data: categoryData, boundaryGap: true }
      : buildAxisOption(props.yAxis, 'numeric', props.theme),
    series,
    legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme), // Bar charts don't typically use zoom
    tooltip: buildTooltipOption(props.tooltip, props.theme),
    ...props.customOption,
  };
}