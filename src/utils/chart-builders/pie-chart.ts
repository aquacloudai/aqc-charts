import type { EChartsOption } from 'echarts/types/dist/shared';
import type { PieChartProps } from '@/types';

import { isObjectData } from '../data-processing';
import {
  buildBaseOption,
  buildLegendOption,
  buildTooltipOption,
} from '../base-options';

export function buildPieChartOption(props: PieChartProps): EChartsOption {
  const baseOption = buildBaseOption(props);
  
  let data: any[] = [];
  
  if (props.data && isObjectData(props.data)) {
    if (props.nameField && props.valueField) {
      data = props.data.map(item => ({
        name: (item as any)[props.nameField as string],
        value: (item as any)[props.valueField as string],
      }));
    } else {
      // Assume first property is name, second is value
      const firstItem = props.data[0];
      if (firstItem) {
        const keys = Object.keys(firstItem);
        data = props.data.map(item => ({
          name: (item as any)[keys[0]!],
          value: (item as any)[keys[1]!],
        }));
      }
    }
  } else if (props.data) {
    data = [...props.data];
  }
  
  const radius = Array.isArray(props.radius) ? props.radius : ['0%', (props.radius || 75) + '%'];
  
  return {
    ...baseOption,
    series: [{
      type: 'pie',
      data,
      radius,
      startAngle: props.startAngle || 90,
      ...(props.roseType ? { roseType: 'area' as const } : {}),
      label: {
        show: props.showLabels !== false,
        position: props.labelPosition || 'outside',
        formatter: props.labelFormat || (props.showPercentages ? '{b}: {d}%' : '{b}: {c}'),
      },
      selectedMode: props.selectedMode || false,
      ...(props.emphasis !== false ? { emphasis: { focus: 'self' } } : {}),
    }],
    legend: buildLegendOption(props.legend, !!props.title, !!props.subtitle, false, props.theme),
    tooltip: buildTooltipOption(props.tooltip, props.theme),
    ...props.customOption,
  };
}