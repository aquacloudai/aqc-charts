import React, { useState, useCallback, useMemo } from 'react';
import { GeoChart } from '../../../src';
import type { GeoChartProps } from '../../../src';

interface WaterTypologyWorkingProps {
  theme: 'light' | 'dark';
  colorPalette: string[];
  onInteraction: (data: string) => void;
}

// Marine environment data
const marineData = {
  coastal: [
    { name: 'norway-coastline', value: 85.2 },
    { name: 'water-types', value: 78.9 },
  ],
  fjord: [
    { name: 'norway-coastline', value: 45.8 },
    { name: 'water-types', value: 52.3 },
  ],
  ocean: [
    { name: 'norway-coastline', value: 156.4 },
    { name: 'water-types', value: 198.7 },
  ]
};

const ExampleCard = ({ 
  title, 
  children,
  theme
}: { 
  title: string; 
  children: React.ReactNode;
  theme: 'light' | 'dark';
}) => (
  <div style={{
    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
  }}>
    <h4 style={{
      margin: '0 0 15px 0',
      color: theme === 'dark' ? '#fff' : '#333',
      fontSize: '16px',
      fontWeight: '600'
    }}>
      {title}
    </h4>
    {children}
  </div>
);

export function WaterTypologyWorking({ theme, colorPalette, onInteraction }: WaterTypologyWorkingProps) {
  const [selectedType, setSelectedType] = useState<keyof typeof marineData>('coastal');

  const handleChartClick = useCallback((params: any) => {
    if (params && params.data) {
      onInteraction(`Clicked on ${params.data.name}: ${params.data.value}`);
    }
  }, [onInteraction]);

  const handleChartHover = useCallback((params: any) => {
    if (params && params.data) {
      onInteraction(`Hovering over ${params.data.name}: ${params.data.value}`);
    }
  }, [onInteraction]);

  const handleMapLoad = useCallback(() => {
    onInteraction(`Water typologies map loaded successfully!`);
  }, [onInteraction]);

  const handleMapError = useCallback((error: Error) => {
    onInteraction(`Water typologies map loading failed: ${error.message}`);
  }, [onInteraction]);

  const commonProps: Partial<GeoChartProps> = useMemo(() => ({
    theme,
    height: 500,
    onClick: handleChartClick,
    onMouseOver: handleChartHover,
    visualMap: {
      show: true,
      left: 'right',
      colors: colorPalette.slice(0, 6).reverse(),
      text: ['High', 'Low'],
      calculable: true,
    },
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
      formatter: '{b}: {c}',
    },
    toolbox: {
      show: true,
      features: {
        dataView: true,
        restore: true,
        saveAsImage: true,
      },
    },
    roam: true,
  }), [theme, handleChartClick, handleChartHover, colorPalette]);

  return (
    <div>
      {/* Marine Type Selection */}
      <div style={{
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
        borderRadius: '6px',
      }}>
        <label style={{
          marginRight: '10px',
          fontWeight: 'bold',
          color: theme === 'dark' ? '#fff' : '#333'
        }}>
          Select Marine Type:
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as keyof typeof marineData)}
          style={{
            padding: '5px 10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: theme === 'dark' ? '#444' : '#fff',
            color: theme === 'dark' ? '#fff' : '#333'
          }}
        >
          <option value="coastal">🌊 Coastal Waters</option>
          <option value="fjord">🏔️ Fjord Systems</option>
          <option value="ocean">🌌 Open Ocean</option>
        </select>
      </div>

      <ExampleCard title={`🌊 Norwegian Water Typologies`} theme={theme}>
        <p style={{
          margin: '0 0 15px 0',
          color: theme === 'dark' ? '#ccc' : '#666',
          fontSize: '14px',
        }}>
          Interactive map showing Norwegian marine environments with different water types.
        </p>
        
        <GeoChart
          data={marineData[selectedType]}
          mapName="NorwayWaterTypologies"
          mapUrl="/norwegian_water_typologies_with_map.svg"
          mapType="svg"
          chartType="map"
          title={`Norwegian Water Typologies - ${selectedType}`}
          {...commonProps}
          onMapLoad={handleMapLoad}
          onMapError={handleMapError}
        />
      </ExampleCard>
    </div>
  );
}