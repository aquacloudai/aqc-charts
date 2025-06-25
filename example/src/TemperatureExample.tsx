import React from 'react';
import { LineChart } from 'aqc-charts';
import type { ChartSeries, LegendConfig, TooltipConfig } from 'aqc-charts';

// Example data structure similar to your temperature data
const temperatureData: ChartSeries[] = [
  {
    name: 'Overflate - Area 1',
    type: 'line',
    data: [12.5, 13.2, 14.1, 15.8, 16.2, 17.1, 16.8, 15.9],
    color: '#FFD93D',
    lineStyle: {
      type: 'dotted',
      width: 2,
    },
    symbol: 'circle',
    symbolSize: 4,
    smooth: true,
    connectNulls: false,
  },
  {
    name: 'Dyp - Area 1',
    type: 'line',
    data: [8.1, 8.5, 9.2, 10.1, 11.3, 12.0, 11.8, 10.9],
    color: '#FFD93D',
    lineStyle: {
      type: 'dashed',
      width: 2,
    },
    symbol: 'none',
    smooth: true,
    connectNulls: false,
  },
  {
    name: 'Overflate - Area 2',
    type: 'line',
    data: [13.1, 13.8, 14.5, 16.2, 16.8, 17.5, 17.2, 16.3],
    color: '#6BCF7F',
    lineStyle: {
      type: 'dotted',
      width: 2,
    },
    symbol: 'circle',
    symbolSize: 4,
    smooth: true,
    connectNulls: false,
  },
  {
    name: 'Dyp - Area 2',
    type: 'line',
    data: [8.8, 9.2, 9.8, 10.5, 11.8, 12.3, 12.1, 11.4],
    color: '#6BCF7F',
    lineStyle: {
      type: 'dashed',
      width: 2,
    },
    symbol: 'none',
    smooth: true,
    connectNulls: false,
  },
];

const xAxisData = ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12', 'Feb 19'];

const legendConfig: LegendConfig = {
  type: 'scroll',
  orient: 'vertical',
  right: 10,
  top: 20,
  bottom: 20,
  textStyle: {
    color: '#ffffff',
  },
  pageTextStyle: {
    color: '#ffffff',
  },
};

const tooltipConfig: TooltipConfig = {
  trigger: 'axis',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  borderColor: '#4a5568',
  textStyle: {
    color: '#ffffff',
  },
  formatter: (params: any) => {
    if (!Array.isArray(params)) return '';

    let tooltip = `<div style="margin-bottom: 8px;"><strong>${params[0].axisValue}</strong></div>`;
    params.forEach((param: any) => {
      if (param.value !== null) {
        tooltip += `<div style="margin: 4px 0;">
          <span style="color: ${param.color};">●</span> 
          ${param.seriesName}: <strong>${param.value}°C</strong>
        </div>`;
      }
    });
    return tooltip;
  },
};

export const TemperatureExample: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '600px',
      backgroundColor: '#1a365d',
      padding: '20px',
    }}>
      <LineChart
        data={temperatureData}
        width="100%"
        height="100%"
        title={{
          text: 'Temperaturutvikling per område og dybde',
          subtext: '2024-01-01 - 2024-02-19',
          textStyle: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 'bold',
          },
          subtextStyle: {
            color: '#a0aec0',
            fontSize: 12,
          },
          left: 'left',
        }}
        xAxis={{
          type: 'category',
          data: xAxisData,
          axisLabel: {
            color: '#a0aec0',
            rotate: 45,
          },
          axisLine: {
            lineStyle: {
              color: '#4a5568',
            },
          },
        }}
        yAxis={{
          type: 'value',
          name: 'Temperatur (°C)',
          nameTextStyle: {
            color: '#ffffff',
          },
          axisLabel: {
            color: '#a0aec0',
            formatter: '{value}°C'
          },
          axisLine: {
            lineStyle: {
              color: '#4a5568',
            },
          },
          splitLine: {
            lineStyle: {
              color: '#2d3748',
            },
          },
        }}
        legend={legendConfig}
        tooltip={tooltipConfig}
        theme={{
          backgroundColor: '#1a365d',
          textStyle: {
            color: '#ffffff',
          },
        }}
      />
    </div>
  );
};