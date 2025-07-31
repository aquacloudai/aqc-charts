import React, { useRef } from 'react';
import { LineChart } from 'aqc-charts';
import type { ChartRef } from 'aqc-charts';

// Sample company logo (base64 encoded sample logo - replace with your actual logo)
const COMPANY_LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjMDA3N2ZmIiByeD0iNSIvPgo8dGV4dCB4PSI1MCIgeT0iMzAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIj5BUUMgQ28uPC90ZXh0Pgo8L3N2Zz4K';

const LogoChartExample: React.FC = () => {
  const chartRef = useRef<ChartRef>(null);

  const data = [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 200 },
    { name: 'Mar', value: 150 },
    { name: 'Apr', value: 80 },
    { name: 'May', value: 70 },
    { name: 'Jun', value: 110 },
    { name: 'Jul', value: 130 },
  ];

  const handleExportWithLogo = () => {
    if (chartRef.current) {
      chartRef.current.saveAsImage('chart-with-logo.png', {
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
    }
  };

  const handleExportDataURL = () => {
    if (chartRef.current) {
      const dataURL = chartRef.current.exportImage({
        type: 'png',
        pixelRatio: 1,
        backgroundColor: '#ffffff'
      });
      console.log('Chart data URL:', dataURL);
    }
  };

  return (
    <div className="logo-chart-example">
      <h2>Chart with Company Logo Examples</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>1. Logo Always Visible (Bottom Right)</h3>
        <LineChart
          ref={chartRef}
          data={data}
          title="Revenue Growth"
          width={800}
          height={400}
          logo={{
            src: COMPANY_LOGO,
            position: 'bottom-right',
            width: 100,
            height: 50,
            opacity: 0.8
          }}
        />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button onClick={handleExportWithLogo} style={{ padding: '8px 16px', backgroundColor: '#007fff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Save as PNG
          </button>
          <button onClick={handleExportDataURL} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Get Data URL
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>2. Logo Only on Save/Export (Top Left)</h3>
        <LineChart
          data={data}
          title="Sales Performance"
          width={800}
          height={400}
          logo={{
            src: COMPANY_LOGO,
            position: 'top-left',
            width: 80,
            height: 40,
            opacity: 0.9,
            onSaveOnly: true // Logo only appears when exporting
          }}
        />
        <div style={{ marginTop: '1rem' }}>
          <button 
            onClick={() => {
              // We need a reference to call saveAsImage
              const chart = document.querySelector('.aqc-charts-container canvas')?.parentElement;
              console.log('Logo will appear only when exported');
            }}
            style={{ padding: '8px 16px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            This logo appears only on export
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>3. Custom Positioned Logo (Center)</h3>
        <LineChart
          data={data}
          title="Market Analysis"
          width={800}
          height={400}
          logo={{
            src: COMPANY_LOGO,
            x: 350, // Custom x position
            y: 180, // Custom y position
            width: 120,
            height: 60,
            opacity: 0.3 // More transparent for watermark effect
          }}
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Configuration Examples</h3>
        <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px' }}>
          <h4>Always Visible Logo:</h4>
          <pre>{`logo={{
  src: 'data:image/svg+xml;base64,...', // or URL
  position: 'bottom-right', // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  width: 100,
  height: 50,
  opacity: 0.8
}}`}</pre>
          
          <h4>Export-Only Logo:</h4>
          <pre>{`logo={{
  src: 'https://your-company.com/logo.png',
  position: 'top-left',
  width: 80,
  height: 40,
  onSaveOnly: true // Only appears during export
}}`}</pre>
          
          <h4>Custom Positioned Logo:</h4>
          <pre>{`logo={{
  src: 'your-logo.png',
  x: 350, // Custom x coordinate
  y: 180, // Custom y coordinate
  width: 120,
  height: 60,
  opacity: 0.3 // Watermark effect
}}`}</pre>
        </div>
      </div>
    </div>
  );
};

export default LogoChartExample;