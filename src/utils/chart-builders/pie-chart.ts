import type { EChartsOption } from 'echarts/types/dist/shared';
import type { PieChartProps } from '@/types';

import { isObjectData } from '../data-processing';
import {
  buildBaseOption,
  buildLegendOption,
  buildTooltipOption,
} from '../base-options';

// Helper function to wrap long text labels with line breaks
function wrapLongText(text: string, maxLength: number = 25): string {
  if (!text || text.length <= maxLength) return text;

  // Split on common Norwegian word boundaries and punctuation
  const words = text.split(/(\s+|[-–—])/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + word;
    if (testLine.length <= maxLength) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        // Single word is too long, force break
        lines.push(word);
        currentLine = '';
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine.trim());
  }

  return lines.join('\n');
}

export function buildPieChartOption(props: PieChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  const isDark = props.theme === 'dark';

  let data: any[] = [];

  const wrapLength = props.labelWrapLength || 25;

  if (props.data && isObjectData(props.data)) {
    if (props.nameField && props.valueField) {
      data = props.data.map(item => ({
        name: wrapLongText((item as any)[props.nameField as string], wrapLength),
        value: (item as any)[props.valueField as string],
        originalName: (item as any)[props.nameField as string], // Keep original for tooltip
      }));
    } else {
      // Assume first property is name, second is value
      const firstItem = props.data[0];
      if (firstItem) {
        const keys = Object.keys(firstItem);
        data = props.data.map(item => ({
          name: wrapLongText((item as any)[keys[0]!], wrapLength),
          value: (item as any)[keys[1]!],
          originalName: (item as any)[keys[0]!],
        }));
      }
    }
  } else if (props.data) {
    data = (props.data as any[]).map((item: any) => ({
      ...item,
      name: wrapLongText(item.name || '', wrapLength),
      originalName: item.name || item.originalName || '',
    }));
  }

  // Handle radius - support both number and string percentages
  const radius = Array.isArray(props.radius) ? props.radius : ['0%', (props.radius || 75) + '%'];

  // Extract center and radius from customOption if provided
  const customCenter = props.customOption?.series?.[0]?.center || props.customOption?.center;
  const customRadius = props.customOption?.series?.[0]?.radius || props.customOption?.radius;

  // Calculate proper center position accounting for title and legend
  const hasTitle = !!props.title;
  const hasSubtitle = !!props.subtitle;
  const hasLegend = props.legend && props.legend.show !== false;
  const legendPosition = props.legend?.position || 'top';

  let centerY = '50%';
  let centerX = '50%';

  // If customCenter is provided, use it but still adjust for titles if it's the default center
  const isDefaultCenter = customCenter &&
    Array.isArray(customCenter) &&
    customCenter[0] === '50%' &&
    customCenter[1] === '50%';

  if (!customCenter || isDefaultCenter) {
    // Adjust vertical center based on title/subtitle and legend
    if (hasTitle && hasSubtitle) {
      centerY = legendPosition === 'top' ? '60%' : '55%'; // More space needed
    } else if (hasTitle || (hasLegend && legendPosition === 'top')) {
      centerY = '55%'; // Moderate space adjustment
    }
  }

  // Use custom center if provided, otherwise use calculated center
  const finalCenter = customCenter && !isDefaultCenter ? customCenter : [centerX, centerY];

  return {
    ...baseOption,
    // Override title positioning for pie charts to prevent overlap
    ...(props.title && {
      title: {
        text: props.title,
        ...(props.subtitle && { subtext: props.subtitle }),
        left: props.titlePosition || 'center',
        top: '2%', // Fixed top position to ensure no overlap
        textStyle: {
          color: isDark ? '#ffffff' : '#333333',
        },
        subtextStyle: {
          color: isDark ? '#cccccc' : '#666666',
        },
      }
    }),
    series: [{
      type: 'pie',
      data,
      radius: customRadius || radius,
      center: finalCenter,
      startAngle: props.startAngle || 90,
      ...(props.roseType ? { roseType: 'area' as const } : {}),
      label: {
        show: props.showLabels !== false,
        position: props.labelPosition || 'outside',
        formatter: props.labelFormat || (props.showPercentages ? '{b}: {d}%' : '{b}: {c}'),
        color: isDark ? '#ffffff' : '#333333',
        fontSize: 12,
        fontWeight: 'normal',
        distanceToLabelLine: 5,
        alignTo: 'none',
        bleedMargin: 10,
        lineHeight: 16,
        rich: {
          name: {
            color: isDark ? '#ffffff' : '#333333',
            fontSize: 12,
            lineHeight: 16
          },
          value: {
            color: isDark ? '#cccccc' : '#666666',
            fontSize: 11
          }
        }
      },
      labelLine: {
        show: (props.labelPosition || 'outside') === 'outside',
        length: 15,
        length2: 10,
        smooth: false,
        lineStyle: {
          color: isDark ? '#666666' : '#cccccc',
          width: 1
        }
      },
      selectedMode: props.selectedMode || false,
      ...(props.emphasis !== false ? {
        emphasis: {
          focus: 'self',
          label: {
            fontSize: 13,
            fontWeight: 'bold'
          }
        }
      } : {}),
    }],
    legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
    tooltip: {
      ...buildTooltipOption(props.tooltip, props.theme),
      extraCssText: 'max-width: 300px; white-space: normal; word-wrap: break-word;',
      formatter: (params: any) => {
        const originalName = params.data.originalName || params.name;
        const value = params.value;
        const percent = params.percent;
        return `<div style="padding: 8px;">
          <strong>${originalName}</strong><br/>
          Value: ${typeof value === 'number' ? value.toLocaleString() : value}<br/>
          Percentage: ${percent}%
        </div>`;
      }
    },
    ...props.customOption,
  };
}