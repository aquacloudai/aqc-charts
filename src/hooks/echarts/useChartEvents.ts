import { useEffect, useRef } from 'react';
import type { EChartsType } from 'echarts/core';

type EventHandler = (params: any, chart: EChartsType) => void;

interface UseChartEventsProps {
  chartInstance: EChartsType | null;
  events?: Record<string, EventHandler> | undefined;
}

export function useChartEvents({
  chartInstance,
  events = {},
}: UseChartEventsProps) {
  const handlersRef = useRef<Map<string, (params: any) => void>>(new Map());

  useEffect(() => {
    if (!chartInstance) return;

    // Clear previous handlers
    handlersRef.current.forEach((handler, eventName) => {
      chartInstance.off(eventName, handler);
    });
    handlersRef.current.clear();

    // Register new handlers
    Object.entries(events).forEach(([eventName, handler]) => {
      const wrappedHandler = (params: any) => {
        handler(params, chartInstance);
      };
      
      handlersRef.current.set(eventName, wrappedHandler);
      chartInstance.on(eventName, wrappedHandler);
    });

    // Cleanup
    return () => {
      handlersRef.current.forEach((handler, eventName) => {
        chartInstance.off(eventName, handler);
      });
      handlersRef.current.clear();
    };
  }, [chartInstance, events]);
}