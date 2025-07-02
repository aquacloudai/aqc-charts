import type { EChartsType } from 'echarts/core';
type EventHandler = (params: any, chart: EChartsType) => void;
interface UseChartEventsProps {
    chartInstance: EChartsType | null;
    events?: Record<string, EventHandler> | undefined;
}
export declare function useChartEvents({ chartInstance, events, }: UseChartEventsProps): void;
export {};
//# sourceMappingURL=useChartEvents.d.ts.map