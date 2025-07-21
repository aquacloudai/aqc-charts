import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ComposeOption, ECharts } from 'echarts/core';
import type { LineSeriesOption } from 'echarts/charts';
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DataZoomComponentOption,
  ToolboxComponentOption,
} from 'echarts/components';

// Register required components
echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  CanvasRenderer,
]);

// Type-safe option
type LineChartOption = ComposeOption<
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DataZoomComponentOption
  | ToolboxComponentOption
>;

interface LineChartProps {
  title: string;
  data: Array<{ time: string; value: number }>;
  height?: number | string;
  onPointClick?: (dataIndex: number) => void;
}

export function LineChartComponent({
  title,
  data,
  height = 400,
  onPointClick,
}: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | null>(null);

  // Memoize option
  const option = useMemo<LineChartOption>(() => ({
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    toolbox: {
      feature: {
        dataZoom: { yAxisIndex: 'none' },
        restore: {},
        saveAsImage: {},
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(d => d.time),
    },
    yAxis: {
      type: 'value',
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: title,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(255, 70, 131)',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgb(255, 158, 68)' },
            { offset: 1, color: 'rgb(255, 70, 131)' },
          ]),
        },
        data: data.map(d => d.value),
      },
    ],
  }), [title, data]);

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current);

    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  // Update option
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(option, {
        notMerge: true,
        lazyUpdate: true,
      });
    }
  }, [option]);

  // Handle events
  useEffect(() => {
    if (!chartInstance.current) return;

    const handleClick = (params: any) => {
      if (params.componentType === 'series') {
        onPointClick?.(params.dataIndex);
      }
    };

    chartInstance.current.on('click', handleClick);

    return () => {
      chartInstance.current?.off('click', handleClick);
    };
  }, [onPointClick]);

  // Handle resize
  useEffect(() => {
    if (!chartRef.current || !chartInstance.current) return;

    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return <div ref={chartRef} style={{ height, width: '100%' }} />;
}