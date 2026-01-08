import React from 'react';
import type { AreaChartProps, ErgonomicChartRef } from '@/types';
/**
 * Ergonomic StackedAreaChart component with intuitive props
 *
 * @example
 * // Simple stacked area chart
 * <StackedAreaChart
 *   data={[
 *     { month: 'Jan', sales: 100, costs: 60 },
 *     { month: 'Feb', sales: 120, costs: 70 },
 *     { month: 'Mar', sales: 110, costs: 65 }
 *   ]}
 *   xField="month"
 *   yField={['sales', 'costs']}
 *   stacked
 * />
 */
declare const StackedAreaChart: React.ForwardRefExoticComponent<AreaChartProps & React.RefAttributes<ErgonomicChartRef>>;
export { StackedAreaChart };
//# sourceMappingURL=StackedAreaChart.d.ts.map