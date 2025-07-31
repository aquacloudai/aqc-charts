import React, { useRef } from 'react';
import { BaseChart } from './src/components/BaseChart';
import type { ChartRef, EChartsOption } from './src/types';

// Sample logo as base64 SVG
const SAMPLE_LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjMDA3N2ZmIiByeD0iNSIvPgo8dGV4dCB4PSI1MCIgeT0iMzAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIj5BUUMgQ28uPC90ZXh0Pgo8L3N2Zz4K';

const TestLogoChart: React.FC = () => {
  const chartRef = useRef<ChartRef>(null);

  const chartOption: EChartsOption = {
    title: {
      text: 'Sales Performance'
    },
    tooltip: {},
    legend: {
      data: ['Sales']
    },
    xAxis: {
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: {},
    series: [{
      name: 'Sales',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }]
  };

  const handleExport = () => {
    if (chartRef.current && chartRef.current.exportImage) {
      const dataURL = chartRef.current.exportImage({ 
        type: 'png',
        backgroundColor: '#ffffff'
      });
      console.log('Exported chart with logo:', dataURL.substring(0, 100) + '...');
    }
  };

  const handleSave = () => {
    if (chartRef.current && chartRef.current.saveAsImage) {
      chartRef.current.saveAsImage('chart-with-logo.png', {
        type: 'png',
        backgroundColor: '#ffffff'
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Logo Functionality Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Chart with Logo (Always Visible)</h3>
        <BaseChart
          ref={chartRef}
          option={chartOption}
          width={600}
          height={400}
          logo={{
            src: SAMPLE_LOGO,
            position: 'bottom-right',
            width: 80,
            height: 40,
            opacity: 0.8
          }}
        />
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleExport} style={{ marginRight: '10px' }}>
            Get Data URL
          </button>
          <button onClick={handleSave}>
            Save as PNG
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Chart with Export-Only Logo</h3>
        <BaseChart
          option={chartOption}
          width={600}
          height={400}
          logo={{
            src: SAMPLE_LOGO,
            position: 'top-left',
            width: 100,
            height: 50,
            opacity: 0.9,
            onSaveOnly: true
          }}
        />
        <p>This logo only appears when the chart is exported/saved.</p>
      </div>
    </div>
  );
};

export default TestLogoChart;